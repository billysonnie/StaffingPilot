# StaffingPilot

A coverage visualizer for workforce management. It turns call volume and handle-time numbers into a model estimate of the agents needed each half hour, using the Erlang C formula, and plots that against your scheduled agents so coverage gaps are obvious.

**All data in this repo is fictional demo data for an imaginary "Northside Contact Center". No real company, customer, or employee data.**

## What it does

- Computes required agents per half-hour interval with Erlang C, given a service-level target (for example 80% of calls answered in 20 seconds).
- Adds a shrinkage allowance (breaks, training, absence) on top of the raw requirement.
- Plots required versus scheduled agents and shades understaffed intervals.
- Summarizes the day: peak requirement, worst interval gap, and time understaffed (how long the schedule falls short, not agent-hours missing).

## Run it

No build, no dependencies. Open `index.html` in a browser, or serve the folder with any static file server. It also works as-is on GitHub Pages.

## Try your own numbers

Edit `data.js`: replace the fictional `CALLS` and `SCHEDULED` arrays with your interval data (calls offered and staffed agents per half hour). Service-level target, shrinkage, and handle time are adjustable in the page.

## Model limitations

Erlang C assumes calls arrive randomly (Poisson), handle times vary exponentially, callers never hang up, and each interval is steady-state. Real contact centers break all of these at times. Treat the output as an illustrative planning estimate, not an operational staffing guarantee.

## How it works

`erlang.js` implements the Erlang C probability model in plain JavaScript (log-space factorial sums for numerical stability). For each interval, calls and average handle time give a traffic load in Erlangs; the smallest agent count whose predicted service level meets the target becomes the requirement.

## Tech

Vanilla HTML, CSS and JavaScript. No frameworks, no trackers, no network calls. Everything runs locally in the browser.
