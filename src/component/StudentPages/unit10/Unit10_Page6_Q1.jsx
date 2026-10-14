import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";

import img1 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex D 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex D 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex D 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex D 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex D 5.svg";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import s0 from "../../../assets/audio/ClassBook/U 10/Page 87 - D/Item_001_He's_sleeping.mp3";
import s1 from "../../../assets/audio/ClassBook/U 10/Page 87 - D/Item_002_They're_swinging.mp3";
import s2 from "../../../assets/audio/ClassBook/U 10/Page 87 - D/Item_003_She's_watching_TV.mp3";
import s3 from "../../../assets/audio/ClassBook/U 10/Page 87 - D/Item_004_He's_listening_to_the_radio.mp3";
import s4 from "../../../assets/audio/ClassBook/U 10/Page 87 - D/Item_005_He's_driving.mp3";
const questions = [
  {
    id: 1,
    img: img1,
    alt: "A man sitting beside a radio.",
    correct: "He's listening to the radio.",
  },
  {
    id: 2,
    img: img2,
    alt: "Two children on swings.",
    correct: "They're swinging.",
  },
  {
    id: 3,
    img: img3,
    alt: "A boy lying in bed under a blue blanket.",
    correct: "He's sleeping.",
  },
  {
    id: 4,
    img: img4,
    alt: "A man driving a car.",
    correct: "He's driving.",
  },
  {
    id: 5,
    img: img5,
    alt: "A girl watching television.",
    correct: "She's watching TV.",
  },
];

const sentences = [
  "He's sleeping.",
  "They're swinging.",
  "She's watching TV.",
  "He's listening to the radio.",
  "He's driving.",
];

const sentenceSounds = {
  "He's sleeping.": s0,
  "They're swinging.": s1,
  "She's watching TV.": s2,
  "He's listening to the radio.": s3,
  "He's driving.": s4,
};
const sensors = [useMouseSensor, useTouchSensor];
const activateKey = (e) => e.key === "Enter" || e.key === " ";
const activeStyle = {
  outline: "4px solid #2563eb",
  outlineOffset: 2,
  backgroundColor: "#dbeafe",
};

