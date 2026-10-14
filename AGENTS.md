# Exercise reference agreement

- Before modifying an exercise of a new type for which the user has not supplied
  a reference, inspect it, explain the type and missing reference, and ask the
  user how to proceed. Do not modify that exercise until the user responds.
- For a mixed exercise, identify each constituent exercise type and apply its
  own user-provided reference and conventions to that part, preserving how the
  parts work together. Do not impose one type's behavior on the entire exercise.
- If any part of a mixed exercise has no supplied reference, ask the user about
  that part before modifying the mixed exercise. Existing references remain
  valid for known types; this does not require repeated approval for them.

# Mixed Matching and letter Drag and Drop navigation

- In every mixed exercise containing Matching, while either endpoint is selected,
  exclude the accompanying exercise's controls from Tab/Shift+Tab navigation until
  the connection is completed or cancelled. Include only available endpoints on
  the opposite matching side and keep exercise action buttons accessible. Restore
  the accompanying exercise's normal navigation after completion or cancellation.
- Order matching focus targets by their displayed order, never by the correct
  answer mapping. This applies to source-selection focus and arrow navigation;
  Tab/Shift+Tab must follow the same visual order without positive tab indices.
- For mixed exercises arranged like `Review8_Page2_Q2`, while a matching source
  is selected, exclude letter blanks and letter-bank tiles from Tab/Shift+Tab
  navigation. Treat each word as one matching endpoint, rather than entering
  its embedded Drag and Drop controls before the connection is completed.
- After selecting an image, move keyboard focus to an available whole-word
  endpoint; keep the image endpoints out of the Tab order during that pending
  image selection. Tab/Shift+Tab traverse word endpoints without trapping focus
  or removing access to the exercise action buttons.
- Completing or cancelling the connection restores normal navigation to letter
  blanks and banks. Keep mouse/touch interaction and independent answer locks.

# Shared focus and audio preferences for future exercise work

These latest user preferences apply to every exercise type below and override
older examples that style the exercise action buttons.

- Do not add `focusClass`, custom focus rings/outlines, or equivalent descendant
  focus selectors to Check Answer, Show Answer, or Start Again buttons. Preserve
  their existing shared/native focus behavior and keyboard accessibility.
- Custom keyboard focus indicators on exercise choices, words, sentences, slots,
  grid cells, and matching endpoints must have rounded corners. Reuse the
  element's existing border radius, or add a minimal local rounded radius if it
  has none. Preserve existing pill/circle shapes, dimensions, and layout.
- Do not modify shared components or global styles to implement these preferences.
  Apply them in future requested work; do not migrate existing exercises unless
  the user asks.

- Every `QuestionAudioPlayer` usage in requested exercise work must pass a stable,
  exercise-specific `pageId` prop. Prefix it with `sb` for Student Book/StudentPages
  or `wb` for Workbook/WorkBookPages, then the lowercase unit/review, page, and
  question joined with underscores: `sb_review7_page2_q1`, `sb_unit8_page5_q1`,
  `wb_unit8_page5_q1`, etc. Match
  the actual exercise, not the origin of its audio assets. Do not reuse another
  exercise's ID or generate it dynamically. This namespaces saved audio positions.
  Do not migrate unrelated exercises without a request.

- In every exercise type, Show Answer reveals correct answers with the same green
  correct-answer feedback as a successful check: selected answer borders, slot
  borders/underlines, matching lines/endpoints, or completed sentence/grid feedback
  as appropriate. Keep revealed answers locked and clear incorrect feedback.
  Do not display a new score alert or count revealed answers as a student-earned
  score. Start Again clears the green feedback and all reveal locks.

# Drag and Drop exercise conventions

These are the user's established conventions for Drag and Drop exercises in this
project. Apply them when asked to create or update a Drag and Drop exercise;
do not update other exercises automatically. Exercise-specific user instructions
take precedence. Do not apply these conventions to Select, Matching, or Word
Search without their separate requirements.

## References and scope

