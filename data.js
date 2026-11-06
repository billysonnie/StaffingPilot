// Fictional demo data for the imaginary "Northside Contact Center".
// Half-hour intervals from 08:00 to 19:30 (24 intervals).
"use strict";

const INTERVALS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30"
];

// Fictional call volumes per interval (calls offered).
const CALLS = [
  22, 35, 58, 74, 88, 96, 102, 95,
  78, 64, 60, 68, 82, 94, 105, 110,
  104, 96, 88, 74, 58, 44, 32, 24
];

// Fictional shift plan: agents on the floor per interval (before shrinkage).
// Two waves of shifts plus a midday dip for lunches.
const SCHEDULED = [10,15,22,27,31,34,35,33,26,23,22,25,30,33,35,36,37,35,32,28,23,18,15,12];
