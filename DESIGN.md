# STAND DOWN — design

*Working title. A turn-based Cold War crisis game on a hex board, built from the INTERCEPT engine.*

---

## 1. Pitch

You are the duty commander of one superpower's warning and strategic forces during a
crisis week. You **win by getting to the end of the week without a nuclear exchange** —
and without leaving your forces so exposed that the other side is tempted to go first.

Everything you know arrives through sensors that can be wrong. The game is about reading
intent through fog, under a clock, and having the nerve to *not* act on a track you cannot
confirm.

## 2. Design pillars

1. **Restraint is the skill.** The strongest moment in the game is correctly holding fire on
   a track that looked real. No outcome after an exchange is a win.
2. **The security dilemma is the core loop.** Everything that makes you safer — higher
   readiness, bombers in the air, submarines at sea — is visible to the other side and makes
   them more nervous. Everything that calms them makes you more exposed.
3. **Two sensors or it isn't real.** Confirmation requires two *different kinds* of sensor
   to agree. One sensor alone can be fooled; the design is built around that rule and the
   rare cases that beat it.
4. **The fog lifts afterwards.** The debrief reveals the opponent's true tension, intent and
   every incident's real nature. A game about reading hidden information only teaches if you
   find out what was hidden.
5. **Turn-based, hex, dice, readable.** Keep INTERCEPT's identity. Not real-time, not a
   glowing world map.

## 3. Setting and scope

| Decision | Recommendation | Why |
|---|---|---|
| Powers | **Two fictional blocs** (Blue, Red) inspired by the Cold War | Freedom to balance; no claim of historical accuracy; avoids re-enacting real people |
| Incidents | **Modelled on real incident types** (sensor faults, training data in the system, research rockets, tests) | They are the most interesting part of the history and need no real names |
| Player side | Blue only at first; Red as a later option | One side halves the content work |
| Map | Two blocs across an ocean, 30×30 hexes at ~250 km/hex | Fits the existing board; a polar route can come later |
| Session length | 30–45 minutes per crisis week | One sitting; the save system covers interruptions |

All open — see §14.

## 4. The player's levers

### 4.1 Readiness (the big dial)

Five levels, **R5 Peacetime → R1 Launch posture**. Each step up:

- raises the **survivability** of your forces against a surprise strike (§4.2);
- is **seen by the other side** and raises their tension (§6);
- costs **sustainability** — high readiness cannot be held indefinitely (bomber crews tire,
  submarines must return). Reuses INTERCEPT's loiter/sortie limits.

Stepping down is slower than stepping up (one level per crisis turn), so over-reacting has
a lasting cost.

### 4.2 Force posture → exposure

| Force | Survives a surprise strike when… | Cost of keeping it safe |
|---|---|---|
| Missile fields (silos) | Hardened: partial survival at any readiness | None — but they are the enemy's counterforce target |
| Bombers | **Airborne** (readiness ≤ R3) | Limited airborne time; returning aircraft are vulnerable on the ground |
| Missile submarines | **At sea** (surged at ≤ R3) | Time at sea is finite; in port they are sitting targets |
| Command | Always targetable; dispersal at ≤ R2 | Dispersal is highly visible |

The left panel shows **Exposure**: the share of your retaliatory force that would survive if
they struck now. This is your **second-strike credibility**. If it falls too low, the
opponent's temptation to strike first rises (§6) — so sitting at R5 all week is *not* safe.

### 4.3 Sensor tasking

Each crisis turn you get a small number of sensor actions:

- **Satellite pass** over a region — reveals forces and activity (and is seen as provocative
  if over their territory).
- **Reconnaissance flight** — reveals more, is more provocative, can be lost.
- **Radar focus** — extends one early-warning radar's range for the next alert.

### 4.4 The hotline

A limited resource (a few uses per week). Using it lowers tension and can ask for an
explanation of a specific activity. The answer may be true, partly true, or a lie — weighted
by the opponent's actual intent. Overuse reads as weakness and stops working.

### 4.5 Alert decisions

When a possible launch appears, the game drops to alert turns (§7). Each alert turn you choose:

| Action | Effect |
|---|---|
| **Hold** | Wait one alert turn for more information |
| **Query raw feed** | Check a sensor's raw data instead of the processed display — the only way to catch a fault *upstream* of the sensors (§5.2). Costs the turn |
| **Hotline** | Ask them directly. Costs a use; the answer may be a lie |
| **Raise readiness** | Get bombers up and boats to sea before impact. Seen by them |
| **Retaliate** | Choose a pre-built plan (§8). Irreversible |
| **Stand down** | Declare the alert false and end it |

Standing down on a *real* attack, or holding too long, means absorbing a first strike with
whatever exposure you had. That is the counterweight that keeps "always hold" from being
the answer.

## 5. The information model

### 5.1 Sensors