- Use `src/component/StudentPages/unit8/Unit8_Page5_Q2.jsx` as the implemented
  example and `src/component/StudentPages/review5&6/Review5_Page2_Q3.jsx` as a
  reference. The latter currently exports `Review5_Page2_Q4`; inspect actual
  component names rather than assuming they match filenames.
- Adapt local behavior; do not copy an entire reference component or replace
  the target's structure unnecessarily.
- Preserve the exercise's question concept, answer data, text, images, layout,
  dimensions, colors, spacing, and mouse/touch drag interactions, except for
  explicitly requested changes such as the header and speaker indicator.
- Use the existing `ExerciseHeader` with the target's own title and numbering.
  Do not invent question text or subtitles.
- Keep changes confined to the requested exercise. Avoid modifying reference
  exercises, shared components, CSS, audio managers, global styles, or adding
  dependencies unless explicitly authorized.

## Audio and speaker indicator

- Connect existing audio assets to the correct words and text fragments. Do not
  invent paths, recordings, or content.
- Support click/touch activation and Enter/Space audio playback.
- Keyboard-visible focus may play audio, following the reference pattern;
  suppress playback during programmatic focus movement.
- Show the reference-style speaker badge on the element whose audio is playing,
  without shifting its layout. Clear it when playback ends, stops, or fails.
  Do not add a separate visible player unless requested.
- Prevent overlapping playback; guard stale completion/error/rejection callbacks.
  Stop exercise audio on reset and unmount, and during check/reveal as appropriate.

## Selection, placement, return, and focus

- Preserve logical Tab/Shift+Tab navigation. Enter and Space select a bank word
  and place it in an editable slot. Prevent duplicate activation, key-repeat
  actions, and conflicts with global handlers or the drag library's keyboard
  sensor; preserve the library's mouse/touch sensors.
- Move keyboard focus to an available slot after selection, and back to an
  available bank word after placement, without unexpected audio.
- While dragging over an editable answer slot, show a dashed blue outline around
  the whole slot and a light blue background with rounded corners. Drive this
  from the drag library's target-over state; clear it when leaving, dropping, or
  cancelling. Do not show an active drop effect on correctly locked/revealed slots,
  or change slot dimensions or surrounding layout.
- Keep the selected bank word/sentence visibly highlighted with a blue outline
  and light blue background while awaiting placement, even after focus moves to
  the slots or audio finishes. Clear it on placement, cancellation, drag start,
  check/reveal, and reset. Preserve the drag library's inline positioning styles.
- Questions/text fragments with audio show a blue outline and light blue
  background while their own audio plays, in addition to the speaker badge.
  Clear this playback effect on stop/end/error. Use shadows or outlines so the
  effect does not change dimensions or shift the layout.
- Activating a filled editable slot by click/touch or Enter/Space, with no
  pending keyboard replacement, returns its word to the bank. This also works
  before checking. Keyboard placement of a newly selected word may replace an
  editable answer. A pointer activation of a filled editable slot returns its
  current word.
- Tab focus alone must never remove or change an answer. Escape cancels the
  pending selection and returns keyboard focus to its source word.
- Delete/Backspace may remove only an editable answer marked incorrect by Check.
- Keep focus stable across renders and cancel pending focus work on reset,
  check/reveal, drag start, and unmount as appropriate.

## Validation and answer states

- Check against the target's existing answer data and actual slot IDs. Keep
  incomplete-answer validation and score feedback consistent with the exercise.
- Lock each correctly checked answer individually and show a green underline.
  Preserve these locks on subsequent checks.
- Leave incorrect answers editable; make their words available for correction.
  Clear only affected incorrect feedback when answers change. Preserve the
  target's existing incorrect styling.
- Never overwrite, remove, or move a correctly locked answer through pointer,
  keyboard, or shared placement helpers. Listening must not modify an answer.
- Show Answer reveals correct answers and locks changes. Start Again clears
  answers, locks, feedback, pending selections, playback indicators, and local
  progress, and stops audio.

## Images and verification

- Inspect actual artwork before writing meaningful image alt text. SVGs may
  contain embedded PNG artwork that can be inspected directly. Never infer a
  description from a variable name, filename, or expected answer. If visual
  inspection is unavailable, identify the image requiring review.
