import React, { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 70/Ex B 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 70/Asset 4.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 70/Asset 5.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 70/Asset 6.svg";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import mondayAudio from "../../../assets/audio/ClassBook/U 7/Page 63 - D/Item_002_Monday.mp3";
import sound0 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_002_time.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_003_What.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_004_it.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_005_is.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_006_It's.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_007_half.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_008_past.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_009_three.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_011_today.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_012_day.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 8/Page 70 - B/Item_014_Friday.mp3";
const wordAudio = {
  monday: mondayAudio,
  time: sound0,
  what: sound1,
  it: sound2,
  is: sound3,
  "it's": sound4,
  half: sound5,
  past: sound6,
  three: sound7,
  today: sound8,
  day: sound9,
  friday: sound11,
};
const pointerSensors = [useMouseSensor, useTouchSensor];
const focusClass =
  " focus-visible:outline-4! focus-visible:outline-[#2563eb]! rounded focus-visible:outline-offset-4!";
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";
const Review7_Page1_Q2 = () => {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
    }
    if (button?.style) {
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const questions = [
    {
      id: 1,
      scramble: "time? what it is",

      questionWords: [
        { id: "q1-2", text: "time" },
        { id: "q1-1", text: "What" },
        { id: "q1-4", text: "it?" },
        { id: "q1-3", text: "is" },
      ],

      answerWords: [
        { id: "a1-1", text: "It's" },
        { id: "a1-2", text: "half" },
        { id: "a1-3", text: "past" },
        { id: "a1-4", text: "three." },
      ],

      correctQuestion: "What time is it?",
      correctAnswer: "It's half past three.",
      image: img1,
    },

    {
      id: 2,
      scramble: "today is day? what it",

      questionWords: [
        { id: "q2-5", text: "today?" },
        { id: "q2-3", text: "is" },
        { id: "q2-2", text: "day" },
        { id: "q2-1", text: "What" },
        { id: "q2-4", text: "it" },
      ],

      answerWords: [
        { id: "a2-1", text: "It's" },
        { id: "a2-2", text: "Friday." },
      ],

      correctQuestion: "What day is it today?",
      correctAnswer: "It's Friday.",
      image: img2,
    },

    {
      id: 3,
      scramble: "is? month it what",

      questionWords: [
        { id: "q3-3", text: "is" },
        { id: "q3-2", text: "month" },
        { id: "q3-4", text: "it?" },
        { id: "q3-1", text: "What" },
      ],

      answerWords: [
        { id: "a3-1", text: "It's" },
        { id: "a3-2", text: "January." },
      ],

      correctQuestion: "What month is it?",
      correctAnswer: "It's January.",
      image: img3,
    },

    {
      id: 4,
      scramble: "? day is today it what",

      questionWords: [
        { id: "q4-2", text: "day" },
        { id: "q4-3", text: "is" },
        { id: "q4-5", text: "today?" },
        { id: "q4-4", text: "it" },
        { id: "q4-1", text: "What" },
      ],

      answerWords: [
        { id: "a4-1", text: "It's" },
        { id: "a4-2", text: "Monday." },
      ],

      correctQuestion: "What day is it today?",
      correctAnswer: "It's Monday.",
      image: img4,
    },
  ];

  const [placements, setPlacements] = useState({});
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false);
  const [pickedWord, setPickedWord] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null),
    chipRefs = useRef({}),
    slotRefs = useRef({});
  const focusFrame = useRef(null),
    skipFocusSound = useRef(false);
  const allWords = questions.flatMap((q) => [
    ...q.questionWords,
    ...q.answerWords,
  ]);
  const byId = Object.fromEntries(allWords.map((word) => [word.id, word]));
  const answers = Object.fromEntries(
    Object.entries(placements).map(([slot, ids]) => [
      slot,
      ids.map((id) => byId[id].text).join(" "),
    ]),
  );
  const usedWords = Object.values(placements).flat();
  const correct = Object.fromEntries(
    questions.flatMap((q, i) => [
      [`q-${i}`, q.correctQuestion],
      [`a-${i}`, q.correctAnswer],
    ]),
  );
  const isLocked = (slot) => locked || results[slot] === "correct";
  const soundFor = (id) =>
    wordAudio[byId[id]?.text.replace(/[?.]/g, "").toLowerCase()];
  const stopAudio = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const playSound = (src, key = src) => {
    if (!src) return;
    stopAudio();
    document.querySelectorAll("audio").forEach((audio) => audio.pause());
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      setPlayingKey(null);
      audio.onended = null;
      audio.onerror = null;
    };
    audio.onended = finish;
    audio.onerror = () => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.play().catch(() => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    });
  };
  useEffect(() => {
    const onOtherPlay = (event) => {
      if (event.target === audioRef.current) return;
      const audio = audioRef.current;
      audioRef.current = null;
      setPlayingKey(null);
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
    document.addEventListener("play", onOtherPlay, true);
    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      cancelAnimationFrame(focusFrame.current);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  const focusElement = (getElement) => {
    cancelAnimationFrame(focusFrame.current);
    focusFrame.current = requestAnimationFrame(() => {
      skipFocusSound.current = true;
      getElement()?.focus();
      skipFocusSound.current = false;
      focusFrame.current = null;
    });
  };
  const onAudioFocus = (e, src, key = src) => {
    if (!skipFocusSound.current && e.currentTarget.matches(":focus-visible"))
      playSound(src, key);
  };
  const blockActivationKeyUp = (e) => {
    if (isActivateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const speakerBadge = (key) =>
    playingKey === key && (
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
          zIndex: 3,
          lineHeight: 1,
          background: "#fff",
          color: "#000",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );
  const clearTransient = () => {
    stopAudio();
    cancelAnimationFrame(focusFrame.current);
    setPickedWord(null);
    setHovered(null);
  };
  const placeWord = (slot, id, viaKeyboard = false) => {
    if (
      !Object.hasOwn(correct, slot) ||
      !byId[id] ||
      isLocked(slot) ||
      usedWords.includes(id)
    )
      return;
    const updated = {
      ...placements,
      [slot]: [...(placements[slot] || []), id],
    };
    setPlacements(updated);
    setResults((previous) => ({ ...previous, [slot]: null }));
    setPickedWord(null);
    setAnnouncement(byId[id].text + " placed in " + slot + ".");
    if (viaKeyboard) {
      const bank = id.startsWith("q")
        ? questions[Number(id[1]) - 1].questionWords
        : questions[Number(id[1]) - 1].answerWords;
      const next = bank.find(
        (word) => !Object.values(updated).flat().includes(word.id),
      );
      focusElement(() =>
        next ? chipRefs.current[next.id] : slotRefs.current[slot],
      );
    }
  };
  const returnWord = (slot, id, viaKeyboard = false) => {
    playSound(soundFor(id), (isLocked(slot) ? "placed-" : "bank-") + id);
    if (isLocked(slot)) {
      setAnnouncement("This sentence is correct and locked.");
      return;
    }
    setPlacements((previous) => ({
      ...previous,
      [slot]: (previous[slot] || []).filter((wordId) => wordId !== id),
    }));
    setResults((previous) => ({ ...previous, [slot]: null }));
    setPickedWord(null);
    setAnnouncement(byId[id].text + " returned to its word bank.");
    if (viaKeyboard) focusElement(() => chipRefs.current[id]);
  };
  const pickWord = (id) => {
    playSound(soundFor(id), "bank-" + id);
    if (locked || usedWords.includes(id)) return;
    setPickedWord(id);
    const ownSlot = (id.startsWith("q") ? "q-" : "a-") + (Number(id[1]) - 1);
    const target = !isLocked(ownSlot)
      ? ownSlot
      : Object.keys(correct).find((slot) => !isLocked(slot));
    if (target) focusElement(() => slotRefs.current[target]);
    setAnnouncement(
      byId[id].text +
        " selected. Activate a sentence line to append it. Escape cancels.",
    );
  };
  const onDragEnd = ({ destination, draggableId }) => {
    if (destination) placeWord(destination.droppableId, draggableId);
  };
  const reset = () => {
    clearTransient();
    setPlacements({});
    setResults({});
    setLocked(false);
    setAnnouncement(
      "Activity reset. All words, results and locks are cleared.",
    );
  };
  const showAnswers = () => {
    clearTransient();
    const filled = {};
    questions.forEach((q, i) => {
      filled[`q-${i}`] = [...q.questionWords]
        .sort((a, b) => Number(a.id.split("-")[1]) - Number(b.id.split("-")[1]))
        .map((word) => word.id);
      filled[`a-${i}`] = [...q.answerWords]
        .sort((a, b) => Number(a.id.split("-")[1]) - Number(b.id.split("-")[1]))
        .map((word) => word.id);
    });
    setPlacements(filled);
    setResults(Object.fromEntries(Object.keys(correct).map((slot) => [slot, "correct"])));
    setLocked(true);
    setAnnouncement("Correct questions and answers shown and locked.");
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    clearTransient();
    if (Object.keys(correct).some((slot) => !answers[slot])) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }
    const checked = Object.fromEntries(
      Object.keys(correct).map((slot) => [
        slot,
        results[slot] === "correct" || answers[slot] === correct[slot]
          ? "correct"
          : "wrong",
      ]),
    );
    const score = Object.values(checked).filter(
        (result) => result === "correct",
      ).length,
      total = Object.keys(correct).length;
    setResults(checked);
    setLocked(score === total);
    setAnnouncement(
      `Score ${score} out of ${total}. Correct sentence lines are locked; incorrect lines can be changed.`,
    );
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const message = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold">Score: ${score} / ${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(message));
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };
  const renderBank = (words, slot, type) => (
    <Droppable
      droppableId={"bank-" + slot}
      direction="horizontal"
      isDropDisabled
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex gap-2 mb-2 flex-wrap border-2 border-dashed border-gray-500 p-2 rounded-lg"
        >
          {words.map((w, index) => (
            <Draggable
              key={w.id}
              draggableId={w.id}
              index={index}
              isDragDisabled={locked || usedWords.includes(w.id)}
            >
              {(drag) => (
                <span
                  ref={(node) => {
                    drag.innerRef(node);
                    chipRefs.current[w.id] = node;
                  }}
                  {...drag.draggableProps}
                  {...drag.dragHandleProps}
                  role="button"
                  tabIndex={0}
                  data-word-id={w.id}
                  aria-pressed={pickedWord === w.id}
                  aria-disabled={locked || usedWords.includes(w.id)}
                  aria-label={
                    w.text +
                    (usedWords.includes(w.id)
                      ? ", already placed"
                      : ", press Enter or Space to select")
                  }
                  aria-describedby="r7p1q2-help"
                  onClick={() => playSound(soundFor(w.id), "bank-" + w.id)}
                  onFocus={(e) =>
                    onAudioFocus(e, soundFor(w.id), "bank-" + w.id)
                  }
                  onKeyDown={(e) => {
                    if (!isActivateKey(e)) return;
                    e.preventDefault();
                    e.stopPropagation();
                    if (!e.repeat) pickWord(w.id);
                  }}
                  onKeyUp={blockActivationKeyUp}
                  style={{
                    ...drag.draggableProps.style,
                    ...(pickedWord === w.id || playingKey === "bank-" + w.id
                      ? {
                          boxShadow: "0 0 0 3px #2563eb",
                          backgroundColor: "#dbeafe",
                        }
                      : {}),
                  }}
                  className={`relative px-3 py-1 rounded ${focusClass} ${usedWords.includes(w.id) ? (type === "q" ? "bg-yellow-100 text-gray-300 cursor-not-allowed" : "bg-blue-50 text-gray-300 cursor-not-allowed") : type === "q" ? "bg-yellow-200 cursor-grab" : "bg-blue-200 cursor-grab"}`}
                >
                  {w.text}
                  {speakerBadge("bank-" + w.id)}
                </span>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
  const renderSlot = (slot, isQuestion) => (
    <div className="relative">
      <Droppable droppableId={slot} isDropDisabled={isLocked(slot)}>
        {(provided) => (
          <div
            ref={(node) => {
              provided.innerRef(node);
              slotRefs.current[slot] = node;
            }}
            {...provided.droppableProps}
            role="group"
            tabIndex={0}
            data-slot={slot}
            aria-disabled={isLocked(slot)}
            aria-label={`${isQuestion ? "Question" : "Answer"} line ${Number(slot.slice(2)) + 1}. ${answers[slot] || "Empty"}. ${isLocked(slot) ? "Locked." : "Activate to append the selected word."}`}
            aria-describedby="r7p1q2-help"
            onKeyDown={(e) => {
              if (isActivateKey(e)) {
                e.preventDefault();
                e.stopPropagation();
                if (!e.repeat && pickedWord) placeWord(slot, pickedWord, true);
              } else if (e.key === "Delete" || e.key === "Backspace") {
                e.preventDefault();
                e.stopPropagation();
                if (results[slot] === "wrong" && !isLocked(slot)) {
                  const id = placements[slot]?.at(-1);
                  if (id) returnWord(slot, id, true);
                }
              }
            }}
            onKeyUp={blockActivationKeyUp}
            className={`border-b-2 h-10 text-blue-600 ${focusClass} ${isQuestion ? "mb-4" : ""} ${results[slot] === "correct" ? "border-green-600" : results[slot] === "wrong" ? "border-red-500" : "border-black"}`}
          >
            {(placements[slot] || []).map((id) => (
              <span
                key={id}
                role="button"
                tabIndex={0}
                data-placed-id={id}
                aria-disabled={isLocked(slot)}
                aria-label={
                  byId[id].text +
                  (isLocked(slot)
                    ? ", locked; activate to listen"
                    : ", activate to return to the word bank")
                }
                onMouseEnter={() => setHovered(slot + id)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  returnWord(slot, id);
                }}
                onFocus={(e) => onAudioFocus(e, soundFor(id), "placed-" + id)}
                onKeyDown={(e) => {
                  if (!isActivateKey(e)) return;
                  e.preventDefault();
                  e.stopPropagation();
                  if (!e.repeat) returnWord(slot, id, true);
                }}
                onKeyUp={blockActivationKeyUp}
                className={"relative" + focusClass}
                style={{
                  marginRight: "6px",
                  cursor: "pointer",
                  color: hovered === slot + id ? "red" : "black",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  boxShadow:
                    playingKey === "placed-" + id
                      ? "0 0 0 3px #2563eb"
                      : undefined,
                  backgroundColor:
                    playingKey === "placed-" + id ? "#dbeafe" : undefined,
                }}
              >
                {byId[id].text}
                {speakerBadge("placed-" + id)}
              </span>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {results[slot] === "wrong" && (
        <div
          aria-hidden="true"
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white"
        >
          <span className="text-white text-sm font-bold">✕</span>
        </div>
      )}
    </div>
  );
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      enableDefaultSensors={false}
      sensors={pointerSensors}
      onDragStart={() => {
        cancelAnimationFrame(focusFrame.current);
        setPickedWord(null);
      }}
      dragHandleUsageInstructions="Press Enter or Space to select a word, then activate a sentence line to append it. Mouse and touch dragging are also supported."
    >
      <div
        className="main-container-component"
        onKeyDown={(e) => {
          if (isActivateKey(e)) e.stopPropagation();
          if (e.key === "Escape" && pickedWord) {
            e.preventDefault();
            e.stopPropagation();
            const id = pickedWord;
            setPickedWord(null);
            setAnnouncement("Selection cancelled.");
            focusElement(() => chipRefs.current[id]);
          }
        }}
        onKeyUp={(e) => {
          if (isActivateKey(e)) e.stopPropagation();
        }}
      >
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>
        <p id="r7p1q2-help" className="sr-only">
          Tab moves between word banks and sentence lines. Enter or Space
          selects a word, then appends it to a line. Activate a placed word to
          return it to its bank. Escape cancels selection. Delete or Backspace
          removes the last word of an incorrect line. Correct lines are locked
          after checking.
        </p>
        <div className="div-forall">
          <div className="mb-6">
            <ExerciseHeader
              sectionLetter="B"
              title="Look, unscramble, and answer."
              subTitle={"Say the answer first, then rearrange the letters or words into the correct order."}
              isReview={true}
            />
          </div>
          {questions.map((q, i) => (
            <div key={i} className="flex gap-10 mb-4">
              <div className="flex-1">
                <div
                  className="flex w-full"
                  style={{ justifyContent: "space-between" }}
                >
                  <div className="mb-3 text-lg">
                    <span className="font-bold mr-2">{q.id}</span>
                    {q.scramble}
                  </div>
                  {renderBank(q.questionWords, `q-${i}`, "q")}
                </div>
                {renderSlot(`q-${i}`, true)}
                {renderBank(q.answerWords, `a-${i}`, "a")}
                {renderSlot(`a-${i}`, false)}
              </div>
              <img
                src={q.image}
                alt={
                  i === 0
                    ? "A clock with the long hand at six and the short hand between three and four."
                    : `Illustration for question ${q.id}; detailed visual description requires review.`
                }
                className="object-contain"
                style={{ height: "auto", width: "180px" }}
              />
            </div>
          ))}
          <div className="action-buttons-container">
            <button
              type="button"
              onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }}
              className={"try-again-button" + focusClass}
            >
              Start Again ↻
            </button>
            <button
              type="button"
              onClick={showAnswers}
              className={"show-answer-btn" + focusClass}
            >
              Show Answer
            </button>
            <button
              type="button"
              onClick={checkAnswers}
              aria-disabled={locked}
              className={"check-button2" + focusClass}
            >
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};
export default Review7_Page1_Q2;
