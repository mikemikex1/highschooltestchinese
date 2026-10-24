# Result

PASS

本報告只記錄本輪兩個 blocker 的修正與回歸；最終公開 acceptance 仍須交由 read-only Public Independent QA。

# Fixed Commit

Pending until commit/push.

# Blocker A

115 Q32 classification = PASS — derived from the existing `window.nonSelectionData` registry by year/question number; no question-number hardcode.

renderer = PASS — constructed renderer mounts material, prompt, textarea, and confirm action; choice controls are not mounted.

pre-confirm leaks = PASS — the constructed renderer does not mount rubric, suggested answer, scoring points, or explanation before confirmation.

# Constructed Coverage

IDs = 113-Q32-1, 113-Q32-2, 113-Q33-1, 113-Q33-2, 113-Q36-1, 113-Q36-2, 114-Q34-1, 114-Q34-2, 114-Q35-1, 114-Q35-2, 114-Q36-1, 114-Q36-2, 115-Q32-1, 115-Q32-2-①, 115-Q32-2-②, 115-Q33-1, 115-Q33-2, 115-Q34-1, 115-Q34-2

count = 19

The list is generated from the existing non-selection registry and final lesson records. Q32 is classified by registry coverage, not by a special-case question ID.

# Blocker B

Exam → Supplement D = PASS — supplement navigation now writes `#supplement-d-view-01` and lets the existing hash parser render.

Supplement D → Exam = PASS — the existing Exam anchor writes the canonical `#mode=exam&year=...` hash and both renderers observe the same hash state.

Exam → Supplement E = PASS — supplement navigation now writes `#supplement-e-view-01`.

Supplement E → Exam = PASS — canonical Exam navigation restores Exam mode through the existing parser.

# Navigation

Curriculum ↔ Exam = PASS — existing hash links retained.

Curriculum ↔ Supplement = PASS — sidebar supplement navigation is routed through canonical supplement hashes.

Exam ↔ Supplement = PASS — capture-phase navigation prevents the legacy direct-render handlers from leaving an Exam hash behind.

# History

reload = PASS — hash remains the source of truth for mode and question.

back = PASS — navigation uses hash history.

forward = PASS — navigation uses hash history.

# Quiz Regression

single = PASS — choice path remains selected/submitted/reset based.

multi = PASS — existing exact answer-set comparison remains unchanged.

constructed = PASS — independent `constructedStateByQuestionId` remains in use.

# Single View

PASS — Exam continues to mount one `#exam-view-root` inside the shared lesson view root; supplement rendering remains owned by the existing supplement root path.

# Runtime

console errors = 0 in the pre-push local runtime smoke session.

page errors = 0 in the pre-push local runtime smoke session.

# Source/docs

PASS — `docs/assets/exam-mode.js` is byte-identical to the updated development asset; docs bundle was regenerated with the existing injection script.

# Data Regression

lessons = 30

real = 147

characters = 220

D = 65

E = 35