- Run targeted lint and an available build, plus proportionate checks for
  keyboard selection/placement/return, focus suppression, partial correction and
  rechecking, protected locks, audio lifecycle, reveal, and reset.
- Verify real mouse/touch behavior, Tab/Shift+Tab, audible playback, screen-reader
  behavior, and visual preservation when a browser/device session is available.
  Handler-level checks do not substitute for those browser/device checks.
- Report exactly what was changed and tested, and any unavailable, blocked,
  declined, or failed checks. Never claim an unverified test passed.

# Select exercise conventions

These are the user's established conventions for Select exercises. Apply them
when asked to create or update a Select exercise; do not migrate exercises
automatically. Exercise-specific user instructions take precedence. Keep these
rules separate from Drag and Drop, Matching, and Word Search behavior.

## References and scope

- Use `src/component/StudentPages/unit8/Unit8_Page5_Q1.jsx` as the implemented
  example and `src/component/StudentPages/review3&4/Review4_Page2_Q1.jsx` as the
  reference. The reference component is `Review4_Page2_Q1`; its actual directory
  is `review3&4`, not `review4&5`.
- Use the existing `ExerciseHeader` with the target's own section, question
  number, and title. Preserve wording and meaningful emphasis; do not invent
  subtitles or import reference exercise content.
- Preserve the target's concept, question structure, answer choices, correct
  answer data, images, layout, dimensions, spacing, and pointer/touch behavior.
  Apply the requested result borders and keyboard focus styling locally.
- Prefer modifying only the target JSX. Do not modify reference exercises, CSS,
  shared components, global styles, or audio managers without authorization.
  Do not add dependencies or a testing framework for routine exercise changes.

## Selection and keyboard focus

- For true/false (tick/cross) Select exercises, the selected option must have
  a persistent light blue background before checking, so selection is clear
  with mouse, touch, and keyboard even after focus moves away. Preserve the
  option dimensions and rounded shape. Correct/incorrect result borders still
  take precedence in green/red; switching or resetting clears the old selection.
- Use accessible answer buttons with descriptive names, selected state
  (`aria-pressed` where appropriate), and locked-state descriptions.
- Tab/Shift+Tab navigate in logical order without selecting or changing answers.
  Enter/Space activate an answer exactly once, consistently with click/touch.
  Guard duplicate native/manual activation, key repeat, and global-handler
  conflicts. Prefer local handlers; do not introduce global keyboard listeners.
- Show a clearly visible, thick blue keyboard focus outline, using the current
  example's 4px outline with an offset and rounded corners. Apply it to answer
  choices, not Check Answer, Show Answer, or Start Again. Keep it distinct from
  the correct/incorrect border and avoid resizing controls or shifting the layout.
- Announce selection, validation, locked answers, reveal, and reset through a
  local screen-reader status region. Keep focus stable when feedback changes.

## Checking, feedback, and locks

- Validate required answers using the target's original answer data. Preserve
  its score alerts and incomplete-answer flow.
- Check each question independently. Lock correct answers individually; never
  lock incorrect answers merely because Check Answer was pressed.
- After checking, the entire border of the selected answer box is green for
  correct and red for incorrect. Retain the requested green underline for a
  correctly checked selection and existing incorrect feedback such as a cross.
  Do not color unselected alternatives as if they were submitted answers.
- Correct answers cannot be changed by mouse, touch, Enter, or Space. Preserve
  their results, green feedback, and locks through later checks.
- Incorrect answers remain editable. Changing one clears only that question's
  outdated feedback; it must not clear other results or unlock correct answers.
- Lock the entire exercise on successful completion or Show Answer according
  to its intended flow. Show Answer reveals correct selections and blocks edits.
- Start Again clears selections, individual/global locks, results, score/status
  feedback, and relevant exercise progress, and stops/resets exercise audio.

## Audio and images

- Preserve existing instruction audio, captions, timestamps, and initial playback
  behavior. Do not invent audio paths, individual-question mappings, or segment
  boundaries. Grouped captions do not establish individual-question timestamps.
