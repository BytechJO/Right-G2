/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review6_Page1_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

const items = [
  { scrambled: ["og", "ot", "pseel"], correct: ["go", "to", "sleep"] },
  { scrambled: ["mkea", "hte", "deb"], correct: ["make", "the", "bed"] },
  { scrambled: ["tae", "chunl"], correct: ["eat", "lunch"] },
  { scrambled: ["teg", "pu"], correct: ["get", "up"] },
  { scrambled: ["og", "meoh"], correct: ["go", "home"] },
  { scrambled: ["tae", "stafkearb"], correct: ["eat", "breakfast"] },
];

const TOTAL = items.length;

// ================================
// HELPERS (خارج الكومبوننت)
// ================================

const buildEmpty = () =>
  items.map((item) => item.correct.map((word) => Array(word.length).fill(null)));

const cloneAnswers = (a) => a.map((row) => row.map((word) => [...word]));

const letterId = (letter, i, w, l) => `${letter}-${i}-${w}-${l}`;

const isUsedIn = (ans, id) =>
  ans.some((row) => row.some((word) => word.some((slot) => slot?.id === id)));

const builtOf = (row) =>
  row.map((w) => w.map((l) => l?.letter || "").join("")).join(" ");

// Enter و Space بنعالجهم بإيدينا ونوقّف انتشار الحدث،
// لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

const ARROWS = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