| Sensor | Sees | When | Range |
|---|---|---|---|
| **Satellite IR** | Missile launches | Only during boost (first 1–2 alert turns) | Global over land and sea |
| **Early-warning radar** | Missiles in flight | Once over the radar horizon | ~8 hexes, coverage outline on the board |
| **Intelligence** | Activity at bases, alert levels, movements | Crisis turns only | Noisy estimate |
| **Allied stations** *(later)* | Extends radar in one sector | Alert turns | Fixed |

A track is **confirmed** when it has been seen by *two different kinds* of sensor.
The INTERCEPT ghost mechanics map directly onto this: a false track carries the same fields
as a real one and differs only in a hidden flag, so no single display can tell them apart.

### 5.2 The incident catalogue

| Incident | Real? | IR | Radar | Tell | Resolves as |
|---|---|---|---|---|---|
| **Sensor fault** | No | one of | the two | Never confirms | Fades |
| **Natural phenomenon** (sunlight on high cloud, aurora) | No | IR *or* radar | | Odd geometry; repeats near the same place | Fades |
| **Training data in the system** | No | shows | shows | **Both confirm** — the hardest case. Only *Query raw feed* reveals nothing behind it | Vanishes when caught, or at "impact" time |
| **Research rocket / third-party launch** | Yes | yes | yes | Trajectory heads away from you (pole, ocean) | Splashes down |
| **Weapons test** | Yes | yes | yes | Aimed at open ocean; often timed to coerce | Splashes down |
| **Limited strike** | Yes | yes | yes | Few tracks, one target set | Impact |
| **First strike** | Yes | yes | yes | Many tracks; **submarine launches first**, close in, short warning | Impact |
| **Bomber movement** | Yes | — | yes (slow) | Hours, not minutes — a crisis-turn signal | Turns back, or doesn't |

The training-data case matters: it teaches that "two sensors agree" is a strong rule, not an
absolute one, and gives *Query raw feed* a reason to exist.

### 5.3 Intelligence estimates

You never see the opponent's tension directly. You see an **estimate with error**, and the
error is wider when you have spent fewer sensor actions on them. The estimate's confidence is
shown, so the player can reason about how far to trust it.

## 6. The opponent

The opponent is a hidden state machine with two variables: **tension** (0–100) and **intent**.

### 6.1 Tension

Rises with: your readiness level, your surged forces, provocative overflights, your
over-reactions to incidents, and *their own* false alarms while you are at high readiness.
Falls with: time, hotline use, your stand-downs, and visible de-escalation.

### 6.2 Intent

| Intent | Typical actions | Moves toward… |
|---|---|---|
| **Calm** | Routine activity | Probing as tension rises |
| **Probing** | Recon, exercises, the odd test | Coercing, or back to Calm |
| **Coercing** | Tests timed to frighten, bomber movements, hotline bluffs | Preparing, or Probing if you hold steady |
| **Preparing** | Real readiness increases, dispersal | Committed if your exposure is high *and* tension stays high |
| **Committed** | A real strike within a few turns | — |

Two independent paths to disaster:

1. **Deliberate.** They reach *Committed* because tension stayed high *and* your exposure
   made a first strike look survivable for them. Low readiness is not automatically safe.
2. **Mistaken.** They suffer their own false alarm while their tension is high and your
   readiness looks threatening, and they launch on warning. High readiness is not
   automatically safe either.

### 6.3 Readable signals

Each intent state has consistent, observable tells (activity patterns at their bases,
hotline tone, kinds of tests). They are noisy but not random — a careful player can read
them, and the debrief shows whether they did.

## 7. Turn structure

### 7.1 Crisis turn (6 hours)

1. **Intelligence** — reports arrive: activity, estimate update, any bomber movements.
2. **Decisions** — set readiness (one step), task sensors, use the hotline, move forces.
3. **Opponent** — hidden tension and intent update; they act.
4. **Incident check** — a d20 roll against a band that rises with tension (INTERCEPT's
   lull-arrival roll). A hit drops into alert turns.

### 7.2 Alert turn (5 minutes)

1. Tracks move; each sensor reports independently.
2. You choose one action from §4.5.
3. Resolution — confirmation, splashdown, impact or fade.

### 7.3 Timing

| Weapon | Flight time | Alert turns of warning |
|---|---|---|
| Land-based missile from their territory | ~30 min | ~6 |
| Submarine missile from close in | ~10–15 min | 2–3 |
| Bomber | hours | crisis-turn scale |

A week is 28 crisis turns. A typical week should produce 4–8 alerts.

## 8. Outcomes and scoring

| Band | How you get there |
|---|---|
| **Stood down** | Week ends, no exchange, their tension below a threshold, your readiness back at R4–R5 |
| **Uneasy peace** | Week ends with no exchange, but tension is high or you are still at high readiness |
| **Close call** | No exchange, but someone came within a turn of launching (revealed in the debrief) |
| **Limited exchange** | A limited strike happened — whoever started it |
| **General war** | Full exchange |
| **Fired on nothing** | You launched at a false alarm — the worst result, scored separately |

