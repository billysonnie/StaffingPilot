// Erlang C staffing math. No dependencies.
"use strict";

// Log of n! via lgamma-style recurrence (n is small: < 200).
function logFact(n) {
  let s = 0;
  for (let i = 2; i <= n; i++) s += Math.log(i);
  return s;
}

// Probability that a call waits > 0, given traffic intensity a (Erlangs) and n agents.
function erlangC(a, n) {
  if (n <= a) return 1; // unstable: more work than capacity
  // sum_{k=0}^{n-1} a^k/k! computed in log space for stability
  let maxLog = -Infinity;
  const logs = [];
  for (let k = 0; k <= n - 1; k++) {
    const v = k * Math.log(a) - logFact(k);
    logs.push(v);
    if (v > maxLog) maxLog = v;
  }
  let sum = 0;
  for (const v of logs) sum += Math.exp(v - maxLog);
  const logSum = maxLog + Math.log(sum);
  const logLast = n * Math.log(a) - logFact(n) + Math.log(n / (n - a));
  return 1 / (1 + Math.exp(logSum - logLast));
}

// Service level: fraction of calls answered within t seconds.
function serviceLevel(a, n, ahtSeconds, targetSeconds) {
  if (n <= a) return 0;
  const pw = erlangC(a, n);
  return 1 - pw * Math.exp(-(n - a) * (targetSeconds / ahtSeconds));
}

// Smallest n meeting the SL target.
function requiredAgents(callsPerInterval, intervalMinutes, ahtSeconds, targetSL, targetSeconds) {
  const a = callsPerInterval * (ahtSeconds / 60) / intervalMinutes; // Erlangs
  if (callsPerInterval <= 0) return 0;
  for (let n = Math.max(1, Math.ceil(a)); n < 400; n++) {
    if (serviceLevel(a, n, ahtSeconds, targetSeconds) >= targetSL) return n;
  }
  return 400;
}