- If verified individual-question audio exists, provide keyboard-accessible
  Enter/Space playback following the reference pattern. Prevent overlapping
  playback and guard stale callbacks; clean up owned listeners, timers, and audio.
  Suppress unexpected audio from programmatic focus changes if focus plays sound.
- Every word or sentence with audio must show the reference-style speaker badge
  on the element whose audio is currently playing. This is a user requirement for
  Select as well as Drag and Drop. Use absolute positioning so it does not shift
  the layout. Track the activated element, not only the audio asset: the same word
  may appear in several questions. Clear the badge on completion, replacement,
  stopping, playback failure, reset, and reveal. Do not add a separate visible
  audio player unless requested.
- Reuse shared audio components without altering them. Scope any local audio
  stopping/resetting to the exercise, rather than unrelated page audio.
- Inspect actual image artwork before writing alt text. Describe informative
  images accurately without unnecessarily revealing the phonics answer. Use
  empty alt and hidden decorative tick/cross images when the enclosing button
  already supplies their accessible meaning. Report unverified artwork.

## Verification

- Run targeted lint and available build checks, and proportionate verification
  of incomplete answers, mixed results, correction/rechecking, persistent locks,
  full result borders, keyboard activation/repeat suppression, reveal, and reset.
- Verify audio configuration and lifecycle and preservation of target content,
  assets, and layout. Inspect the final changes for unrelated edits.
- Verify actual Tab navigation, mouse/touch, focus visibility, audible playback,
  screen-reader feedback, and visual appearance when a browser/device is available.
  Distinguish isolated handler/style checks from real browser verification.
- Report checks actually run and any failures, limitations, or declined checks.
  Never claim an unverified check passed.

# Word Search Sentence — البحث عن الكلمات لتكوين جملة

When the user asks for "Word Search Sentence" or "البحث عن الكلمات لتكوين جملة",
apply this exercise pattern to the requested target. Use
`src/component/StudentPages/unit7/Unit7_Page5_Q4.jsx` as the interaction reference
and `src/component/StudentPages/unit8/Unit8_Page5_Q4.jsx` as the adapted example.
Do not apply Select or Drag and Drop answer-state rules to this type.

- Preserve the target grid letters, row lengths, words, sentence order, images,
  dimensions, and existing visual layout. Use `ExerciseHeader` with its own title.
  Verify every word coordinate against the actual grid; correct bad coordinates
  without changing the content and explain the correction.
- Support mouse/touch/pen dragging and selecting the first and last letter with
  two taps/clicks. Use pointer capture, cancellation, pointer identity, and
  exercise-scoped hit testing. Prevent a second touch from hijacking a selection.
- Match the exact target coordinates forward or in reverse. Preview a straight
  path without accepting unrelated matching letters elsewhere. Account for
  unequal row lengths. Reject invalid paths and duplicate discoveries.
- Provide a roving grid tab stop, arrows to navigate and preview, Enter/Space to
  start and complete selection, Escape to cancel, and Backspace to undo. Guard
  activation repeats and global keyboard conflicts. Tab must leave the grid.
  Show a thick blue keyboard focus indicator and announce selection/results.
- Keep found word cells green and fill the read-only sentence slots in the
  original sentence order, regardless of discovery order. Do not enforce discovery
  order unless explicitly requested. Undo cancels an unfinished selection first,
  otherwise removes the most recently found word while the activity is editable.
- Check with no discoveries prompts the student. A partial score keeps the grid
  editable so the student can find missing words or undo. Lock after a complete
  successful check or Show Answer. Do not lock a partial attempt.
- Show Answer reveals all target paths and the complete sentence and locks edits.
  Start Again clears discoveries, selection/preview, pointer state, result locks,
  score/status feedback, audio, and pending focus work; restore grid focus safely.
- Reuse only verified sentence audio. When available, play on sentence completion
  and allow click/Enter/Space replay from the completed answer. Show a speaker
  indicator while playing, clear it on stop/end/error, prevent overlap, and clean
  up on reset/unmount. If no verified sentence recording exists, report the missing
  asset; never fabricate audio, concatenate unrelated recordings, or show a fake
  playback indicator. Keep the existing shared audio components/managers unchanged.
