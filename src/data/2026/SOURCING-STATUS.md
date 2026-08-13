# 2026 Tax Data — Sourcing Status

Source-of-truth tracker for the 2026 tax-year data build. Records what has
been populated, what source each figure came from, and anything **unsourced or
not yet finalized** by the taxing authority. Update this file as data lands.

Last updated: 2026-08-12 (state fan-out complete)

## How to read this

- **Status** — `done` (populated + sourced), `partial` (populated but some
  figures provisional/estimated), `missing` (file not yet created), `no-tax`
  (state has no wage income tax; file is a trivial `NONE` copy of 2025).
- **Flag anything provisional here.** If a state's 2026 brackets weren't
  published yet and 2025 values were carried forward, say so in Notes with an
  explicit `CARRIED FROM 2025` marker so it can be revisited.

## Federal — `src/data/2026/federal.ts`

**Status: done.** TY2026 figures per IRS Rev. Proc. 2025-32 (reflecting the
One Big Beautiful Bill Act), IRS Notice 2025-67 (retirement limits), and the
SSA 2026 wage-base announcement.

| Item | 2026 value | Source |
|------|-----------|--------|
| Standard deduction (S / MFS) | $16,100 | IRS Rev. Proc. 2025-32 |
| Standard deduction (MFJ) | $32,200 | IRS Rev. Proc. 2025-32 |
| Standard deduction (HoH) | $24,150 | IRS Rev. Proc. 2025-32 |
| Income brackets (all statuses) | see file | Tax Foundation 2026 table / IRS |
| Social Security wage base | $184,500 @ 6.2% | SSA 2026 announcement |
| Medicare thresholds | statutory, unchanged | IRC §3101 (not indexed) |
| 401(k) elective deferral limit | $24,500 | IRS Notice 2025-67 |

**Note on Married Filing Separately:** MFS brackets follow the statutory
MFJ/2 rule (IRC §1), so the 35% cap is $384,350, not the single-filer
$640,600. This matches the repo's 2025 precedent. Web tables often mis-state
MFS by copying single-filer thresholds — do not.

## States (50 + DC)

All 51 files present and the repo validator (`npm run validate-tax-data`)
passes. 50 states were drafted by the Sonnet fan-out; Oregon pre-existed.
**6 files carry at least one provisional figure** — listed in detail below.

