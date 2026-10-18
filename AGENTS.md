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

- In exercises using `QuestionAudioPlayer`, Start Again resets exercise answers
  and feedback without rewinding or restarting that player. It may pause playback,
  but must preserve the current time and saved audio position. Do not seek to zero,
  remove the player's saved-position key, reload/change its source, or remount it
  with a changing key as part of the exercise reset. Keep the player's own explicit
  restart control separate. Owned word/fragment audio may still be stopped and
  cleared. Apply this rule when requested; do not change shared player internals.

- In every exercise type, Show Answer reveals correct answers with the same green
  correct-answer feedback as a successful check: selected answer borders, slot
  borders/underlines, matching lines/endpoints, or completed sentence/grid feedback
  as appropriate. Keep revealed answers locked and clear incorrect feedback.
  Do not display a new score alert or count revealed answers as a student-earned
  score. Start Again clears the green feedback and all reveal locks.

# Check Answer completion rule — all exercise types

- In every future requested exercise update, explicitly check this behavior:
  after Check Answer confirms that all required answers are correct, actually
  disable the native Check Answer button (`disabled`) and show a `not-allowed`
  cursor. Repeated mouse/touch clicks or Enter/Space activation must not show
  another alert, score, or other feedback, or rerun checking side effects.
- Keep a handler guard as well as actual button disabling. Derive the disabled
  state from the exercise's checked completion/reveal state and keep it synchronized
  across rerenders; do not rely only on `aria-disabled`, an event's `currentTarget`,
  or a one-time cursor mutation. Correct choices before checking alone must not
  disable the first Check Answer attempt.
- Incomplete or partially incorrect attempts keep Check Answer available for
  correction and rechecking. In mixed exercises, success requires every required
  part to be correct. Show Answer keeps Check Answer disabled without awarding
  a student-earned score. Start Again restores the enabled state and normal cursor.
- References for this fix are the local completion checks and native-button
  synchronization in `src/component/WorkBookPages/Unit2/WB_Unit2_Page13_Q1.jsx`,
  `WB_Unit2_Page13_Q2.jsx`, `WB_Unit2_Page14_Q1.jsx`, and `WB_Unit2_Page14_Q2.jsx`
  in that same directory. Adapt to the target's own state without changing its
  design, content, audio, or other behavior. Do not modify shared components or
  global styles, or migrate unrelated questions, without user authorization.
- Verify first successful checking, repeated activation, rerender persistence,
  partial correction/rechecking, Show Answer, and Start Again. Distinguish native
  button/handler simulation from real browser mouse/touch/keyboard verification.

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

- In every requested Drag and Drop update, inspect drag positioning for mouse
  and touch, especially inside the Book's transformed/zoomed containers. Never
  override the drag library's active position, top, left, transform, or dimensions
  with normal bank styles such as `position: relative`; apply library positioning
  after those styles. The dragged word must remain visible at the pointer without
  a jump or displacement. When reparenting is needed, move the actual draggable
  into an untransformed portal in the active fullscreen element or document body,
  keeping it visible above page layers. Do not remove the source in favor of a
  clone that may be invisible. Preserve the bank appearance, mouse/touch sensors,
  keyboard flow, and protected answer locks. Test portal visibility/coordinates
  and report separately whether real mouse/touch verification was available.
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

# Word Search — إيجاد الكلمات

Use this name for standalone word-finding exercises without sentence completion.
User-provided interaction reference:
`src/component/StudentPages/unit5/Unit5_Page5_Q3.jsx`.
Workbook adaptation:
`src/component/WorkBookPages/Unit1/WB_Unit1_Page7_Q1.jsx`.
Keep this pattern separate from Word Search Sentence, Select, and Drag and Drop.

- Preserve the target grid, word list, target paths, content, layout, dimensions,
  and existing book colors/styles. Verify coordinates against the actual grid.
  Adapt the interaction locally; do not copy reference images or Student Book
  styling into Workbook exercises. Use ExerciseHeader with the target's title
  and book theme, without inventing subtitles.
- Support mouse/touch/pen dragging and two-click/two-tap endpoint selection.
  Accept exact paths forward or backward, including paths through intersections
  with previously found words. Reject invalid paths and duplicate discoveries.
  Scope hit testing to this grid; use pointer capture and pointer identity so a
  second pointer cannot hijack or finish a selection. Handle cancellation safely.
- Provide one grid Tab stop, arrow navigation and preview, Enter/Space endpoint
  activation, Escape cancellation, and Backspace undo. Tab must leave the grid.
  Guard repeated activation and global keyboard conflicts; keep custom focus
  visible and rounded, without styling the exercise action buttons.