export default function Review6_Page1_Q2() {
  const [answers, setAnswers] = useState(buildEmpty);

  // الأسئلة (الصفوف) اللي جوابها صح بعد Check (بتنقفل)
  const [lockedRows, setLockedRows] = useState(() => new Set());

  // الأسئلة اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongRows, setWrongRows] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // الحرف اللي الطالب اختاره (بالكيبورد/الكليك) وبيستنى تنحط بخانة: { id, letter }
  const [picked, setPicked] = useState(null);

  // أي حرف/خانة هو "نقطة التاب" بكل مجموعة (عشان ما يصير 100 تاب)
  const [rov, setRov] = useState({});

  const [announcement, setAnnouncement] = useState("");

  const bankRefs = useRef({});
  const slotRefs = useRef({});

  const allDone = lockedRows.size === TOTAL;

  const isRowLocked = (i) => showAnswer || lockedRows.has(i);

  const isLetterUsed = (id) => isUsedIn(answers, id);

  // ================================
  // ROVING TAB (نقطة تاب وحدة لكل كلمة، والأسهم بتنقل جواتها)
  // ================================

  const getActive = (group, count, isFocusable) => {
    const r = rov[group];

    if (r !== undefined && r < count && isFocusable(r)) return r;

    for (let k = 0; k < count; k++) {
      if (isFocusable(k)) return k;
    }

    return -1;
  };

  const rememberFocus = (group, index) =>
    setRov((prev) => (prev[group] === index ? prev : { ...prev, [group]: index }));

  const moveFocus = (refs, prefix, count, from, dir, isFocusable) => {
    let k = from;

    for (let n = 0; n < count; n++) {
      k = (k + dir + count) % count;

      if (isFocusable(k)) {
        refs.current[`${prefix}-${k}`]?.focus();
        return;
      }
    }
  };

  // ================================
  // FIND TARGETS
  // ================================

  const rowOrder = (i) => [
    i,
    ...items.map((_, k) => k).filter((k) => k !== i),
  ];

  // أول خانة فاضية: بنفس الكلمة، بعدين بنفس السؤال، بعدين بأي سؤال
  const findTargetSlot = (i, w, ans = answers) => {
    for (const q of rowOrder(i)) {
      if (isRowLocked(q)) continue;

      const wordOrder =
        q === i
          ? [w, ...ans[q].map((_, k) => k).filter((k) => k !== w)]
          : ans[q].map((_, k) => k);

      for (const ww of wordOrder) {
        const l = ans[q][ww].findIndex((s) => s === null);

        if (l !== -1) return `${q}-${ww}-${l}`;
      }
    }

    return null;
  };

  // أول حرف لسا ما انستخدم: بنفس الكلمة، بعدين بنفس السؤال، بعدين بأي سؤال
  const findNextLetterKey = (i, w, ans) => {
    for (const q of rowOrder(i)) {
      if (isRowLocked(q)) continue;

      const n = items[q].scrambled.length;

      const wordOrder =
        q === i
          ? [w, ...Array.from({ length: n }, (_, k) => k).filter((k) => k !== w)]
          : Array.from({ length: n }, (_, k) => k);

      for (const ww of wordOrder) {
        const letters = items[q].scrambled[ww].split("");

        for (let l = 0; l < letters.length; l++) {
          if (!isUsedIn(ans, letterId(letters[l], q, ww, l))) {
            return `${q}-${ww}-${l}`;
          }
        }
      }
    }

    return null;
  };

  // ================================
  // PLACE / REMOVE (مشترك بين الدراق والكيبورد والكليك)
  // ================================

  const placeLetter = (q, w, l, obj) => {
    if (answers[q][w][l] !== null) return null; // ❌ لا تكتب فوق slot مليان

    const next = cloneAnswers(answers);

    next[q][w][l] = obj;

    setAnswers(next);

    // السؤال اللي انعدّل: بتنشال علامة ✕
    setWrongRows((prev) => prev.filter((x) => x !== q));

    return next;
  };

  const removeLetter = (q, w, l) => {
    const current = answers[q][w][l];

    if (!current) return;

    const next = cloneAnswers(answers);

    next[q][w][l] = null;

    setAnswers(next);

    // السؤال اللي انعدّل: بتنشال علامة ✕
    setWrongRows((prev) => prev.filter((x) => x !== q));

    setAnnouncement(`Letter ${current.letter} returned to the letters.`);
  };

  // ================================
  // DRAG & DROP (متل ما هو)
  // ================================

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || !destination.droppableId.startsWith("slot-")) return;

    const id = draggableId.replace("letter-", "");
    const letter = id.split("-")[0];

    const [q, w, l] = destination.droppableId.split("-").slice(1).map(Number);

    if (isRowLocked(q)) return;

    const next = placeLetter(q, w, l, { letter, id });

    if (!next) return;

    setPicked(null);
    setAnnouncement(
      `Letter ${letter} placed in question ${q + 1}, word ${w + 1}.`,
    );
  };

  // ================================
  // SELECT A LETTER THEN SELECT ITS TARGET (كليك/لمس/كيبورد)
  // ================================

  const pickLetter = (i, w, letter, id, focusTarget) => {
    if (isRowLocked(i)) {
      setAnnouncement("This question is correct and locked.");
      return;
    }

    if (isLetterUsed(id)) {
      setAnnouncement(
        `Letter ${letter} is already placed. Press its blank to return it.`,
      );
      return;
    }

    // نفس الحرف مرتين = إلغاء الاختيار
    if (picked?.id === id) {
      setPicked(null);
      setAnnouncement("Choice cancelled.");
      return;
    }

    setPicked({ id, letter });
    setAnnouncement(
      `Letter ${letter} chosen. Choose a blank and press Enter or Space to place it.`,
    );

    if (focusTarget) {
      const target = findTargetSlot(i, w);

      if (target) slotRefs.current[target]?.focus();
    }
  };

  const activateSlot = (q, w, l, viaKeyboard) => {
    if (isRowLocked(q)) {
      setAnnouncement(
        lockedRows.has(q)
          ? `Question ${q + 1} is correct and locked.`
          : "The answers are locked. Press Start Again to try again.",
      );
      return;
    }

    // الخانة فيها حرف: بيرجع مكانه بالـ Word Bank (قبل أو بعد Check)
    if (answers[q][w][l]) {
      removeLetter(q, w, l);
      return;
    }

    if (!picked) {
      setAnnouncement("Choose a letter first.");
      return;
    }

    const letterObj = picked;
    const next = placeLetter(q, w, l, letterObj);

    if (!next) return;

    setPicked(null);
    setAnnouncement(
      `Letter ${letterObj.letter} placed in question ${q + 1}, word ${w + 1}.`,
    );

    // بعد الوضع: الفوكس بيرجع على الحروف
    if (viaKeyboard) {
      const nextKey = findNextLetterKey(q, w, next);

      setTimeout(() => {
        if (nextKey) bankRefs.current[nextKey]?.focus();
        else slotRefs.current[`${q}-${w}-${l}`]?.focus();
      }, 0);
    }
  };

  // ================================
  // KEYBOARD HANDLERS
  // ================================

  const onBankKeyDown = (e, i, w, l, letter, id, count, isFocusable) => {
    if (e.defaultPrevented) return;

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      if (!e.repeat) pickLetter(i, w, letter, id, true);
      return;
    }

    if (ARROWS[e.key]) {
      e.preventDefault();
      e.stopPropagation();

      moveFocus(bankRefs, `${i}-${w}`, count, l, ARROWS[e.key], isFocusable);
      return;
    }

    if (e.key === "Escape" && picked) {
      e.preventDefault();
      e.stopPropagation();

      setPicked(null);
      setAnnouncement("Choice cancelled.");
    }
  };

  const onSlotKeyDown = (e, q, w, l, count, isFocusable) => {
    // Tab و Shift+Tab بيشتغلوا عادي
    if (e.key === "Tab") return;

    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();

      if (!e.repeat) activateSlot(q, w, l, true);
      return;
    }

    if (ARROWS[e.key]) {
      e.preventDefault();
      e.stopPropagation();

      moveFocus(slotRefs, `${q}-${w}`, count, l, ARROWS[e.key], isFocusable);
      return;
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();

      if (!isRowLocked(q)) removeLetter(q, w, l);
      return;
    }

    if (e.key === "Escape" && picked) {
      e.preventDefault();
      e.stopPropagation();

      setPicked(null);
      setAnnouncement("Choice cancelled.");
    }
  };

  // ================================
  // CHECK
  // الصح بينقفل (أخضر)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ================================

  const checkAnswers = () => {
    if (showAnswer || allDone) return;

    setPicked(null);

    // 1) فحص الخانات الفاضية
    const empty = answers.some(
      (row, i) =>
        !lockedRows.has(i) && row.some((word) => word.some((l) => l === null)),
    );

    if (empty) {
      const msg = "Please complete all answers.";

      ValidationAlert.info(msg);
      setAnnouncement(msg);
      return;
    }

    // 2) مقارنة الإجابات
    const nextLocked = new Set(lockedRows);
    const nextWrong = [];

    answers.forEach((row, i) => {
      if (nextLocked.has(i)) return;

      if (builtOf(row) === items[i].correct.join(" ")) nextLocked.add(i);
      else nextWrong.push(i);
    });

    setLockedRows(nextLocked);
    setWrongRows(nextWrong);

    // 3) حساب السكور
    const score = nextLocked.size;

    // الفيدباك المحكي: كل سؤال صح أو غلط
    setAnnouncement(
      [
        `Score ${score} out of ${TOTAL}.`,
        ...items.map(
          (_, i) =>
            `Question ${i + 1} is ${
              nextLocked.has(i) ? "correct" : "not correct"
            }.`,
        ),
        nextWrong.length
          ? "You can change the wrong answers and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );

    const color = score === TOTAL ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${TOTAL}
        </span>
      </div>
    `;

    if (score === TOTAL) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  // ================================
  // SHOW ANSWER / START AGAIN
  // ================================

  const showAnswers = () => {
    if (showAnswer) return;

    setPicked(null);

    // بنعبّي كل خانة بحرف حقيقي من الـ Word Bank تبع نفس الكلمة،
    // عشان الحروف تظهر "مستخدمة" ومتل ما لو الطالب حطها
    const filled = items.map((item, i) =>
      item.correct.map((word, w) => {
        const bank = item.scrambled[w].split("");
        const usedIdx = new Set();

        return word.split("").map((ch) => {
          const l = bank.findIndex((b, k) => b === ch && !usedIdx.has(k));

          usedIdx.add(l);

          return { letter: ch, id: letterId(ch, i, w, l) };
        });
      }),
    );

    setAnswers(filled);
    setLockedRows(new Set());
    setWrongRows([]);
    setShowAnswer(true);

    setAnnouncement("All answers shown. Every word is complete.");
  };

  // بيرجّع كل الحروف مكانها، وبيمسح الخانات، الفيدباك، القفل، والسكور
  const resetAll = () => {
    setAnswers(buildEmpty());
    setLockedRows(new Set());
    setWrongRows([]);
    setShowAnswer(false);
    setPicked(null);
    setRov({});

    setAnnouncement("Activity reset. All letters are back and all results are cleared.");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="main-container-component">
        {/* Screen Reader */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        <div className="div-forall" style={{marginBottom:"60px"}}>
            <ExerciseHeader
          sectionLetter="B"
          title="Unscramble and write."
          subTitle="Say the answer first, then rearrange the letters or words into the correct order."
          isReview={true}
        />

          <p id="r6p1q2-help" className="sr-only">
            Unscramble the letters to write each word. Press Tab to move to the
            letters of a word, then use the arrow keys to move between the
            letters. Press Enter on a letter to choose it. The focus moves to
            the blanks. Use the arrow keys to move between the blanks, then
            press Enter or Space on a blank to place the letter. The focus goes
            back to the letters. Press Enter or Space on a blank that has a
            letter to return the letter. You can also drag a letter into a
            blank, or click a letter and then click a blank. Press Check Answer
            to check. Correct answers are locked and wrong answers can be
            changed.
          </p>

          {items.map((item, i) => {
            const built = builtOf(answers[i]);

            const status = showAnswer
              ? "shown"
              : lockedRows.has(i)
                ? "correct"
                : wrongRows.includes(i)
                  ? "wrong"
                  : null;

            const rowLocked = isRowLocked(i);

            return (
              <div key={i} className="flex flex-col gap-3 text-[20px]">
                <div className="flex flex-col gap-5 my-6 text-[20px]">
                  <div className="flex gap-4">
                    <span className="font-bold">{i + 1}</span>
                    <h1>{item.scrambled.join(" ")}</h1>
                  </div>
                  <div className="flex gap-6 flex-wrap">
                    {item.scrambled.map((chunk, wordIndex) => {
                      const letters = chunk.split("");

                      // نقطة تاب وحدة للحروف ونقطة وحدة للخانات بكل كلمة
                      const bankFocusable = (l) =>
                        !rowLocked &&
                        !isLetterUsed(letterId(letters[l], i, wordIndex, l));

                      const slotFocusable = (l) =>
                        !rowLocked &&
                        (answers[i][wordIndex][l] !== null || !!picked);

                      const bankActive = getActive(
                        `b-${i}-${wordIndex}`,
                        letters.length,
                        bankFocusable,
                      );

                      const slotActive = getActive(
                        `s-${i}-${wordIndex}`,
                        letters.length,
                        slotFocusable,
                      );

                      return (
                        <div
                          key={wordIndex}
                          className="flex items-center gap-2"
                        >
                          {/* 🔤 BANK */}
                          <Droppable
                            droppableId={`bank-${i}-${wordIndex}`}
                            direction="horizontal"
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex gap-1"
                              >
                                {letters.map((letter, letterIndex) => {
                                  const id = letterId(
                                    letter,
                                    i,
                                    wordIndex,
                                    letterIndex,
                                  );
                                  const used = isLetterUsed(id);
                                  const isPicked = picked?.id === id;

                                  return (
                                    <Draggable
                                      key={id}
                                      draggableId={`letter-${id}`}
                                      index={letterIndex}
                                      isDragDisabled={rowLocked || used}
                                    >
                                      {(provided) => (
                                        <span
                                          ref={(el) => {
                                            provided.innerRef(el);
                                            bankRefs.current[
                                              `${i}-${wordIndex}-${letterIndex}`
                                            ] = el;
                                          }}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          role="button"
                                          tabIndex={
                                            letterIndex === bankActive ? 0 : -1
                                          }
                                          aria-pressed={isPicked}
                                          aria-disabled={rowLocked || used}
                                          aria-label={`Letter ${letter}, question ${i + 1}, word ${wordIndex + 1}.${
                                            used
                                              ? " Already placed."
                                              : " Press Enter to choose it, then press Enter on a blank to place it."
                                          }`}
                                          onClick={() =>
                                            pickLetter(
                                              i,
                                              wordIndex,
                                              letter,
                                              id,
                                              false,
                                            )
                                          }
                                          onFocus={() =>
                                            rememberFocus(
                                              `b-${i}-${wordIndex}`,
                                              letterIndex,
                                            )
                                          }
                                          onKeyDown={(e) =>
                                            onBankKeyDown(
                                              e,
                                              i,
                                              wordIndex,
                                              letterIndex,
                                              letter,
                                              id,
                                              letters.length,
                                              bankFocusable,
                                            )
                                          }
                                          className={`px-2 py-1 border-2 border-gray-500 bg-white text-[22px] h-[40px] w-[40px] flex items-center justify-center rounded font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]
                                            ${isPicked ? "ring-2 ring-[#2563eb]" : ""}
                                            ${
                                              used
                                                ? "bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed"
                                                : "bg-[#f3f3f3] cursor-grab hover:bg-blue-100"
                                            }
                                          `}
                                        >
                                          {letter}
                                        </span>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>

                          {/* ✏️ SLOTS */}
                          <div className="flex gap-1">
                            {answers[i][wordIndex].map((slot, slotIndex) => {
                              const slotId = `slot-${i}-${wordIndex}-${slotIndex}`;

                              // خانة فاضية وفي حرف مختار = هدف صالح
                              const isValidTarget =
                                !!picked && !slot && !rowLocked;

                              return (
                                <Droppable
                                  droppableId={slotId}
                                  key={slotId}
                                  isDropDisabled={rowLocked}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={(el) => {
                                        provided.innerRef(el);
                                        slotRefs.current[
                                          `${i}-${wordIndex}-${slotIndex}`
                                        ] = el;
                                      }}
                                      {...provided.droppableProps}
                                      role="button"
                                      tabIndex={
                                        slotIndex === slotActive ? 0 : -1
                                      }
                                      aria-disabled={rowLocked}
                                      aria-label={`Question ${i + 1}, word ${wordIndex + 1}, blank ${slotIndex + 1}. ${
                                        slot
                                          ? `Contains ${slot.letter}.${rowLocked ? "" : " Press Enter to return it."}`
                                          : isValidTarget
                                            ? "Empty. Press Enter to place the chosen letter here."
                                            : "Empty."
                                      }`}
                                      onClick={() =>
                                        activateSlot(
                                          i,
                                          wordIndex,
                                          slotIndex,
                                          false,
                                        )
                                      }
                                      onFocus={() =>
                                        rememberFocus(
                                          `s-${i}-${wordIndex}`,
                                          slotIndex,
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        onSlotKeyDown(
                                          e,
                                          i,
                                          wordIndex,
                                          slotIndex,
                                          letters.length,
                                          slotFocusable,
                                        )
                                      }
                                      onKeyUp={(e) => {
                                        if (isActivateKey(e)) {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }
                                      }}
                                      className={`w-7 h-7 text-center text-[22px] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]
    ${
      snapshot.isDraggingOver
        ? "border-b-2 border-blue-500 bg-blue-100 scale-110"
        : isValidTarget
          ? "border-b-2 border-blue-500 bg-blue-50"
          : "border-b-2 border-black"
    }
  `}
                                    >
                                      {slot?.letter}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* result input */}
                <div className="relative">
                  <input
                    type="text"
                    value={built}
                    readOnly
                    aria-label={`Question ${i + 1} answer.${
                      status === "correct"
                        ? " Correct."
                        : status === "shown"
                          ? " Correct answer."
                          : status === "wrong"
                            ? " Not correct."
                            : ""
                    }`}
                    onKeyDown={(e) => e.stopPropagation()}
                    onKeyUp={(e) => e.stopPropagation()}
                    className={`w-[90%] border-b-2 text-[22px] outline-none bg-transparent focus-visible:ring-2 focus-visible:ring-[#2563eb] ${
                      status === "wrong"
                        ? "border-red-500"
                        : status === "correct" || status === "shown"
                          ? "border-green-600"
                          : "border-gray-600"
                    }`}
                  />
                  {status === "wrong" && (
                    <div
                      aria-hidden="true"
                      className="absolute -top-2 left-70 ml-3 w-6 h-6 bg-red-500 rounded-full flex items-center text-sm justify-center text-white font-bold border-2 border-white shadow-lg"
                    >
                      ✕
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
}