Every band from *Limited exchange* down is a loss. Retaliation plans (*Limited*,
*Counterforce*, *Full*) change the damage and the opponent's response, but none of them turns
an exchange into a win.

## 9. The debrief

Reuses INTERCEPT's written-assessment generator and adds the reveal:

- the **true tension curve** drawn against your estimate;
- the opponent's **intent timeline**;
- **every incident's true nature**, and what you did about it;
- the **moments someone nearly launched**;
- a written assessment of the decisions that mattered.

## 10. Difficulty

The same pattern as INTERCEPT's `DIFFICULTY` table: change what the world throws at you,
never the scoring thresholds.

| Lever | Easy → Hard |
|---|---|
| Starting tension | Low → high |
| Intelligence noise | Narrow → wide |
| False-alarm rate | Rare → frequent, more upstream faults |
| Opponent paranoia (their launch-on-warning threshold) | High → low |
| Readability of intent signals | Clear → subtle |
| Crisis length | 5 → 9 days |

## 11. What comes from INTERCEPT

| INTERCEPT piece | Use here | Status |
|---|---|---|
| Hex geometry, terrain from ASCII, depth-shaded fills | The board | **In the starter (M0)** |
| SVG board renderer, delegated clicks | The board | **In the starter** |
| Coverage outlines | Radar coverage, later satellite footprints | **In the starter** |
| Popup, log, modal, keyboard (Space follows the primary button) | UI shell | **In the starter** |
| Save/resume (versioned, Infinity-safe terrain) | Same; also converts the tracks' sensor-history Sets | **In the starter** |
| `stepToward` flight | Missile and bomber tracks | **In the starter** |
| Lull arrival roll | Incident check | Placeholder in starter |
| Ghost flag + the leak-audit test | False tracks indistinguishable on any single sensor | M3 |
| Burn-through (close sensor reveals a ghost) | Second sensor / raw-feed query confirms | M3 |
| Aircraft loiter, sorties, divert-when-base-falls | Bombers on airborne alert | M1 |
| `DIFFICULTY` table pattern | §10 | M5 |
| After-action report + written assessment | Debrief | M4 |
| Map editor, saved maps | Scenario editing | M5 (optional) |

## 12. Milestones

Each milestone ends with its tests passing in CI and the game playable.

| | Milestone | Scope | Tests added | Size |
|---|---|---|---|---|
| **M0** | **Starter** *(done)* | Engine carried over; placeholder two-cadence loop; CI and Pages deploy | boot, full-week loop, save/resume | — |
| **M1** | **Map, forces, posture** | Final map and orders of battle; bombers airborne alert; submarine surge; readiness effects; exposure panel | exposure calculation; posture survives save | 1 session |
| **M2** | **The opponent** | Hidden tension and intent machine; intelligence estimates with error; hotline; incidents driven by intent; **seedable random numbers** so tests are repeatable | tension responds to provocation; estimates never leak the truth; same seed → same week | 2 sessions |
| **M3** | **Alerts for real** | Full incident catalogue; sensor ranges and boost windows; confirmation; raw-feed query; real attacks with submarine short warning | **leak audit** (a false track is identical to a real one on every single-sensor surface); every incident type resolves | 2 sessions |
| **M4** | **Retaliation and outcomes** | Retaliation plans; area damage; their response; outcome bands; debrief with the reveal | every band reachable; debrief shows true values | 1–2 sessions |
| **M5** | **Polish** | Rules and briefing; difficulty; tuning from autoplay statistics; mobile layout (INTERCEPT's appendix applies directly) | difficulty invariants; balance sweep | 2 sessions |

About 8–10 sessions to a complete game.

## 13. Risks

| Risk | Mitigation |
|---|---|
| **Passivity** — the week becomes "end turn" spam | Every crisis turn presents at least one report that wants a response; limited actions make each one a choice |
| **The AI feels random** | Consistent tells per intent state; the debrief reveals the truth so players can learn the tells |
| **A degenerate strategy** (always R5, always hold) | Low readiness raises their temptation to strike first; real attacks exist, so blind holding loses |
| **No climax** because exchanges are losses | The alert phase is the climax; correctly holding on a frightening track is the payoff moment |
| **Tone** | Sober presentation, fictional blocs, no glorification; the debrief speaks plainly about consequences |
| **Drifting toward an existing game** | Stay turn-based on hexes, crisis-focused, information-first — not real-time global war on a vector map |

## 14. Open decisions

1. Fictional blocs (recommended) or a historical setting?
2. Keep the working title *STAND DOWN*?
3. Side-by-side continents (current) or a polar projection with missile routes over the pole?
4. Player side fixed to Blue, or selectable later?
5. Licence for the public repo (e.g. MIT, or all rights reserved)?