const Unit10_Page6_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [pickedSentence, setPickedSentence] = useState(null);
  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const audioRef = useRef(null),
    chipRefs = useRef({}),
    blankRefs = useRef({});
  const focusFrame = useRef(null),
    suppressFocusAudio = useRef(false);
  const isLocked = (slot) => revealed || results[slot] === "correct";
  const allDone = questions.every((q) => isLocked(`slot-${q.id}`));
  const isSentenceUsed = (
    sentence,
    currentAnswers = answers,
    currentResults = results,
  ) =>
    Object.entries(currentAnswers).some(
      ([slot, value]) => value === sentence && currentResults[slot] !== "wrong",
    );
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focusSafely = (getElement) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      suppressFocusAudio.current = true;
      try {
        getElement()?.focus();
      } finally {
        suppressFocusAudio.current = false;
      }
    });
  };
  const clearSelection = () => {
    cancelFocus();
    setPickedSentence(null);
  };
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
  const playSentence = (sentence, key) => {
    if (!sentenceSounds[sentence]) return;
    stopAudio();
    const audio = new Audio(sentenceSounds[sentence]);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      setPlayingKey(null);
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      audio.pause();
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    try {
      audio.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(() => {
    const otherPlay = (event) => {
      const audio = audioRef.current;
      if (!audio || event.target === audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      setPlayingKey(null);
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);

  const placeSentence = (sentence, slot, keyboard = false) => {
    if (
      !sentences.includes(sentence) ||
      !questions.some((q) => `slot-${q.id}` === slot) ||
      isLocked(slot)
    )
      return;
    if (
      Object.entries(answers).some(
        ([source, value]) => value === sentence && isLocked(source),
      )
    )
      return;
    const next = { ...answers },
      nextResults = { ...results };
    Object.keys(next).forEach((source) => {
      if (next[source] === sentence) {
        delete next[source];
        nextResults[source] = null;
      }
    });
    next[slot] = sentence;
    nextResults[slot] = null;
    setAnswers(next);
    setResults(nextResults);
    clearSelection();
    setAnnouncement(`${sentence} placed in question ${slot.slice(5)}.`);
    if (keyboard) {
      const available = sentences.find(
        (value) => !isSentenceUsed(value, next, nextResults),
      );
      focusSafely(() =>
        available ? chipRefs.current[available] : blankRefs.current[slot],
      );
    }
  };
  const removeSentence = (slot, keyboard = false) => {
    if (isLocked(slot) || !answers[slot]) return;
    const sentence = answers[slot];
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
    setResults((prev) => ({ ...prev, [slot]: null }));
    clearSelection();
    setAnnouncement(`${sentence} returned to the sentence bank.`);
    if (keyboard) focusSafely(() => chipRefs.current[sentence]);
  };
  const onDragEnd = ({ destination, draggableId }) => {
    if (!destination) return;
    let sentence;
    if (draggableId.startsWith("bank-")) sentence = draggableId.slice(5);
    else {
      const match = /^slot-(\d+)-(.+)$/.exec(draggableId);
      if (
        !match ||
        answers[`slot-${match[1]}`] !== match[2] ||
        isLocked(`slot-${match[1]}`)
      )
        return;
      sentence = match[2];
    }
    if (destination.droppableId === "bank") {
      const slot = Object.keys(answers).find(
        (key) => answers[key] === sentence,
      );
      if (slot) removeSentence(slot);
    } else placeSentence(sentence, destination.droppableId);
  };
  const pickSentence = (sentence) => {
    playSentence(sentence, `bank-${sentence}`);
    if (allDone || isSentenceUsed(sentence)) {
      setAnnouncement(
        "This sentence is already used or the answers are locked.",
      );
      return;
    }
    const target =
      questions.find(
        (q) => !isLocked(`slot-${q.id}`) && !answers[`slot-${q.id}`],
      ) || questions.find((q) => !isLocked(`slot-${q.id}`));
    if (!target) return;
    setPickedSentence(sentence);
    setAnnouncement(
      `${sentence} selected. Press Enter or Space on a blank to place it.`,
    );
    focusSafely(() => blankRefs.current[`slot-${target.id}`]);
  };
  const cancelSelection = (e) => {
    if (e.key !== "Escape" || !pickedSentence) return;
    e.preventDefault();
    e.stopPropagation();
    const sentence = pickedSentence;
    clearSelection();
    setAnnouncement("Selection cancelled.");
    focusSafely(() => chipRefs.current[sentence]);
  };
  const activateSlot = (slot, keyboard = false) => {
    if (isLocked(slot)) {
      playSentence(answers[slot], `answer-${slot}`);
      return;
    }
    if (keyboard && pickedSentence) placeSentence(pickedSentence, slot, true);
    else if (answers[slot]) removeSentence(slot, keyboard);
    else
      setAnnouncement(
        "Choose a sentence first, then press Enter or Space on a blank.",
      );
  };
  const slotKeyDown = (e, slot) => {
    cancelSelection(e);
    if (activateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) activateSlot(slot, true);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat && results[slot] === "wrong") removeSentence(slot, true);
    }
  };
  const activationKeyUp = (e) => {
    if (activateKey(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const reset = () => {
    clearSelection();
    stopAudio();
    setAnswers({});
    setResults({});
    setRevealed(false);
    setAnnouncement("Activity reset. All answers and results cleared.");
  };
  const showAnswers = () => {
    clearSelection();
    stopAudio();
    setAnswers(
      Object.fromEntries(questions.map((q) => [`slot-${q.id}`, q.correct])),
    );
    setResults(
      Object.fromEntries(questions.map((q) => [`slot-${q.id}`, "correct"])),
    );
    setRevealed(true);
    setAnnouncement("All correct sentences shown and locked.");
  };
  const checkAnswers = () => {
    if (revealed || allDone) return;
    clearSelection();
    stopAudio();
    if (questions.some((q) => !answers[`slot-${q.id}`])) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }
    const next = Object.fromEntries(
      questions.map((q) => [
        `slot-${q.id}`,
        results[`slot-${q.id}`] === "correct" ||
        answers[`slot-${q.id}`] === q.correct
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter(
        (result) => result === "correct",
      ).length,
      total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;margin-top:10px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${total}</span></div>`;
    if (score === total) ValidationAlert.success(msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...questions.map(
          (q) =>
            `Question ${q.id}: ${next[`slot-${q.id}`] === "correct" ? "correct and locked" : "incorrect"}.`,
        ),
        score < total
          ? "You can change incorrect sentences and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  };
  const badge = (key) =>
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
          background: "white",
          color: "black",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );

  //...
  const isWrongAnswer = (id) => results[`slot-${id}`] === "wrong";
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onBeforeDragStart={clearSelection}
      enableDefaultSensors={false}
      sensors={sensors}
    >
      <div className="main-container-component mb-10">
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>
        <div className="div-forall" style={{ gap: "30px" }}>
          {/* ❌ الهيدر كما هو */}
          <ExerciseHeader
            sectionLetter="D"
            title="Look and write."
            subTitle={
              "Use the picture and word clues, then type the missing word or sentence carefully."
            }
          />
          <div className="flex flex-col gap-10">
            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex gap-5 w-full flex-wrap justify-center rounded-lg"
                >
                  {sentences.map((s, index) => {
                    const isUsed = isSentenceUsed(s);
                    return (
                      <Draggable
                        key={`bank-${s}`}
                        draggableId={`bank-${s}`}
                        index={index}
                        isDragDisabled={allDone || isUsed}
                      >
                        {(provided) => (
                          <div
                            ref={(el) => {
                              provided.innerRef(el);
                              chipRefs.current[s] = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps} // 🔥 دايمًا موجودة
                            role="button"
                            tabIndex={0}
                            aria-pressed={pickedSentence === s}
                            aria-disabled={allDone || isUsed}
                            aria-label={`${s} Press Enter or Space to choose it.`}
                            onClick={() => playSentence(s, `bank-${s}`)}
                            onKeyDown={(e) => {
                              cancelSelection(e);
                              if (activateKey(e)) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!e.repeat) pickSentence(s);
                              }
                            }}
                            onKeyUp={activationKeyUp}
                            onFocus={(e) => {
                              if (
                                !suppressFocusAudio.current &&
                                e.currentTarget.matches(":focus-visible")
                              )
                                playSentence(s, `bank-${s}`);
                            }}
                            style={{
                              ...provided.draggableProps.style,
                              ...(pickedSentence === s ||
                              playingKey === `bank-${s}`
                                ? activeStyle
                                : {}),
                            }}
                            className={`relative focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4! px-4 py-2 rounded-full text-center
        ${isUsed ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-200 cursor-grab"}`}
                          >
                            {s}
                            {badge(`bank-${s}`)}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div>
              {questions.map((q) => (
                <div
                  key={q.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "18px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      width: "25px",
                    }}
                  >
                    {q.id}
                  </span>
                  <div className="flex justify-center w-full">
                    <img
                      src={q.img}
                      alt={q.alt}
                      style={{
                        height: "auto",
                        width: "35%",

                        borderRadius: "12px",
                        marginRight: "20px",
                      }}
                    />

                    <Droppable
                      droppableId={`slot-${q.id}`}
                      isDropDisabled={isLocked(`slot-${q.id}`)}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={(el) => {
                            provided.innerRef(el);
                            blankRefs.current[`slot-${q.id}`] = el;
                          }}
                          {...provided.droppableProps}
                          role="button"
                          tabIndex={0}
                          aria-disabled={isLocked(`slot-${q.id}`)}
                          aria-label={`Question ${q.id}, blank: ${answers[`slot-${q.id}`] || "empty"}${results[`slot-${q.id}`] ? ", " + results[`slot-${q.id}`] : ""}`}
                          onClick={() => activateSlot(`slot-${q.id}`)}
                          onKeyDown={(e) => slotKeyDown(e, `slot-${q.id}`)}
                          onKeyUp={activationKeyUp}
                          className="relative rounded-md transition-all duration-200 focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                          style={{
                            // flex: 1,
                            minHeight: "30px",
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "10px",
                            width: "100%",

                            // 🔥 الإيفيكت
                            borderRadius: 8,
                            borderBottom: isLocked(`slot-${q.id}`)
                              ? "2px solid #16a34a"
                              : isWrongAnswer(q.id)
                                ? "2px solid #ef4444"
                                : "1px solid #333",
                            ...(snapshot.isDraggingOver &&
                            !isLocked(`slot-${q.id}`)
                              ? {
                                  outline: "2px dashed #2563eb",
                                  outlineOffset: 2,
                                  backgroundColor: "#dbeafe",
                                }
                              : playingKey === `answer-slot-${q.id}`
                                ? activeStyle
                                : {}),
                          }}
                        >
                          {answers[`slot-${q.id}`] && (
                            <Draggable
                              draggableId={`slot-${q.id}-${answers[`slot-${q.id}`]}`}
                              index={0}
                              isDragDisabled={isLocked(`slot-${q.id}`)}
                            >
                              {(provided) => (
                                <div // ✅ بدل span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  tabIndex={-1}
                                  style={provided.draggableProps.style}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    activateSlot(`slot-${q.id}`);
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: "500",
                                      fontSize: "16px",
                                      cursor: "grab",
                                    }}
                                  >
                                    {answers[`slot-${q.id}`]}
                                  </span>
                                </div>
                              )}
                            </Draggable>
                          )}
                          {badge(`answer-slot-${q.id}`)}
                          {isWrongAnswer(q.id) && (
                            <div
                              className="
      absolute -top-2 -right-2
      w-7 h-7
      bg-red-500 text-white
      rounded-full
      flex items-center justify-center
      text-sm font-bold
      border-2 border-white
      z-10
    "
                            >
                              ✕
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit10_Page6_Q1;