| State | Status | Notes |
|-------|--------|-------|
| alabama | done | rates + brackets unchanged; SD & city occupational rates confirmed |
| alaska | no-tax | NONE |
| arizona | done | flat 2.5%; SD updated to OBBBA amounts |
| arkansas | done | SD + bracket thresholds inflation-updated; top rate 3.9% |
| california | done | brackets/SD not indexed (= 2025); SDI rate 1.2%→1.3% |
| colorado | done | flat 4.4%; OPT city rates carried (municipality-set) |
| connecticut | **provisional** | all values carried from 2025 — CT DOR 2026 circular not yet published |
| delaware | done | brackets/SD unchanged; Wilmington wage tax corrected 1.5%→1.25% (2025 file was wrong) |
| district_of_columbia | done | brackets/SD unchanged; PFL 0.75% confirmed |
| florida | no-tax | NONE |
| georgia | done | HB 463: flat rate 5.19%→4.99%, SD raised (retroactive to 2026-01-01) |
| hawaii | done | Act 46 SD phase-in; brackets confirmed |
| idaho | done | |
| illinois | done | flat rate |
| indiana | done | flat rate |
| iowa | done | |
| kansas | done | |
| kentucky | done | flat rate |
| louisiana | done | |
| maine | done | |
| maryland | done | |
| massachusetts | done | |
| michigan | done | flat rate |
| minnesota | done | |
| mississippi | done | |
| missouri | done | |
| montana | done | |
| nebraska | **provisional** | LB754 rate cut to 4.55% confirmed; HOH standard deduction derived (DOR publishes only single/joint) |
| nevada | no-tax | NONE |
| new_hampshire | no-tax | interest/dividends structure retained |
| new_jersey | done | |
| new_mexico | done | |
| new_york | done | |
| north_carolina | done | flat rate |
| north_dakota | done | |
| ohio | done | |
| oklahoma | done | |
| oregon | done | pre-existing 2026 file (still verify against final 2026 figures) |
| pennsylvania | **provisional** | flat 3.07% confirmed; Philadelphia wage tax has a mid-2026 change (3.74%→3.735% on 2026-07-01); other city rates carried |
| rhode_island | done | |
| south_carolina | done | |
| south_dakota | no-tax | NONE |
| tennessee | no-tax | NONE |
| texas | no-tax | NONE |
| utah | done | flat rate |
| vermont | **provisional** | corrected 2025 official schedule carried forward (fan-out's derived 2026 numbers were backwards); revisit when VT publishes 2026 |
| virginia | done | |
| washington | **provisional** | no wage tax; WA Cares 0.58% confirmed; capital-gains SD threshold carried from 2025 (2026 indexed amount unpublished) |
| west_virginia | done | |
| wisconsin | done | Single/Married from Tax Foundation 2026; MFS (=Married/2) and HOH (=Single) derived per 2025 pattern — flagged as derived |
| wyoming | no-tax | NONE |

## Provisional detail (revisit before relying on these)

- **connecticut** — Entire schedule carried from 2025. CT enacted no 2026
  changes per Tax Foundation, but the official IP-2026(7) withholding circular
  confirming final thresholds was not published at build time.
- **nebraska** — LB754 rate cut (top rate → 4.55%, 4→3 brackets) and
  single/joint standard deductions confirmed from DOR. **HOH standard
  deduction ($12,950) is derived** by applying the 2025 HOH/single ratio to
  the 2026 single amount — DOR does not publish an HOH figure.
- **pennsylvania** — State flat 3.07% confirmed. **Philadelphia resident wage
  tax changes mid-year** (3.74% through 2026-06-30, then 3.735% from
  2026-07-01); the file carries 3.74%. Other municipal rates carried from 2025.
- **vermont** — Single/MFJ from official 2026 withholding instructions
  (GB-1210-2026); MFS = MFJ/2 (verified pattern). **HOH thresholds are
  estimated** via inflation-scaling until the return-filing rate schedule
  (TaxRateSched-2026.pdf) is posted.
- **washington** — No wage income tax. WA Cares 0.58% and capital-gains rates
  confirmed. **Capital-gains standard-deduction threshold carried from the
  2025 file** ($270,000) because the 2026 indexed amount is unpublished. Note
  the agent observed the 2025 file itself may lag the true 2025 figure
  ($278,000) — worth a separate check.
- **wisconsin** — Single/Married brackets + SD from Tax Foundation 2026.
  **MFS (=Married/2) and HOH (=Single) thresholds are derived** per the 2025
  file's pattern, not directly published by WI DOR.

## Data-quality flags found in the 2025 source files

The fan-out surfaced pre-existing errors in `src/data/2025/`. **Both were fixed
in the 2025 originals on 2026-08-12** (spot-check confirmed against sources):

- **delaware** — Wilmington city wage tax was `1.5%`; corrected to `1.25%`
  (confirmed via City of Wilmington + multiple payroll sources). Fixed in 2025
  and 2026.
- **vermont** — The 2025 file had a spurious `5.4%` bracket (VT has 4 non-zero
  rates: 3.35 / 6.60 / 7.60 / 8.75%) **and** wrong thresholds. Replaced the
  whole schedule with the official 2025 return rate schedule (Single/MFS caps
  53225 / 123525 / 253525; MFJ/HOH 93975 / 210925 / 315475), cross-checked
  across two independent sources and the official withholding charts.

### Resolved: 2026 Vermont carried from corrected 2025

The fan-out's 2026 Vermont brackets were backwards (single 3.35% cap below the
2025 value). Replaced on 2026-08-12 by **carrying the corrected official 2025
return schedule forward** (provisional). VT indexes annually, so the true 2026
figures will be slightly higher — revisit once VT publishes TaxRateSched-2026.
Standard deduction keeps the repo's federal-amount convention ($16,100 /
$32,200 / $16,100 / $24,150).

## Open questions / to revisit

- Several states index brackets to inflation and may not have published final
  2026 figures this early — expect a batch of `CARRIED FROM 2025` entries.
- Oregon 2026 was pre-existing and has uncommitted edits; confirm its figures
  are true 2026 values before final commit.
