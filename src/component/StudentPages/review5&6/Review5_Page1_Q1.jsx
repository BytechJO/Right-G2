/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../../WorkBookPages/Button";
// 🔊 مدير الصوت المشترك (صوت واحد بس بنفس الوقت)
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import "./Review5_Page1_Q1.css";
import img1 from "../../../assets/imgs/Right 2 Unit 6 Helens Day/Page 52/p52.svg";

// ========================================
// AUDIO (Page 52 - A)
// ========================================

import audioFish from "../../../assets/audio/ClassBook/U 6/Page 52 - A/Item_001_fish.mp3";
import audioApples from "../../../assets/audio/ClassBook/U 6/Page 52 - A/Item_002_apples.mp3";
import audioRice from "../../../assets/audio/ClassBook/U 6/Page 52 - A/Item_003_rice.mp3";
import audioMeat from "../../../assets/audio/ClassBook/U 6/Page 52 - A/Item_004_meat.mp3";
import audioHamburger from "../../../assets/audio/ClassBook/U 6/Page 52 - A/Item_005_hamburger.mp3";
import audioChicken from "../../../assets/audio/ClassBook/U 6/Page 52 - A/Item_006_chicken.mp3";
import ExerciseHeader from "../../ExerciseHeader";

// ========================================
// DATA
// ========================================

const questions = [
  { code: "A1", answer: "fish", audio: audioFish },
  { code: "C2", answer: "apples", audio: audioApples },
  { code: "B1", answer: "rice", audio: audioRice },
  { code: "A2", answer: "meat", audio: audioMeat },
  { code: "C3", answer: "hamburger", audio: audioHamburger },
  { code: "B3", answer: "chicken", audio: audioChicken },
];

const options = questions.map((q) => q.answer);

const TOTAL = questions.length;

const emptyAnswers = () => questions.map(() => "");

// ========================================
// HELPERS (خارج الكومبوننت)
// ========================================

// Enter و Space بنعالجهم بإيدينا ونوقّف انتشار الحدث،
// لأن الكتاب غالباً عنده مستمع كيبورد عام بياخد هالمفتاحين
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

const stopActivateKeyUp = (e) => {
  if (!isActivateKey(e)) return;

  e.preventDefault();
  e.stopPropagation();
};

// أول كلمة فاضية بالبنك بعد كلمة معينة (دورة كاملة)
const findNextFreeWord = (nextAnswers, fromIndex) => {
  for (let k = 1; k <= options.length; k += 1) {
    const word = options[(fromIndex + k) % options.length];

    if (!nextAnswers.includes(word)) return word;
  }

  return null;
};

// ========================================
// BADGES
// ========================================

// سبيكر أسود داخل دائرة بيضا: بيظهر بس وقت ما صوت الكلمة شغّال
const SpeakerBadge = () => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      top: -10,
      right: -10,
      width: 22,
      height: 22,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 2,
      lineHeight: 1,
      background: "#fff",
      color: "#000",
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);

// ========================================
// MAIN
// ========================================

