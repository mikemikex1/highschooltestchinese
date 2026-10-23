# Chinese Exam Mode Independent QA

## Result

PARTIAL — local file:// spot checks pass; public GitHub Pages and the full browser matrix remain pending.

## 111–115 coverage

| Year | Unique exam questions | Groups |
|---|---:|---:|
| 111 | 10 | 10 |
| 112 | 17 | 17 |
| 113 | 29 | 29 |
| 114 | 27 | 27 |
| 115 | 29 | 29 |

Totals: 112 unique question IDs and 112 current groups. The source still contains 147 canonical `real` references plus one `yearQ1` reference, for 148 rendered canonical references. Existing duplicate IDs are data references already present in the canonical runtime and were not changed.

## Required checks

- Official answer mismatch: 0
- Pre-submit answer/analysis leaks: 0
- Constructed-response pre-submit leaks: 0
- Missing material: 0
- Missing media: 0 present
- Single View root: PASS in local spot check; one `#exam-view-root` child is mounted.
- Direct exam hash: PASS when loaded with raw `#mode=exam&year=115&group=01&question=01`.
- Hashchange: PASS in local runtime spot check.
- Reload: NOT FULLY VERIFIED in this run.
- Back / Forward: NOT FULLY VERIFIED in this run.
- Curriculum → Exam: PASS via the Exam Mode navigation link and hash transition.
- Exam → Curriculum: PASS via the `回課綱複習` link in the local spot check.
- Supplement ↔ Exam: NOT FULLY VERIFIED in this run.

## 115 Q1 reproduction

- Initial: no official answer, correct-answer marker, result, or analysis visible.
- Select A: answer remains hidden; submit becomes available.
- Submit A: `答案不正確`; A is incorrect/selected, C is correct, B and D are neutral; official answer C and core explanation appear.
- Reset: selection, result, answer markers, and analysis state are cleared.

## Runtime/data integrity

- Lessons: 30
- `lessonData.real`: 147
- `yearQ1`: 1
- Rendered canonical references: 148
- Characters: 220
- Supplement D: 65
- Supplement E: 35
- Offline HTML and ZIP: unchanged in this task; hashes verified against the pre-change baseline.
- PDF files: 19; no PDF files were modified.

## Responsive and deployment status

- Mobile 320/375/390/430: NOT FULLY VERIFIED in this run.
- Desktop 768/1024/1440/1920: NOT FULLY VERIFIED in this run.
- Browser console/runtime error capture: NOT FULLY VERIFIED in this run; Node syntax checks pass.
- Public GitHub Pages URL: PENDING deployment/retest.
- Offline file:// regression: existing offline artifacts were not changed; baseline hashes remain unchanged.

## Source/Pages parity

- Exam Mode implementation: PASS (source and `docs/assets/exam-mode.js` synchronized).
- Exam Mode styles: PASS (source and `docs/assets/styles.css` synchronized).
- Canonical lesson/real counts: PASS.
- No lessonData, real, quiz scoring, supplement, or offline data-chain changes were made.
