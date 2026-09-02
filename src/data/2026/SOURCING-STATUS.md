# 2026 Tax Data — Sourcing Status

Source-of-truth tracker for the 2026 tax-year data build. Records what has
been populated, what source each figure came from, and anything **unsourced or
not yet finalized** by the taxing authority. Update this file as data lands.

Last updated: 2026-08-31 (Eugene rate lookup, WA capital gains, Irondale, MO earnings tax)

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

| Item                           | 2026 value           | Source                          |
| ------------------------------ | -------------------- | ------------------------------- |
| Standard deduction (S / MFS)   | $16,100              | IRS Rev. Proc. 2025-32          |
| Standard deduction (MFJ)       | $32,200              | IRS Rev. Proc. 2025-32          |
| Standard deduction (HoH)       | $24,150              | IRS Rev. Proc. 2025-32          |
| Income brackets (all statuses) | see file             | Tax Foundation 2026 table / IRS |
| Social Security wage base      | $184,500 @ 6.2%      | SSA 2026 announcement           |
| Medicare thresholds            | statutory, unchanged | IRC §3101 (not indexed)         |
| 401(k) elective deferral limit | $24,500              | IRS Notice 2025-67              |

**Note on Married Filing Separately:** MFS brackets follow the statutory
MFJ/2 rule (IRC §1), so the 35% cap is $384,350, not the single-filer
$640,600. This matches the repo's 2025 precedent. Web tables often mis-state
MFS by copying single-filer thresholds — do not.

## States (50 + DC)

All 51 files present and the repo validator (`npm run validate-tax-data`)
passes. 50 states were drafted by the Sonnet fan-out; Oregon pre-existed.
**6 files carry at least one provisional figure** — listed in detail below.

