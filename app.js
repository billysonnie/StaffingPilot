"use strict";

const TARGET_SECONDS = { "0.8": 20, "0.9": 20, "0.7": 30 };

function compute() {
  const sl = parseFloat(document.getElementById("slTarget").value);
  const shrink = parseFloat(document.getElementById("shrinkage").value);
  const aht = parseInt(document.getElementById("aht").value, 10);
  const tSec = TARGET_SECONDS[String(sl)] || 20;

  const need = CALLS.map(c => {
    const base = requiredAgents(c, 30, aht, sl, tSec);
    return base === 0 ? 0 : Math.ceil(base / (1 - shrink));
  });

  render(need, SCHEDULED);
  summarize(need, SCHEDULED);
}

function summarize(need, sched) {
  const peakNeed = Math.max(...need);
  const peakSched = Math.max(...sched);
  let worstGap = 0, under = 0;
  for (let i = 0; i < need.length; i++) {
    worstGap = Math.max(worstGap, need[i] - sched[i]);
    if (need[i] > sched[i]) under += 0.5;
  }
  document.getElementById("peakNeed").textContent = peakNeed;
  document.getElementById("peakSched").textContent = peakSched;
  document.getElementById("worstGap").textContent = worstGap > 0 ? worstGap + " agents" : "none";
  document.getElementById("underHours").textContent = under.toFixed(1) + " h";
}

function render(need, sched) {
  const svg = document.getElementById("chart");
  const W = 960, H = 360, padL = 44, padR = 16, padT = 16, padB = 40;
  const iw = W - padL - padR, ih = H - padT - padB;
  const n = need.length;
  const maxY = Math.ceil(Math.max(...need, ...sched) * 1.15);
  const bw = iw / n;
  const y = v => padT + ih - (v / maxY) * ih;

  let out = "";
  // gridlines + y labels
  for (let g = 0; g <= maxY; g += Math.max(1, Math.round(maxY / 5))) {
    out += `<line x1="${padL}" y1="${y(g)}" x2="${W - padR}" y2="${y(g)}" class="grid"/>`;
    out += `<text x="${padL - 8}" y="${y(g) + 4}" class="ylabel" text-anchor="end">${g}</text>`;
  }
  // understaffed interval shading
  for (let i = 0; i < n; i++) {
    if (need[i] > sched[i]) {
      out += `<rect x="${padL + i * bw}" y="${padT}" width="${bw}" height="${ih}" class="gapband"/>`;
    }
  }
  // required bars
  for (let i = 0; i < n; i++) {
    out += `<rect x="${padL + i * bw + 3}" y="${y(need[i])}" width="${bw - 6}" height="${padT + ih - y(need[i])}" rx="3" class="barNeed"><title>${INTERVALS[i]}: ${need[i]} required, ${sched[i]} scheduled</title></rect>`;
  }
  // scheduled line
  const pts = sched.map((v, i) => `${padL + i * bw + bw / 2},${y(v)}`).join(" ");
  out += `<polyline points="${pts}" class="lineSched"/>`;
  for (let i = 0; i < n; i++) {
    out += `<circle cx="${padL + i * bw + bw / 2}" cy="${y(sched[i])}" r="3.5" class="dotSched"/>`;
  }
  // x labels every 2 hours
  for (let i = 0; i < n; i += 4) {
    out += `<text x="${padL + i * bw + bw / 2}" y="${H - 14}" class="xlabel" text-anchor="middle">${INTERVALS[i]}</text>`;
  }
  svg.innerHTML = out;
}

document.getElementById("slTarget").addEventListener("change", compute);
document.getElementById("shrinkage").addEventListener("change", compute);
document.getElementById("aht").addEventListener("change", compute);
compute();