- Inspect actual artwork for alt descriptions. Preserve target imagery and do
  not copy reference images or question content. Avoid changes to CSS, shared
  components, other exercises, or dependencies without authorization.
- Verify all paths, reverse paths, invalid selections, short-row navigation,
  keyboard activation, pointer endpoints/cancellation/second-touch guards, undo,
  partial checking, completion locks, reveal/reset, and content/layout invariants.
  Run targeted lint/build checks when available. Clearly distinguish handler
  checks from real browser/touch/audio/visual verification and report limitations.

# Matching — التوصيل

Use this pattern when the user requests a Matching/التوصيل exercise update.
Reference: `src/component/StudentPages/review5&6/Review6_Page2_Q2.jsx`, component
`Review6_Page2_Q2`. Adapted example:
`src/component/StudentPages/unit8/Unit8_Page6_Q2.jsx`. Exercise-specific user
instructions take precedence; keep Matching separate from the other patterns.

- Preserve target images, text, answer mapping, row order, endpoint placement,
  layout, dimensions, and click/touch interaction. Do not copy reference content
  or swap the target's image/text sides. Use `ExerciseHeader` with its own title.
- Allow choosing either image or text first, then the opposite endpoint to
  connect. Choosing the same endpoint again cancels; another endpoint on the same
  side changes the source. Show persistent source selection and a dashed line
  preview toward an available opposite endpoint on hover or keyboard focus.
- Follow the target's matching cardinality. The reference and Unit 8 example
  are one-to-one: replacing a match removes conflicting editable connections on
  either side. Do not impose one-to-one matching on a target that reuses endpoints.
- Support Tab/Shift+Tab, Enter/Space activation, arrows to move between endpoints
  on a side, and Escape to cancel. Prevent repeat/duplicate activation and global
  keyboard conflicts. Show a thick blue focus outline and accessible selected,
  result, and locked states, with a local status region.
- Keyboard source selection focuses an available opposite endpoint. After
  connecting, return focus to an available text endpoint following the reference
  pattern. Suppress audio during programmatic focus changes and cancel pending
  focus work on check/reveal/reset/unmount.
- Check complete matches against the target's existing mapping. Lock each correct
  pair, including both endpoints, and show its connecting line green. Incorrect
  pairs remain editable with the target's existing red/cross feedback. Changing
  a connection clears only results for affected editable pairs. Never remove,
  replace, or steal either endpoint of a correctly locked pair during correction.
- Show Answer reveals correct connections and locks edits. Start Again clears
  lines, results, selection, preview, completion/reveal locks, audio, and indicators.
- Connect only verified existing audio assets. Text click/touch and Enter/Space
  listen while retaining the matching interaction. Listening to locked text must
  not modify a match. Keyboard-visible focus may listen; programmatic focus must
  not trigger unexpected audio.
- For a multi-sentence text endpoint with separate verified recordings, play its
  recordings in text order as one cancellable queue. Keep the speaker badge and
  blue playback outline/background on that endpoint throughout the queue, then
  clear them on completion, replacement, error, check/reveal, or reset. Guard stale
  callbacks so cancelled audio cannot start its next recording or clear new audio.
  Stop overlap and clean up owned playback/listeners on unmount.
- Preserve line geometry and refresh endpoint coordinates after resizing and
  image/layout changes. Keep SVG lines non-interactive and hidden from screen
  readers. Inspect actual artwork before adding accurate image descriptions.
- Prefer changes only to the requested JSX; leave reference exercises, CSS,
  shared components/audio managers, and other exercise types unchanged unless
  authorized. Do not add dependencies for these routine updates.
- Verify connections from either side, replacement/cardinality, persistent locks,
  correction/rechecking, keyboard/focus/cancellation, preview/geometry, audio queue
  and speaker lifecycle, and Show Answer/Start Again. Run appropriate lint/build
  checks and report limitations. Handler checks are not real browser/touch/audio
  or visual verification; never claim an unverified check passed.