| State                | Status          | Notes                                                                                                                            |
| -------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| alabama              | done            | rates + brackets unchanged; SD & city occupational rates confirmed                                                               |
| alaska               | no-tax          | NONE                                                                                                                             |
| arizona              | done            | flat 2.5%; SD updated to OBBBA amounts                                                                                           |
| arkansas             | done            | SD + bracket thresholds inflation-updated; top rate 3.9%                                                                         |
| california           | done            | brackets/SD not indexed (= 2025); SDI rate 1.2%→1.3%                                                                             |
| colorado             | done            | flat 4.4%; OPT city rates carried (municipality-set)                                                                             |
| connecticut          | **provisional** | all values carried from 2025 — CT DOR 2026 circular not yet published                                                            |
| delaware             | done            | brackets/SD unchanged; Wilmington wage tax corrected 1.5%→1.25% (2025 file was wrong)                                            |
| district_of_columbia | done            | brackets/SD unchanged; PFL 0.75% confirmed                                                                                       |
| florida              | no-tax          | NONE                                                                                                                             |
| georgia              | done            | HB 463: flat rate 5.19%→4.99%, SD raised (retroactive to 2026-01-01)                                                             |
| hawaii               | done            | Act 46 SD phase-in; brackets confirmed                                                                                           |
| idaho                | done            |                                                                                                                                  |
| illinois             | done            | flat rate                                                                                                                        |
| indiana              | done            | flat rate                                                                                                                        |
| iowa                 | done            |                                                                                                                                  |
| kansas               | done            |                                                                                                                                  |
| kentucky             | done            | flat rate                                                                                                                        |
| louisiana            | done            |                                                                                                                                  |
| maine                | done            |                                                                                                                                  |
| maryland             | done            |                                                                                                                                  |
| massachusetts        | done            |                                                                                                                                  |
| michigan             | done            | flat rate                                                                                                                        |
| minnesota            | done            |                                                                                                                                  |
| mississippi          | done            |                                                                                                                                  |
| missouri             | done            |                                                                                                                                  |
| montana              | done            |                                                                                                                                  |
| nebraska             | **provisional** | LB754 rate cut to 4.55% confirmed; HOH standard deduction derived (DOR publishes only single/joint)                              |
| nevada               | no-tax          | NONE                                                                                                                             |
| new_hampshire        | no-tax          | interest/dividends structure retained                                                                                            |
| new_jersey           | done            |                                                                                                                                  |
| new_mexico           | done            |                                                                                                                                  |
| new_york             | done            |                                                                                                                                  |
| north_carolina       | done            | flat rate                                                                                                                        |
| north_dakota         | done            |                                                                                                                                  |
| ohio                 | done            |                                                                                                                                  |
| oklahoma             | done            |                                                                                                                                  |
| oregon               | done            | pre-existing 2026 file (still verify against final 2026 figures)                                                                 |
| pennsylvania         | **provisional** | flat 3.07% confirmed; Philadelphia wage tax has a mid-2026 change (3.74%→3.735% on 2026-07-01); other city rates carried         |
| rhode_island         | done            |                                                                                                                                  |
| south_carolina       | done            |                                                                                                                                  |
| south_dakota         | no-tax          | NONE                                                                                                                             |
| tennessee            | no-tax          | NONE                                                                                                                             |
| texas                | no-tax          | NONE                                                                                                                             |
| utah                 | done            | flat rate                                                                                                                        |
| vermont              | **provisional** | corrected 2025 official schedule carried forward (fan-out's derived 2026 numbers were backwards); revisit when VT publishes 2026 |
| virginia             | done            |                                                                                                                                  |
| washington           | **provisional** | no wage tax; WA Cares 0.58% confirmed; capital-gains SD threshold carried from 2025 (2026 indexed amount unpublished)            |
| west_virginia        | done            |                                                                                                                                  |
| wisconsin            | done            | Single/Married from Tax Foundation 2026; MFS (=Married/2) and HOH (=Single) derived per 2025 pattern — flagged as derived        |
| wyoming              | no-tax          | NONE                                                                                                                             |

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

## Audit corrections (2026-08-29)

A repo-wide audit found tax types that were present in 2023/2024 and silently
absent from 2025 and 2026 — the 2025 files dropped them and the 2026 fan-out
inherited the omission. Restored in **both** years, with sources:

| Entry                                            | Restored value                                                         | Source                                                                                               |
| ------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| colorado / `colorado_famli`                      | 0.45% (2025) / 0.44% (2026) employee share, capped at the SS wage base | famli.colorado.gov; total premium 0.9% → 0.88% for 2026                                              |
| connecticut / `ct_paid_family_and_medical_leave` | 0.5%, capped at the SS wage base                                       | ctpaidleave.org — Board held the rate at 0.5% for 2026                                               |
| hawaii / `hi_temporary_disability_insurance`     | 0.5% up to $74,969 (2025) / $78,010 (2026)                             | labor.hawaii.gov max weekly wage base $1,441.72 / $1,500.21                                          |
| rhode_island / `standard_deduction`              | 10,900 / 21,800 / 10,900 / 16,350                                      | 2025 RI-1040 instructions. **2026 CARRIED FROM 2025**                                                |
| south_carolina / `standard_deduction`            | 15,000 / 30,000 / 15,000 / 22,500                                      | SC conforms to the IRC as of 2024-12-31 and adds back the OBBBA increase. **2026 CARRIED FROM 2025** |

**Confirmed correct as-is** (absence was not a bug): `colorado/aurora` — Aurora
repealed its occupational privilege tax effective 2025-01-01 (Ordinance
2022-77). A comment now records this so it does not read as another omission.

### Portland Arts Tax rewritten for tax year 2026

`src/data/2026/state/oregon.ts` still carried the old `{ min: 1000, amount: 35 }`.
Portland Ordinance **192185** (passed 2026-05-27) replaced it for **tax year
2026** (first due 2027-04-15):

- $50 for single / MFS / head of household, $100 for married filing jointly
- Threshold is **Oregon taxable income**: $20,000 (single, MFS) or $40,000
  (MFJ, HoH) — the old $1,000 income and federal-poverty exemptions are repealed
- Rate and threshold begin inflation-indexing in tax year 2027 — revisit then

This is the first flat fee that varies by filing status and the first whose
threshold is measured against taxable rather than gross income; both are now
supported by the calculator (`basis` in [../README.md](../README.md)).

### Alabama cities: Mobile and Montgomery removed

Both levied a 1% occupational tax in every year of the data set. Neither has
one. The Alabama League of Municipalities publishes the full roster of
jurisdictions that do — **25 cities**, and neither is on it:

> Attalla 2% · Auburn 1% · Bear Creek 1% · Bessemer 1% · Birmingham 1% ·
> Brilliant 1% · Fairfield 1% · Gadsden 2% · Glencoe 2% · Goodwater 0.75% ·
> Guin 1% · Hacklebug 1% · Haleyville 1% · Hamilton 1% · Leeds 1% · Lynn 1% ·
> Midfield 1% · Mosses 1% · Opelika 1.5% · Rainbow City 2% · Red Bay 0.5% ·
> Shorter 1% · Southside 2% · Sulligent 1% · Tuskegee 2%

Corroborated by: al.com ("Most Alabama cities do not collect occupational
taxes, but there are 25 cities that do"); the City of Mobile's own revenue
pages, which list business license fees only and nothing withheld from wages;
and the Tax Foundation ("Birmingham is not Alabama's largest city by
population, but it is the largest city that taxes income").

**Montgomery has a paper trail.** The City Council passed a 1% occupational tax
in February 2020. In March 2020 Gov. Ivey signed HB 147, requiring legislative
approval for new occupational taxes and retroactively voiding it. As of January
2026 the council's legislative priorities still include seeking permission for
one. The tax was law for roughly three weeks and never took effect — a likely
route for it to have entered this data set from contemporary headlines.

**Macon County** is legitimate — it is a _county_ levy, which is why it does not
appear on the municipal list above. Its rate is **1%**; the 2023 file had 2% and
was corrected. Macon County now reads 1% in all four years.

Removing these two deletes `/{year}/alabama/mobile/` and
`/{year}/alabama/montgomery/` plus their `tax-tables` counterparts.

**Coverage gap narrowed.** The repo carried 4 jurisdictions; it now carries 27
— the League's 25 municipalities, Macon County, and Irondale (added later; see
below, and note that Irondale's absence from the League list means that list is
a floor, not a complete register). Rates below.

| Rate      | Jurisdictions                                                                                                                                                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2%        | Attalla, Gadsden, Glencoe, Rainbow City, Southside (all Etowah County — "the highest in the state"), Tuskegee                                                           |
| 1.5% → 1% | Opelika (cut effective 2025-04-01)                                                                                                                                      |
| 1%        | Auburn, Bear Creek, Bessemer, Birmingham, Brilliant, Fairfield, Guin, Hackleburg, Haleyville, Hamilton, Leeds, Lynn, Macon County, Midfield, Mosses, Shorter, Sulligent |
| 0.75%     | Goodwater                                                                                                                                                               |
| 0.5%      | Red Bay                                                                                                                                                                 |

**Sourcing and caveats:**

- Base roster from the **Alabama League of Municipalities**, which attaches its
  own disclaimer: rates "are those given to the League by survey and should be
  verified with the appropriate entity," and the League "takes no responsibility
  for … the accuracy of this tax rate information." Treat the small-town rates
  as provisional.
- Spot-verified against primary sources: **Auburn 1%** (auburnal.gov, several
  pages); **Opelika** (the city's own quarterly return form: "As of April 1,
  2025, the City of Opelika reduced the withholding fee from 1.5% to 1%");
  the **Etowah County 2% cluster** (al.com and Alabama Daily News, twice).
- The League list spells one town **"Hacklebug"**. The town is **Hackleburg**
  (Marion County); ALDOR lists it as a self-administered locality with Avenu as
  administrator. Corrected here.
- Rates are carried across all four years because Alabama's 2020 HB 147
  grandfathered existing occupational taxes and requires legislative approval
  for new ones. Opelika is the known exception — a _decrease_, which the law
  permits — and is modelled per-year.
- **Opelika 2025 is approximate.** The rate changed mid-year (1.5% through
  2025-03-31, 1% after). The data model has no mid-year mechanism, so 2025
  carries 1%, covering three of four quarters. Same limitation as the
  Philadelphia note above.
- **Possibly still missing:** a later Alabama Daily News piece cites _26_
  jurisdictions rather than 25, and payroll registries (Avenu/Mosey) list
  **Irondale**, **Tarrant** and **Beaverton** as having occupational taxes.
  Irondale has since been confirmed from the city itself and added. Tarrant and
  Beaverton publish no rate I could confirm and are still out.

### Corrections in earlier years

- **2024 federal** — single-filer top bracket started at `609351` against a
  previous `max` of `609350`; the only non-contiguous bracket in the federal
  data. Now `609350`.
- **2025 + 2026 arkansas** — used an inclusive-max convention (`max: 5499`
  beside `min: 5500`) that no other file uses. Normalized to contiguous.
- **south_carolina standard deduction** — SC begins from _federal taxable
  income_, so the federal standard deduction is already reflected. 2023 carried
  the wrong year's figures with head of household copy-pasted from
  married-filing-jointly; 2024 had head of household copy-pasted from single.
  Now 13,850 / 14,600 / 15,000 / 15,000 (single) across the four years, with
  2025–2026 reflecting SC's add-back of the OBBBA increase.
- **2024 massachusetts** — carried a standard deduction. Massachusetts does not
  allow one (mass.gov); it uses personal exemptions. Removed.
- **new_mexico standard deduction** — NM takes the federal amount straight off
  Form 1040 line 12 (PIT-1 line 12 is literally "Federal standard or itemized
  deduction amount"). 2024 was missing entirely; 2023 and 2025 carried stale
  values with head of household copy-pasted from married-filing-jointly. All
  four years now track federal: 13,850 / 14,600 / 15,750 / 16,100 (single).
- **2024 new_jersey** — `nj_disability_insurance` was dropped rather than
  modelled. NJ set the employee rate to 0% for 2023 and 2024; 2023 models that
  explicitly, so 2024 now does too.

## Wage-based taxes moved off the deduction-reduced base

Three tax types were being computed on income _after_ the state standard
deduction when the levying authority computes them on wages:

| Tax type                               | Basis, per the authority                                                                                                                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `occupational_tax` (Alabama, Kentucky) | Louisville Metro: withhold "from the **gross** salaries, wages, commissions". Alabama municipal occupational taxes apply to gross wages. |
| `oregon_transit_tax`                   | Oregon DOR / EY: "calculated based on the employee's **gross wages before any exemptions or deductions**".                               |
| `employee_payroll_tax` (Eugene)        | Applied to wages, not to income after Oregon's standard deduction.                                                                       |

All three now sit in `grossIncomeTaxes` in `utils/calculator.ts`, alongside FICA
and the state paid-leave programs. Effect at $100,000 single: Birmingham
$970 → $1,000, Oregon transit $97.17 → $100.

City and county _income_ taxes were deliberately left on the after-deduction
base — Maryland's county tax, Indiana's county tax and NYC all start from state
taxable income, so that is correct for them.

### Resolved: Eugene's threshold is a rate lookup, not a bracket floor

Settled against the City's own published rate charts (`eugene-or.gov`
DocumentCenter 83387, 79205, 70580, 65902) and the Form EUG-PY-2 instructions.
The charts state the rule outright:

> "The purpose of the tax rate chart is to obtain the rate to be applied to
> **all** subject wages paid in a pay period."

and the return instructions repeat it: "The tax rates … are based on the gross
wages, less overtime wages, for the pay period. The applicable tax rate is then
applied to subject wages." So the bands select a rate; they do not bound what it
is charged on. Patriot Software's reading was right and the bracket-floor model
was wrong — it understated the tax at **every** income above the threshold
($302.26 instead of $440 on $100,000).

The calculator now supports this as a third schedule kind, marked with
`rate_on_total` (see [../README.md](../README.md)). Published annual charts:

| Chart period         | Exempt below | 0.30% band | 0.44% at or above | Used for       |
| -------------------- | ------------ | ---------- | ----------------- | -------------- |
| 7/1/2021 – 6/30/2022 | $26,541      | to $31,221 | $31,221           | —              |
| 7/1/2022 – 6/30/2023 | $28,101      | to $31,221 | $31,221           | —              |
| 7/1/2023 – 6/30/2024 | $29,557      | to $31,221 | $31,221           | **2023, 2024** |
| 7/1/2025 – 6/30/2026 | $31,304      | (none)     | $31,304           | **2025**       |
| 7/1/2026 – 6/30/2027 | $32,344      | (none)     | $32,344           | **2026**       |

The 0.30% tier is Ordinance 20616's reduced rate for wages between the
annualized Oregon minimum wage and the $15.00/hr equivalent. It disappeared once
the minimum wage passed $15.00 on 7/1/2025 — the 2025 chart says so in a note.

Caveats, both flagged rather than papered over:

- **Charts change on July 1, so a calendar year straddles two.** Each year uses
  the chart that _takes effect during_ it, which is what the 2025 file already
  did. Same limitation as Philadelphia and Opelika.
- **No 7/1/2024 – 6/30/2025 chart was ever published**, as far as I can find.
  The City's Employee Payroll Tax page still linked the 7/1/2023 chart in both
  March and April 2025 (Wayback 20250303120819, 20250401024035), so 2024 carries
  that one. The previous 2024 file had `24,960` and `31,200`, which match no
  published chart at all — those are $12.00 and $15.00 × 2080 and appear to have
  been invented.
- The lookup is against gross wages _less overtime_, and the tax then applies to
  subject wages (gross less pre-tax deferrals). The app has no overtime concept,
  so both use gross-after-401(k).

### Resolved: Pennsylvania `local_earned_income`

No change needed, for a duller reason than expected: `LOCAL_EARNED_INCOME` is an
unused constant. Pennsylvania's municipal wage taxes are modelled as
`city_income`, and no Pennsylvania file carries a `standard_deduction` in any
year, so its taxable base already equals gross. The constant is worth either
using or deleting, but nothing computes wrong today.

Chasing it did surface a real problem in two other states — below.

### Missouri earnings taxes moved to the gross basis

`city_income` covers two different animals, and the calculator was treating both
as post-deduction:

| City                   | Basis                                    | Source                |
| ---------------------- | ---------------------------------------- | --------------------- |
| Yonkers                | state taxable income — **correct as-is** | NY resident surcharge |
| Kansas City, St. Louis | wages                                    | RSMo 92.111(2)(1)     |

RSMo 92.111(2)(1) levies the earnings tax on "salaries, wages, commissions and
other compensation earned by its residents". St. Louis's own taxable-items page
agrees: gross pay less pre-tax deferrals (cafeteria plans, 401(k), HSA), nothing
else. Missouri's standard deduction tracks the federal one, so charging 1% after
it understated the tax by **$161 at every income above $16,100**.

Since one tax type now spans both bases, the base is declared in the data:
`basis: GROSS_INCOME_BASIS` on the Kansas City and St. Louis schedules, all four
years. Yonkers is untouched and a test pins it that way.

### Alabama: Irondale added, and the League's roster is not exhaustive

The City of Irondale publishes its own occupational licence fee history, which
settles one of the three open jurisdictions:

- 1% from 2018-08-01 (Ordinance 2018-10c)
- 0.75% from 2022-07-19 (Ordinance 2022-14)
- 0.50% from 2024-07-02 (Ordinance 2024-12)

So 2023 = 0.75%, 2024 = 0.75% (pre-change; the cut lands almost exactly
mid-year), 2025 = 2026 = 0.50%.

**This changes how much the Alabama League of Municipalities roster can be
trusted.** Irondale (pop. ~13,000, and a Birmingham suburb) has levied an
occupational tax since 2018 and is not on the League's list of 25. The list is a
survey, not a register, and the earlier claim here that "all 26 are now present"
was wrong. It is a floor, not a ceiling — which also explains the Alabama Daily
News piece citing 26 jurisdictions.

This does **not** reopen Mobile or Montgomery: those rested on the cities' own
publications and, for Montgomery, the HB 147 paper trail, not on the roster
alone.

**Tarrant and Beaverton remain unconfirmed.** Tarrant's website has a business
licence application and no occupational tax page of any kind; Beaverton (pop.
~200, Lamar County) publishes nothing. Neither was added.

### Washington capital gains: standard deduction was two years stale

The 2025 and 2026 files carried $270,000, which is the **2024** figure. DOR
publishes $278,000 for 2025 (the deduction is indexed annually). The 9.9% tier
is SB 5813's 2.9-point surcharge on Washington capital gains above $1,000,000,
so its floor is the deduction plus $1,000,000 and moves with it:

| Year | Deduction                      | 7% band       | 9.9% above |
| ---- | ------------------------------ | ------------- | ---------- |
| 2023 | $262,000                       | —             | —          |
| 2024 | $270,000                       | —             | —          |
| 2025 | **$278,000**                   | to $1,278,000 | $1,278,000 |
| 2026 | **$278,000 CARRIED FROM 2025** | to $1,278,000 | $1,278,000 |

2026's indexed amount is unpublished. At $300,000 of gains this moved the tax
from $2,100 to $1,540.

### Still to check

- **Wilmington, DE `city_income`** is very likely the same error as Missouri —
  a 1.25% _wage_ tax charged here on income after Delaware's $3,250 standard
  deduction. Left alone: `wilmingtonde.gov` returns 403 to every tool I have for
  the wage-tax pages specifically, and the Missouri correction only went in
  because RSMo 92.111 and St. Louis's taxable-items list are both readable.
  Worth ~$41/yr at any income above the deduction.
- **Michigan, Ohio, New Jersey `city_income`** are levied on wages too, but
  those three states carry no `standard_deduction` in the data, so their base is
  already gross and nothing computes wrong today. If a standard deduction is
  ever added to one of them, it must come with `basis: GROSS_INCOME_BASIS` on
  the city schedules.
- **Yonkers** is modelled as a flat 0.5%, which is the _non-resident_ earnings
  tax. The resident tax is a 16.75% surcharge on net New York State tax. Someone
  selecting Yonkers in a take-home calculator most likely means a resident.
  Separate issue from the basis question, and not touched here.

## Open questions / to revisit

- Several states index brackets to inflation and may not have published final
  2026 figures this early — expect a batch of `CARRIED FROM 2025` entries.

- **Alabama** — Tarrant and Beaverton appear in payroll registries as
  occupational-tax jurisdictions but publish no rate I could confirm. The small
  towns carried from the League's survey should be verified city by city; the
  roster demonstrably misses at least one real jurisdiction (Irondale).
- **Irondale 2024** — carries 0.75%; the true year is 0.75% through 2024-07-01
  and 0.50% after.
- **Opelika 2025** — carries 1%; the true year is 1.5% for Q1 and 1% after.
- **Portland Arts Tax 2027** — rate and threshold begin indexing.
- Oregon 2026 was pre-existing and has uncommitted edits; confirm its figures
  are true 2026 values before final commit.
