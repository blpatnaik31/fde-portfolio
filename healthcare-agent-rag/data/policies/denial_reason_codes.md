# Reference: Synthetic Claim Adjustment Reason Codes (CARC-style)

**Document ID:** REF-050 · Synthetic reference codes modeled on the general structure of real CARC/RARC codes, for demonstration only — not an official code set.

## Section 1: Code Reference Table

| Code | Description | Typical Resolution |
|---|---|---|
| SYN-16 | Claim lacks information needed for adjudication (missing documentation) | Identify the specific missing document from the relevant policy (biometry, visual field, OCT, etc.) and resubmit with it attached. |
| SYN-50 | Non-covered service — not medically necessary per policy criteria on file | Review the applicable prior-auth policy's coverage criteria; if criteria are genuinely unmet, this is not appealable without new clinical evidence. |
| SYN-96 | Frequency limit exceeded for this service within the coverage period | Check the policy's frequency-limit section; if an accelerated-frequency exception applies (e.g. prior abnormal finding), resubmit with that justification. |
| SYN-119 | Benefit maximum for this time period has been reached | Not a documentation issue — confirm with member's benefit plan whether additional authorization exceptions exist. |
| SYN-197 | Precertification/authorization absent | The service required prior authorization that was not obtained before the service date; submit a retroactive authorization request with full supporting documentation if the payer's retro-auth window has not passed. |

## Section 2: How to use this reference

When a claim denial code doesn't map clearly to a specific policy's "Common Denial Reasons" section, this table gives the general category of issue and where to look next. Always check the specific procedure's policy document first (PA-104, PA-211, PA-233) — it will have more precise resubmission guidance than this general reference.
