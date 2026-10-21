import "./Unit9_Page5_Q2.css";
import sound1 from "../../../assets/audio/ClassBook/U 9/cd56pg80-instruction2-adult-lady_nSSY2Pgz.mp3";
import img1 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Asset 48.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Asset 57.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Asset 50.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Asset 51.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Asset 52.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 9 Visiting Our Grandparents/Page 80/Asset 53.svg";
import React, { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import painSound from "../../../assets/audio/ClassBook/U 9/Page 80 - A2/Item_001_pain.mp3";
import shakeSound from "../../../assets/audio/ClassBook/U 9/Page 80 - A2/Item_002_shake.mp3";
import daySound from "../../../assets/audio/ClassBook/U 9/Page 80 - A2/Item_003_day.mp3";

const questions = [
  {
    id: 1,
    images: [img1, img2],
    correctImage: 0,
    correctWord: "pain",
    alts: [
      "A child holding their elbow with an open mouth and a concerned expression.",
      "A grey flying animal with pointed ears and spread wings.",
    ],
  },
  {
    id: 2,
    images: [img3, img4],
    correctImage: 1,
    correctWord: "shake",
    alts: [
      "A brown animal with whiskers, rounded ears, and a long thin tail.",
      "Two people clasping hands.",
    ],
  },
  {
    id: 3,
    images: [img5, img6],
    correctImage: 1,
    correctWord: "day",
    alts: [
      "A pink wide-brimmed head covering with a blue ribbon and yellow flower.",
      "A desk calendar headed Sun.",
    ],
  },
];

const wordBank = ["pain", "day", "shake"];
const availableWords = wordBank;
const wordSounds = { pain: painSound, shake: shakeSound, day: daySound };
const captions = [
  {
    start: 0.479,
    end: 9.899,
    text: "Page 80, Right Activities. Exercise A, number 2. Which picture has a long A? Listen, circle, and write.",
  },
  {
    start: 10.979,
    end: 21.659,
    text: "1, pain, bat. 2, rat, shake. 3, hat, day",
  },
];
const stopAtSecond = 9.899;
const sensors = [useMouseSensor, useTouchSensor];
const focusClass =
  " rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const activateKey = (e) => e.key === "Enter" || e.key === " ";
const activeStyle = {
  outline: "4px solid #2563eb",
  outlineOffset: 2,
  backgroundColor: "#dbeafe",
};
const exerciseTitle = "Which picture has a long a? Listen, circle, and write.";

const Unit9_Page5_Q2 = () => {
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

  const [selected, setSelected] = useState({});
  const [droppedWords, setDroppedWords] = useState({});
  const [imageResults, setImageResults] = useState({});
  const [wordResults, setWordResults] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [pickedWord, setPickedWord] = useState(null);
  const [playingKey, setPlayingKey] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const [forceStopAudio, setForceStopAudio] = useState(false);
  const exerciseRef = useRef(null),
    audioRef = useRef(null);
  const chipRefs = useRef({}),
    blankRefs = useRef({}),
    focusFrame = useRef(null);
  const imageLocked = (id) => revealed || imageResults[id] === "correct";
  const wordLocked = (slot) => revealed || wordResults[slot] === "correct";
  const allWordsLocked = questions.every((q) => wordLocked(`slot-${q.id}`));
  const allDone = allWordsLocked && questions.every((q) => imageLocked(q.id));
  const isUsed = (word, answers = droppedWords, results = wordResults) =>
    Object.entries(answers).some(
      ([slot, value]) => value === word && results[slot] !== "wrong",
    );
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focusSafely = (getElement) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      getElement()?.focus();
    });
  };
  const clearSelection = () => {
    cancelFocus();
    setPickedWord(null);
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
  const stopInstruction = () => {
    const audio = exerciseRef.current?.querySelector("audio");
    if (audio) {
      audio.pause();
      
    }
    setForceStopAudio(true);
  };
  const playWord = (word, key) => {
    if (!wordSounds[word]) return;
    stopAudio();
    stopInstruction();
    const audio = new Audio(wordSounds[word]);
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

  const handleSelect = (q, index) => {
    if (imageLocked(q.id)) {
      setAnnouncement(
        `Question ${q.id}: the picture answer is correct and locked.`,
      );
      return;
    }
    setSelected((prev) => ({ ...prev, [q.id]: index }));
    setImageResults((prev) => ({ ...prev, [q.id]: null }));
    setAnnouncement(`Question ${q.id}, picture ${index + 1} selected.`);
  };
  const removeWordFromSlot = (slot, keyboard = false) => {
    if (wordLocked(slot) || !droppedWords[slot]) return;
    const word = droppedWords[slot];
    setDroppedWords((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
    setWordResults((prev) => ({ ...prev, [slot]: null }));
    clearSelection();
    setAnnouncement(`${word} returned to the word bank.`);
    if (keyboard) focusSafely(() => chipRefs.current[word]);
  };
  const placeWord = (word, slot, keyboard = false) => {
    if (
      !wordBank.includes(word) ||
      !questions.some((q) => `slot-${q.id}` === slot) ||
      wordLocked(slot)
    )
      return;
    if (
      Object.entries(droppedWords).some(
        ([source, value]) => value === word && wordLocked(source),
      )
    )
      return;
    const next = { ...droppedWords },
      affected = [slot];
    Object.keys(next).forEach((source) => {
      if (next[source] === word) {
        delete next[source];
        affected.push(source);
      }
    });
    next[slot] = word;
    setDroppedWords(next);
    const nextResults = { ...wordResults };
    affected.forEach((source) => {
      nextResults[source] = null;
    });
    setWordResults(nextResults);
    clearSelection();
    setAnnouncement(`${word} placed in question ${slot.slice(5)}.`);
    if (keyboard) {
      const nextWord = wordBank.find(
        (value) => !isUsed(value, next, nextResults),
      );
      focusSafely(() =>
        nextWord ? chipRefs.current[nextWord] : blankRefs.current[slot],
      );
    }
  };
  const onDragEnd = ({ destination, draggableId }) => {
    if (!destination) return;
    let word;
    if (draggableId.startsWith("bank-")) word = draggableId.slice(5);
    else {
      const match = /^slot-(\d+)-(pain|shake|day)$/.exec(draggableId);
      if (
        !match ||
        droppedWords[`slot-${match[1]}`] !== match[2] ||
        wordLocked(`slot-${match[1]}`)
      )
        return;
      word = match[2];
    }
    if (destination.droppableId === "word-bank") {
      const source = Object.keys(droppedWords).find(
        (slot) => droppedWords[slot] === word,
      );
      if (source) removeWordFromSlot(source);
    } else placeWord(word, destination.droppableId);
  };
  const pickWord = (word) => {
    playWord(word, `bank-${word}`);
    if (allWordsLocked || isUsed(word)) {
      setAnnouncement(`${word} is unavailable for placement.`);
      return;
    }
    const target =
      questions.find(
        (q) => !wordLocked(`slot-${q.id}`) && !droppedWords[`slot-${q.id}`],
      ) || questions.find((q) => !wordLocked(`slot-${q.id}`));
    if (!target) return;
    setPickedWord(word);
    setAnnouncement(
      `${word} selected. Press Enter or Space on a blank to place it.`,
    );
    focusSafely(() => blankRefs.current[`slot-${target.id}`]);
  };
  const cancelSelection = (e) => {
    if (e.key !== "Escape" || !pickedWord) return;
    e.preventDefault();
    e.stopPropagation();
    const word = pickedWord;
    clearSelection();
    setAnnouncement("Selection cancelled.");
    focusSafely(() => chipRefs.current[word]);
  };
  const activateSlot = (slot, keyboard = false) => {
    if (wordLocked(slot)) {
      playWord(droppedWords[slot], `answer-${slot}`);
      return;
    }
    if (keyboard && pickedWord) placeWord(pickedWord, slot, true);
    else if (droppedWords[slot]) removeWordFromSlot(slot, keyboard);
    else
      setAnnouncement(
        "Choose a word first, then press Enter or Space on a blank.",
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
      if (!e.repeat && wordResults[slot] === "wrong")
        removeWordFromSlot(slot, true);
    }
  };
  const activationProps = (action) => ({
    onKeyDown: (e) => {
      cancelSelection(e);
      if (activateKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) action();
      }
    },
    onKeyUp: (e) => {
      if (activateKey(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
  });
  const stopForAction = () => {
    clearSelection();
    stopAudio();
    stopInstruction();
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (revealed || allDone) return;
    stopForAction();
    if (
      questions.some(
        (q) => selected[q.id] === undefined || !droppedWords[`slot-${q.id}`],
      )
    ) {
      ValidationAlert.info("Please answer all questions.");
      setAnnouncement("Please answer all questions.");
      return;
    }
    const nextImages = {},
      nextWords = {};
    questions.forEach((q) => {
      nextImages[q.id] =
        imageResults[q.id] === "correct" || selected[q.id] === q.correctImage
          ? "correct"
          : "wrong";
      const slot = `slot-${q.id}`;
      nextWords[slot] =
        wordResults[slot] === "correct" || droppedWords[slot] === q.correctWord
          ? "correct"
          : "wrong";
    });
    setImageResults(nextImages);
    setWordResults(nextWords);
    const score = [
      ...Object.values(nextImages),
      ...Object.values(nextWords),
    ].filter((result) => result === "correct").length;
    const total = questions.length * 2,
      color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;margin-top:10px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...questions.map(
          (q) =>
            `Question ${q.id}: picture ${nextImages[q.id]}, word ${nextWords[`slot-${q.id}`]}.`,
        ),
        score < total
          ? "Correct answers are locked. You can change incorrect answers and check again."
          : "All answers are correct and locked.",
      ].join(" "),
    );
  };
  const showAnswers = () => {
    stopForAction();
    setSelected(
      Object.fromEntries(questions.map((q) => [q.id, q.correctImage])),
    );
    setDroppedWords(
      Object.fromEntries(questions.map((q) => [`slot-${q.id}`, q.correctWord])),
    );
    setImageResults(
      Object.fromEntries(questions.map((q) => [q.id, "correct"])),
    );
    setWordResults(
      Object.fromEntries(questions.map((q) => [`slot-${q.id}`, "correct"])),
    );
    setRevealed(true);
    setAnnouncement("All correct pictures and words shown and locked.");
  };
  const resetAll = () => {
    stopForAction();
    stopInstruction();
    
    setSelected({});
    setDroppedWords({});
    setImageResults({});
    setWordResults({});
    setRevealed(false);
    setAnnouncement("Activity reset. All answers and results cleared.");
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
          zIndex: 6,
          background: "white",
          color: "black",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onBeforeDragStart={clearSelection}
      enableDefaultSensors={false}
      sensors={sensors}
    >
      <div className="main-container-component" ref={exerciseRef}>
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>
        <div className="div-forall" style={{ gap: "30px" }}>
          <ExerciseHeader
            questionNumber="2"
            title={exerciseTitle}
            subTitle={
              "Replay the audio, say the word quietly, then tap the sound or letter that matches."
            }
          />
          <QuestionAudioPlayer
            pageId="sb_unit9_page5_q2"
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
            forceStop={forceStopAudio}
            onInteract={() => {
              stopAudio();
              setForceStopAudio(false);
            }}
          />

          <div className="flex flex-col gap-5">
            {/* WORD BANK */}
            <Droppable droppableId="word-bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="rounded-lg p-3"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "60px",
                    flexWrap: "wrap",
                    minHeight: "52px",
                  }}
                >
                  {availableWords.map((word, index) => {
                    const used = isUsed(word);
                    return (
                      <Draggable
                        key={word}
                        draggableId={`bank-${word}`}
                        index={index}
                        isDragDisabled={allWordsLocked || used}
                      >
                        {(provided) => (
                          <div
                            ref={(el) => {
                              provided.innerRef(el);
                              chipRefs.current[word] = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            role="button"
                            tabIndex={0}
                            aria-pressed={pickedWord === word}
                            aria-disabled={allWordsLocked || used}
                            data-bank-word={word}
                            aria-label={`${word}. Press Enter or Space to choose it.${used ? " Already used." : ""}`}
                            className={focusClass}
                            onClick={() => playWord(word, `bank-${word}`)}
                            {...activationProps(() => pickWord(word))}
                            style={{
                              position: "relative",
                              padding: "8px 18px",
                              borderRadius: "12px",
                              fontWeight: "bold",
                              fontSize: "20px",
                              userSelect: "none",
                              border: "2px solid #000589ff",
                              background: used ? "#e5e7eb" : "white",
                              color: used ? "#9ca3af" : "",
                              cursor:
                                used || allWordsLocked ? "not-allowed" : "grab",

                              ...provided.draggableProps.style,
                              ...(pickedWord === word ||
                              playingKey === `bank-${word}`
                                ? activeStyle
                                : {}),
                            }}
                          >
                            {word}
                            {badge(`bank-${word}`)}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* QUESTIONS */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex justify-center mb-20 gap-5">
                {questions.map((q) => {
                  const slotId = `slot-${q.id}`;
                  const droppedWord = droppedWords[slotId];

                  return (
                    <div key={q.id} className="flex flex-col items-center">
                      <div className="flex gap-2 items-center">
                        {q.images.map((img, index) => (
                          <div
                            key={index}
                            role="button"
                            tabIndex={0}
                            aria-pressed={selected[q.id] === index}
                            aria-disabled={imageLocked(q.id)}
                            data-picture={`${q.id}-${index}`}
                            aria-label={`Question ${q.id}, picture ${index + 1}: ${q.alts[index]}${selected[q.id] === index && imageResults[q.id] ? (imageResults[q.id] === "correct" ? " Correct and locked." : " Incorrect, you can change it.") : ""}`}
                            className={focusClass}
                            onClick={() => handleSelect(q, index)}
                            {...activationProps(() => handleSelect(q, index))}
                            style={{
                              position: "relative",
                              width: "10vw",
                              height: "10vw",
                              cursor: imageLocked(q.id) ? "default" : "pointer",
                            }}
                          >
                            <img
                              src={img}
                              alt={q.alts[index]}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />

                            {selected[q.id] === index && (
                              <div
                                aria-hidden="true"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  border:
                                    imageResults[q.id] === "correct"
                                      ? "4px solid #16a34a"
                                      : "4px solid red",
                                  borderRadius: "50%",
                                  pointerEvents: "none",
                                }}
                              />
                            )}

                            {selected[q.id] === index &&
                              imageResults[q.id] === "wrong" && (
                                <div
                                  aria-hidden="true"
                                  style={{
                                    position: "absolute",
                                    top: "6px",
                                    right: "9px",
                                    width: "30px",
                                    height: "30px",
                                    background: "red",
                                    color: "white",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    border: "2px solid white",
                                    zIndex: 5,
                                    lineHeight: 1,
                                  }}
                                >
                                  ✕
                                </div>
                              )}
                          </div>
                        ))}
                      </div>

                      <Droppable
                        droppableId={slotId}
                        isDropDisabled={wordLocked(slotId)}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={(el) => {
                              provided.innerRef(el);
                              blankRefs.current[slotId] = el;
                            }}
                            {...provided.droppableProps}
                            role="button"
                            tabIndex={0}
                            aria-disabled={wordLocked(slotId)}
                            data-slot={slotId}
                            aria-label={`Question ${q.id}, blank: ${droppedWord || "empty"}${wordResults[slotId] ? (wordResults[slotId] === "correct" ? ", correct and locked" : ", incorrect") : ""}`}
                            className={focusClass}
                            onClick={() => activateSlot(slotId)}
                            onKeyDown={(e) => slotKeyDown(e, slotId)}
                            onKeyUp={(e) => {
                              if (activateKey(e)) {
                                e.preventDefault();
                                e.stopPropagation();
                              }
                            }}
                            style={{
                              marginTop: "12px",
                              minHeight: "38px",
                              width: "200px",
                              borderBottom: wordLocked(slotId)
                                ? "2px solid #16a34a"
                                : "2px solid #222",
                              ...(snapshot.isDraggingOver && !wordLocked(slotId)
                                ? {
                                    outline: "2px dashed #2563eb",
                                    outlineOffset: 2,
                                    backgroundColor: "#dbeafe",
                                  }
                                : playingKey === `answer-${slotId}`
                                  ? activeStyle
                                  : {}),
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "relative", // 🔥 مهم
                            }}
                          >
                            {droppedWord && (
                              <Draggable
                                draggableId={`slot-${q.id}-${droppedWord}`}
                                index={0}
                                isDragDisabled={wordLocked(slotId)}
                              >
                                {(provided) => (
                                  <span
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    tabIndex={-1}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      activateSlot(slotId);
                                    }}
                                    onKeyDown={(e) => slotKeyDown(e, slotId)}
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "bold",
                                      // color: "blue",
                                      cursor: wordLocked(slotId)
                                        ? "default"
                                        : "pointer",
                                      userSelect: "none",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {droppedWord}
                                  </span>
                                )}
                              </Draggable>
                            )}
                            {provided.placeholder}
                            {badge(`answer-${slotId}`)}
                            {/* ❌ WRONG WORD */}
                            {wordResults[slotId] === "wrong" && (
                              <div
                                aria-hidden="true"
                                style={{
                                  position: "absolute",
                                  top: "-8px",
                                  right: "-8px",
                                  width: "22px",
                                  height: "22px",
                                  background: "red",
                                  color: "white",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  border: "2px solid white",
                                }}
                              >
                                ✕
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={(checkEvent) => { resetCompletedCheck(); (resetAll)(checkEvent); }}>
            Start Again ↻
          </button>
          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>
          <button className="check-button2" onClick={checkAnswers}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit9_Page5_Q2;