- Undo cancels an unfinished selection first; otherwise remove the most recent
  discovery while editable. Shared cells stay found if another discovered word
  still uses them. Preserve the target's found-cell and word-list feedback.
- Check with no discoveries prompts the student. Partial checking marks missing
  words and reports the existing score while keeping the activity editable.
  Lock only on complete successful checking or Show Answer. Revealing shows all
  paths with the same correct feedback and no new score. Start Again clears all
  discoveries, feedback, locks, selection, capture, audio and pending focus work.
- Use verified word audio where available. Word-list items or existing picture
  cards support click/touch and Enter/Space listening; keyboard-visible focus may
  listen. Show the speaker indicator and playback effect on the active item,
  without shifting layout. Guard stale callbacks, stop overlap, and clean up on
  check/reveal/reset/unmount. Listening never changes discoveries or locks.
- Verify paths/reverse paths, invalid/duplicate/intersecting selections, keyboard
  navigation/undo, pointer identity/capture/cancellation, partial rechecking,
  reveal/reset, audio and preservation of content/styles. Run targeted lint and
  available build checks. Distinguish handler checks from real browser/device,
  audible playback, visual and screen-reader verification.

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

# Clock Hands — ضبط عقارب الساعة

User-provided interaction reference:
`src/component/StudentPages/unit6/Unit6_Page6_Q1.jsx`, component
`Unit6_Page6_Q1`. Read the active implementation; the file also contains an
older commented-out implementation. Use this pattern when the user requests
Clock Hands, ضبط عقارب الساعة, or an exercise based on this reference.
Do not migrate other exercises merely because this reference was registered.

- This is a clock-hand positioning activity: the student sets the hour and
  minute hands to match a sentence. Keep it separate from freehand drawing with
  Pen/Eraser/Undo/Clear and from numeric-only time entry. In particular, the
  independently approved numeric-only grading and ungraded freehand drawing in
  `WB_Unit6_Page35_Q2.jsx` remain unchanged unless the user requests conversion.
- Preserve the target's own sentences, recordings, images, book colors, clock
  appearance, dimensions, arrangement and existing mouse/touch concept. Adapt
  the interaction locally; do not copy the reference's content or redesign the
  target. Use ExerciseHeader with the target's own title and book theme.
- Provide separate accessible hour/minute hand controls (slider semantics,
  current values and descriptions), with visible rounded keyboard focus and
  practical pointer hit areas. Tab/Shift+Tab reach the hands in logical order;
  arrows adjust the focused hand, Enter/Space advance it once, and
  Backspace/Delete reset an editable clock following this reference. Prevent
  repeated Enter/Space activation and conflicts with global keyboard handlers.
- Pointer input supports mouse, touch and pen, scoped pointer capture and
  pointer identity. Prevent accidental scrolling during manipulation, handle
  cancellation/lost capture/cleanup safely, and never let a second pointer
  hijack a pending drag. Account for Book scaling when converting coordinates.
  Keep overlapping hands independently reachable. The hour hand reflects the
  minute offset as on a real clock.
- Adapt snapping to the target's time data. This reference advances hours by
  one and minutes by 30, and starts at 12:00 with touched=false. Its digital
  time is read-only and shows --:-- until adjusted. Do not assume every future
  target uses half-hour steps or accepts this initial time as an answer.
- Grade the semantic hour/minute values, never pixel accuracy or stroke shape.
  Require all clocks to be set before checking. Lock each correctly checked
  clock individually with green feedback; incorrect clocks remain editable,
  and changing one clears only its outdated error. Preserve prior correct locks
  through rechecking. Listening to a sentence never changes or unlocks a clock.
- Use verified sentence audio with click/touch and Enter/Space playback, a
  speaker indicator and the established playback effect. Keyboard-visible
  sentence focus may listen; suppress audio during programmatic focus moves.
  Guard stale audio callbacks and stop overlap, errors and owned playback on
  check/reveal/reset/unmount according to the shared audio rules above.
- Show Answer positions all hands correctly, uses green feedback and locks
  changes without awarding an earned score. Start Again clears times/touched
  flags, locks, errors, announcements of previous results, pending pointer/focus
  work and owned playback. Apply the current native Check Answer disabling and
  popup focus-return rules above; do not inherit omissions from an older
  reference implementation. Do not add custom focus styling to action buttons.
- Prefer changes only to the requested exercise JSX. Do not modify the
  reference, CSS, shared clock/audio components or global styles without
  authorization. Verify keyboard steps/wrapping, pointer capture/cancellation,
  independent locks, partial correction/rechecking, audio, reveal/reset and
  repeated successful checking, and run targeted lint/build checks. Distinguish
  handler simulations from actual browser/device, visual and audible checks.