const Review5_Page1_Q1 = () => {
  const [answers, setAnswers] = useState(emptyAnswers);

  // الخانات اللي جوابها صح بعد Check (بتنقفل)
  const [lockedSet, setLockedSet] = useState(() => new Set());

  // الخانات اللي جوابها غلط بعد آخر Check (بتضل قابلة للتعديل)
  const [wrongIds, setWrongIds] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  // الكلمة المختارة بالكيبورد (بانتظار اختيار الخانة)
  const [selected, setSelected] = useState(null);

  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const wordRefs = useRef({});
  const slotRefs = useRef({});
  const lastDropRef = useRef(0);
  const audioOwner = useRef({}).current;

  const isLocked = (i) => showAnswer || lockedSet.has(i);

  const isUsed = (word) => answers.includes(word);

  // ========================================
  // AUDIO
  // ========================================

  const stopAudio = () => {
    stopGlobalAudio(audioOwner);
    setPlayingKey(null);
  };

  // playGlobalAudio بيوقف أي صوت ثاني شغّال قبل ما يشغّل هاد
  const playAudio = (key, src) => {
    if (!src) return;

    playGlobalAudio(src, {
      owner: audioOwner,
      onFinish: () => setPlayingKey((prev) => (prev === key ? null : prev)),
    });

    setPlayingKey(key);
  };

  // وقف الصوت إذا سكرت الصفحة
  useEffect(() => () => stopGlobalAudio(audioOwner), [audioOwner]);

  // فوكس بالتاب على كلمة = شغّل صوتها (الماوس/اللمس بيروحوا على onClick)
  const onWordFocus = (e, index) => {
    if (e.currentTarget.matches(":focus-visible")) {
      playAudio(`w:${index}`, questions[index].audio);
    }
  };

  // ========================================
  // FOCUS HELPERS
  // ========================================

  const focusSoon = (el) => {
    requestAnimationFrame(() => el?.focus());
  };

  // أول خانة مفتوحة: الفاضية أولاً، وإلا أول وحدة مفتوحة
  const firstTargetSlot = () => {
    const open = questions.map((_, i) => i).filter((i) => !isLocked(i));

    return open.find((i) => answers[i] === "") ?? open[0];
  };

  // ========================================
  // DRAG & DROP (متل ما كان)
  // ========================================

  const onDragStart = () => {
    setSelected(null);
  };

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || showAnswer) return;

    const value = draggableId.replace("word-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    if (Number.isNaN(index) || isLocked(index)) return;

    // بنتجاهل أي كليك بيجي بعد السحب مباشرة
    lastDropRef.current = Date.now();

    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    setWrongIds((prev) => prev.filter((id) => id !== index));
    setAnnouncement(`${value} placed in blank ${index + 1}.`);
  };

  // ========================================
  // KEYBOARD / CLICK: كلمة من البنك
  // Enter / Space: بيختار الكلمة وبينقل الفوكس مباشرة للخانات
  // ========================================

  const onWordActivate = (word, index) => {
    if (showAnswer) return;

    playAudio(`w:${index}`, questions[index].audio);

    if (isUsed(word)) {
      setAnnouncement(
        `${word} is already in a blank. Press that blank to return it to the word bank.`,
      );
      return;
    }

    const target = firstTargetSlot();

    if (target === undefined) return;

    setSelected(word);

    setAnnouncement(
      `${word} selected. Choose a blank and press Enter to put it there, or press Escape to cancel.`,
    );

    focusSoon(slotRefs.current[target]);
  };

  const onWordKeyDown = (e, word, index) => {
    if (!isActivateKey(e)) return;

    e.preventDefault();
    e.stopPropagation();

    if (!e.repeat) onWordActivate(word, index);
  };

  // الماوس: بس بيشغّل الصوت (السحب شغال متل ما كان). click من قارئ الشاشة (detail 0) = اختيار
  const onWordClick = (e, word, index) => {
    if (e.defaultPrevented) return;

    if (e.detail === 0) onWordActivate(word, index);
    else playAudio(`w:${index}`, questions[index].audio);
  };

  // ========================================
  // KEYBOARD / CLICK: خانة
  // - في كلمة مختارة: بتنحط بالخانة والفوكس بيرجع للبنك
  // - ما في كلمة مختارة والخانة فيها كلمة: بترجع للبنك
  // ========================================

  const removeWord = (i) => {
    const word = answers[i];

    if (!word || isLocked(i)) return;

    setAnswers((prev) => prev.map((a, idx) => (idx === i ? "" : a)));
    setWrongIds((prev) => prev.filter((id) => id !== i));

    setAnnouncement(`${word} returned to the word bank.`);
  };

  const onSlotPress = (i) => {
    if (isLocked(i)) {
      if (lockedSet.has(i)) {
        setAnnouncement(`Blank ${i + 1} is correct and locked.`);
      }
      return;
    }

    if (selected) {
      const word = selected;
      const replaced = answers[i];

      const nextAnswers = answers.map((a, idx) =>
        idx === i ? word : a === word ? "" : a,
      );

      setAnswers(nextAnswers);
      setWrongIds((prev) => prev.filter((id) => id !== i));
      setSelected(null);

      const next = findNextFreeWord(nextAnswers, options.indexOf(word));

      setAnnouncement(
        `${word} placed in blank ${i + 1}.${
          replaced ? ` ${replaced} returned to the word bank.` : ""
        }${next ? "" : " All words are placed. Press Check Answer."}`,
      );

      // الفوكس بيرجع للبنك على الكلمة اللي بعدها
      if (next) focusSoon(wordRefs.current[next]);

      return;
    }

    if (answers[i]) {
      removeWord(i);
      return;
    }

    setAnnouncement("This blank is empty. Select a word from the word bank first.");
  };

  const onSlotKeyDown = (e, i) => {
    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();

      if (!e.repeat) onSlotPress(i);

      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      e.stopPropagation();
      removeWord(i);
    }
  };

  const onSlotClick = (e, i) => {
    // كليك بيجي بعد السحب أو معالج من dnd: نتجاهله
    if (e.defaultPrevented || Date.now() - lastDropRef.current < 300) return;

    onSlotPress(i);
  };

  // ========================================
  // ESC + TAB
  // أثناء اختيار كلمة: التاب بيتنقل بس بين الخانات المفتوحة، و Escape بيلغي الاختيار
  // ========================================

  const handleWrapperKeyDown = (e) => {
    if (!selected) return;

    if (e.key === "Escape") {
      const word = selected;

      setSelected(null);
      setAnnouncement("Selection cancelled.");
      focusSoon(wordRefs.current[word]);

      return;
    }

    if (e.key !== "Tab") return;

    const targets = questions
      .map((_, i) => i)
      .filter((i) => !isLocked(i))
      .map((i) => slotRefs.current[i])
      .filter(Boolean);

    if (targets.length === 0) return;

    e.preventDefault();

    const idx = targets.indexOf(document.activeElement);

    const next =
      idx === -1
        ? e.shiftKey
          ? targets.length - 1
          : 0
        : (idx + (e.shiftKey ? -1 : 1) + targets.length) % targets.length;

    targets[next].focus();
  };

  // ========================================
  // CHECK
  // الصح بينقفل (أخضر)، الغلط بيضل ✕ وبيقدر الطالب يعدّله
  // ========================================

  const checkAnswers = () => {
    if (showAnswer || lockedSet.size === TOTAL) return;

    stopAudio();
    setSelected(null);

    if (answers.some((a) => a === "")) {
      const msg = "Please complete all answers.";

      ValidationAlert.info("Oops!", msg);
      setAnnouncement(msg);
      return;
    }

    const nextLocked = new Set(lockedSet);
    const nextWrong = [];

    answers.forEach((a, i) => {
      if (nextLocked.has(i)) return;

      if (a === questions[i].answer) nextLocked.add(i);
      else nextWrong.push(i);
    });

    const score = nextLocked.size;

    setLockedSet(nextLocked);
    setWrongIds(nextWrong);

    setAnnouncement(
      [
        `Score ${score} out of ${TOTAL}.`,
        nextWrong.length
          ? `Blank ${nextWrong.map((i) => i + 1).join(", ")} ${
              nextWrong.length > 1 ? "are" : "is"
            } not correct. You can change ${
              nextWrong.length > 1 ? "them" : "it"
            } and check again.`
          : "All answers are correct.",
      ].join(" "),
    );

    const color = score === TOTAL ? "green" : score === 0 ? "red" : "orange";

    const message = `
  <div style="font-size:20px;text-align:center;">
    <span style="color:${color};font-weight:bold;">
      Score: ${score} / ${TOTAL}
    </span>
  </div>
  `;

    if (score === TOTAL) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  // ========================================
  // SHOW ANSWER / START AGAIN
  // ========================================

  const showAnswers = () => {
    stopAudio();
    setSelected(null);

    setAnswers(questions.map((q) => q.answer));
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(true);

    setAnnouncement("All answers shown. Every blank has the correct word.");
  };

  // بيمسح كل الخانات، علامات ✕، القفل، النتيجة، والصوت
  const resetAll = () => {
    stopAudio();
    setSelected(null);

    setAnswers(emptyAnswers());
    setLockedSet(new Set());
    setWrongIds([]);
    setShowAnswer(false);

    setAnnouncement("Activity reset. All answers and results are cleared.");
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div
        className="main-container-component"
        onKeyDown={handleWrapperKeyDown}
      >
        {/* Screen Reader */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        <div
          className="div-forall"
          style={{ marginBottom: "50px", gap: "2px" }}
        >
            <ExerciseHeader
          sectionLetter="A"
          title="Find and write"
          subTitle="Use the picture and word clues, then type the missing word or sentence carefully."
          isReview={true}
        />

          <p id="r5p1q1-help" className="sr-only">
            To fill a blank with the keyboard, press Tab to reach a word in the
            word bank, then press Enter or Space. The word is selected and focus
            moves to the blanks. Press Enter or Space on a blank to put the word
            there, and focus goes back to the word bank. Press Enter, Space, or
            Backspace on a filled blank to return its word to the word bank.
            Press Escape to cancel a selection. You can also drag the words with
            the mouse or your finger. Pressing a word plays its audio. After
            Check Answer, correct answers are locked and wrong answers can be
            changed.
          </p>

          {/* IMAGE */}
          <div className="flex justify-center my-5">
            {/* ⚠️ alt مؤقت: عدّليه حسب الصورة */}
            <img
              src={img1}
              alt="A table of food pictures with columns A, B, and C and rows 1 to 3."
              style={{
                width: "100%",

                height: "263px",
              }}
            />
          </div>

          <div className="flex flex-col">
            {/* OPTIONS */}
            <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-2.5 justify-center mb-5"
                  aria-describedby="r5p1q1-help"
                >
                  {options.map((word, i) => {
                    const used = isUsed(word);
                    const isSelected = selected === word;

                    return (
                      <Draggable
                        key={word}
                        draggableId={`word-${word}`}
                        index={i}
                        isDragDisabled={showAnswer || used}
                      >
                        {(provided) => (
                          // العنصر الخارجي هو اللي بياخد الفوكس والكيبورد،
                          // وطبقة السحب (dragHandle) جواته: هيك Space ما بيشغّل
                          // سحب الكيبورد الافتراضي تبع المكتبة
                          <span
                            ref={(el) => {
                              provided.innerRef(el);
                              wordRefs.current[word] = el;
                            }}
                            {...provided.draggableProps}
                            role="button"
                            tabIndex={used ? -1 : 0}
                            aria-disabled={used}
                            aria-pressed={isSelected}
                            aria-label={
                              used
                                ? `Word: ${word}. Already in a blank.`
                                : `Word: ${word}. Press Enter to select it and choose a blank.`
                            }
                            onFocus={(e) => onWordFocus(e, i)}
                            onClick={(e) => onWordClick(e, word, i)}
                            onKeyDown={(e) => onWordKeyDown(e, word, i)}
                            onKeyUp={stopActivateKeyUp}
                            className="CB-unit2-p6-q2-word focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb]"
                            style={{
                              position: "relative",
                              background: used
                                ? "#ccc"
                                : isSelected
                                  ? "#ffffff"
                                  : "white",
                              opacity: used ? 0.6 : 1,
                              cursor: used ? "not-allowed" : "grab",
                              ...(isSelected
                                ? { boxShadow: "0 0 0 2px #ccc" }
                                : {}),
                              ...provided.draggableProps.style,
                            }}
                          >
                            {word}

                            {/* طبقة السحب بالماوس / اللمس */}
                            <span
                              {...provided.dragHandleProps}
                              tabIndex={undefined}
                              role={undefined}
                              aria-describedby={undefined}
                              style={{
                                position: "absolute",
                                inset: 0,
                                cursor: "inherit",
                              }}
                            />

                            {/* 🔊 السبيكر بيظهر بس وقت ما الصوت شغّال */}
                            {playingKey === `w:${i}` && <SpeakerBadge />}
                          </span>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* QUESTIONS */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-[60px] mt-5">
              {questions.map((q, i) => {
                const locked = isLocked(i);
                const isWrong = wrongIds.includes(i);
                const isCorrect = lockedSet.has(i) || showAnswer;
                const isTarget = Boolean(selected) && !locked;

                const label = `Blank ${i + 1}, picture ${q.code}. ${
                  showAnswer
                    ? `Answer shown: ${answers[i]}.`
                    : lockedSet.has(i)
                      ? `Correct. ${answers[i]}. Locked.`
                      : selected
                        ? `${
                            answers[i] ? `Contains ${answers[i]}. ` : "Empty. "
                          }Press Enter to put ${selected} here.`
                        : answers[i]
                          ? `${isWrong ? "Not correct. " : ""}Contains ${
                              answers[i]
                            }. Press Enter to return it to the word bank.`
                          : "Empty."
                }`;

                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="font-bold">{i + 1}</span>

                    <span className="bg-[#e6b29c] px-2 py-1 rounded-md">
                      {q.code}
                    </span>

                    <Droppable droppableId={`slot-${i}`} isDropDisabled={locked}>
                      {(provided, snapshot) => (
                        <div className="relative w-full">
                          <div
                            ref={(el) => {
                              provided.innerRef(el);
                              slotRefs.current[i] = el;
                            }}
                            {...provided.droppableProps}
                            role="button"
                            tabIndex={locked ? -1 : 0}
                            aria-label={label}
                            aria-disabled={locked}
                            aria-describedby="r5p1q1-help"
                            onClick={(e) => onSlotClick(e, i)}
                            onKeyDown={(e) => onSlotKeyDown(e, i)}
                            onKeyUp={stopActivateKeyUp}
                            className={`w-full h-[35px] border-b-[2px] flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2563eb] ${
                              snapshot.isDraggingOver ? "bg-blue-100" : ""
                            } ${
                              isCorrect
                                ? "border-[#4caf50]"
                                : isWrong
                                  ? "border-red-500"
                                  : "border-[#444]"
                            }`}
                            style={{
                              cursor:
                                !locked && (answers[i] || selected)
                                  ? "pointer"
                                  : undefined,
                              ...(isTarget
                                ? { boxShadow: "0 0 0 4px rgba(37,99,235,.45)" }
                                : {}),
                            }}
                          >
                            {answers[i] && (
                              <span className="font-bold">{answers[i]}</span>
                            )}

                            {provided.placeholder}
                            {isWrong && (
                              <div
                                aria-hidden="true"
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white"
                              >
                                ✕
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <Button
          handleShowAnswer={showAnswers}
          handleStartAgain={resetAll}
          checkAnswers={checkAnswers}
        />
      </div>
    </DragDropContext>
  );
};

export default Review5_Page1_Q1;