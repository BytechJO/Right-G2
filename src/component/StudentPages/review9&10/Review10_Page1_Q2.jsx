import React, { useState, useRef, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/ClassBook/U 10/Page 90 - B/Item_001_What_are_they_doing.mp3";
import clip1 from "../../../assets/audio/ClassBook/U 10/Page 90 - B/Item_002_What's_he_doing.mp3";
import clip2 from "../../../assets/audio/ClassBook/U 10/Page 90 - B/Item_003_What_are_you_doing.mp3";
import clip3 from "../../../assets/audio/ClassBook/U 10/Page 90 - B/Item_004_He's_playing_soccer.mp3";
import clip4 from "../../../assets/audio/ClassBook/U 10/Page 90 - B/Item_005_I'm_running.mp3";
import clip5 from "../../../assets/audio/ClassBook/U 10/Page 90 - B/Item_006_They're_flying_kites.mp3";
import clip6 from "../../../assets/audio/ClassBook/U 10/Page 90 - B/Item_007_They're_eating_apples.mp3";
const clips = {
  "What are they doing": clip0,
  "What's he doing": clip1,
  "What are you doing": clip2,
  "He's playing soccer": clip3,
  "I'm running": clip4,
  "They're flying kites": clip5,
  "They're eating apples": clip6,
};
const sensors = [useMouseSensor, useTouchSensor];
const activateKey = (e) => e.key === "Enter" || e.key === " ";
const activeStyle = {
  outline: "4px solid #2563eb",
  outlineOffset: 2,
  backgroundColor: "#dbeafe",
};

const Review10_Page1_Q2 = () => {
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

  const answersBank = [
    { id: "a1", text: "What are they doing" },
    { id: "a2", text: "What's he doing" },
    { id: "a3", text: "What are they doing" },
    { id: "a4", text: "What are you doing" },
  ];

  const questions = [
    { id: "1", sentence: "He’s playing soccer.", answer_q: "a2" },
    { id: "2", sentence: "I’m running.", answer_q: "a4" },
    { id: "3", sentence: "They’re flying kites.", answer_q: "a1" },
    { id: "4", sentence: "They’re eating apples.", answer_q: "a3" },
  ];

  const sentences = answersBank.map((a) => a.id);
  const displaySentence = (id) =>
    answersBank.find((a) => a.id === id)?.text || "";
  const sentenceSounds = Object.fromEntries(
    sentences.map((id) => [
      id,
      clips[
        displaySentence(id)
          .replaceAll("’", "'")
          .replace(/[.?!]$/, "")
      ],
    ]),
  );
  questions.forEach((q) => {
    sentenceSounds[`text-${q.id}`] =
      clips[q.sentence.replaceAll("’", "'").replace(/[.?!]$/, "")];
  });
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
  const allDone = questions.every((q) => isLocked(String(q.id)));
  const sentenceUsed = (
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
      !questions.some((q) => String(q.id) === slot) ||
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
    setAnnouncement(`${sentence} placed in question ${slot}.`);
    if (keyboard) {
      const available = sentences.find(
        (value) => !sentenceUsed(value, next, nextResults),
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
  const onDragEnd = ({ destination, draggableId, source }) => {
    if (!destination) return;
    let sentence = draggableId.startsWith("bank-")
      ? draggableId.slice(5)
      : answers[source?.droppableId?.replace("answer-", "")];
    if (!sentences.includes(sentence)) return;
    const original = Object.keys(answers).find(
      (key) => answers[key] === sentence,
    );
    if (original && isLocked(original)) return;
    if (destination.droppableId === "bank") {
      if (original) removeSentence(original);
    } else if (destination.droppableId.startsWith("answer-"))
      placeSentence(sentence, destination.droppableId.slice(7));
  };
  const pickSentence = (sentence) => {
    playSentence(sentence, `bank-${sentence}`);
    if (allDone || sentenceUsed(sentence)) {
      setAnnouncement(
        "This sentence is already used or the answers are locked.",
      );
      return;
    }
    const target =
      questions.find(
        (q) => !isLocked(String(q.id)) && !answers[String(q.id)],
      ) || questions.find((q) => !isLocked(String(q.id)));
    if (!target) return;
    setPickedSentence(sentence);
    setAnnouncement(
      `${sentence} selected. Press Enter or Space on a blank to place it.`,
    );
    focusSafely(() => blankRefs.current[String(target.id)]);
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
      Object.fromEntries(questions.map((q) => [String(q.id), q.answer_q])),
    );
    setResults(
      Object.fromEntries(questions.map((q) => [String(q.id), "correct"])),
    );
    setRevealed(true);
    setAnnouncement("All correct sentences shown and locked.");
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (revealed || allDone) return;
    clearSelection();
    stopAudio();
    if (questions.some((q) => !answers[String(q.id)])) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }
    const next = Object.fromEntries(
      questions.map((q) => [
        String(q.id),
        results[String(q.id)] === "correct" ||
        answers[String(q.id)] === q.answer_q
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
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...questions.map(
          (q) =>
            `Question ${q.id}: ${next[String(q.id)] === "correct" ? "correct and locked" : "incorrect"}.`,
        ),
        score < total
          ? "You can change incorrect sentences and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  };
  const isWrongAnswer = (id) => results[String(id)] === "wrong";
  const getTextById = displaySentence;
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

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onBeforeDragStart={clearSelection}
      enableDefaultSensors={false}
      sensors={sensors}
    >
      <div className="main-container-component">
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>
        <div className="div-forall">
          <div className="header-title-page8 ">
            <ExerciseHeader
              isReview={true}
              sectionLetter="B"
              title={"Read and write the question."}
              subTitle={"Use the picture and word clues, then type the missing word or sentence carefully."}
            />
          </div>

          <div className="flex flex-col gap-5">
            {/* ANSWERS BANK */}
            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap gap-4 justify-center mb-5 p-2 rounded-lg"
                >
                  {answersBank.map((a, index) => {
                    const isUsed = sentenceUsed(a.id);

                    return (
                      <Draggable
                        key={a.id}
                        draggableId={`bank-${a.id}`}
                        index={index}
                        isDragDisabled={allDone || isUsed}
                      >
                        {(provided) => (
                          <div
                            ref={(el) => {
                              provided.innerRef(el);
                              chipRefs.current[a.id] = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            role="button"
                            tabIndex={pickedSentence ? -1 : 0}
                            aria-pressed={pickedSentence === a.id}
                            aria-disabled={allDone || isUsed}
                            aria-label={`${displaySentence(a.id)} Press Enter or Space to choose it.`}
                            className="relative focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                            onFocus={(e) => {
                              if (
                                !suppressFocusAudio.current &&
                                e.currentTarget.matches(":focus-visible")
                              )
                                playSentence(a.id, `bank-${a.id}`);
                            }}
                            onClick={() => playSentence(a.id, `bank-${a.id}`)}
                            onKeyDown={(e) => {
                              cancelSelection(e);
                              if (activateKey(e)) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!e.repeat) pickSentence(a.id);
                              }
                            }}
                            onKeyUp={activationKeyUp}
                            style={{
                              ...provided.draggableProps.style,
                              ...(pickedSentence === a.id ||
                              playingKey === `bank-${a.id}`
                                ? activeStyle
                                : {}),
                              padding: "6px 10px",
                              border: "2px solid #0013a5",
                              borderRadius: "8px",
                              fontWeight: "bold",
                              background:
                                pickedSentence === a.id ||
                                playingKey === `bank-${a.id}`
                                  ? "#dbeafe"
                                  : isUsed
                                    ? "#e5e7eb"
                                    : "#fff",
                              color: isUsed ? "#9ca3af" : "#000",
                              cursor: allDone ? "not-allowed" : "grab",
                            }}
                          >
                            {a.text}
                            {badge(`bank-${a.id}`)}
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
            <div className="flex flex-col gap-10 items-center mb-20">
              {[0, 2].map((startIndex) => (
                <div key={startIndex} className="w-full">
                  <div className="flex justify-between px-10">
                    {questions.slice(startIndex, startIndex + 2).map((q) => (
                      <div
                        key={q.id}
                        className="flex flex-col items-start gap-5"
                      >
                        <div className="flex gap-5 items-center justify-center">
                          <span className="font-bold text-lg">{q.id}</span>

                          <Droppable
                            droppableId={`answer-${q.id}`}
                            isDropDisabled={isLocked(String(q.id))}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={(el) => {
                                  provided.innerRef(el);
                                  blankRefs.current[String(q.id)] = el;
                                }}
                                {...provided.droppableProps}
                                role="button"
                                tabIndex={
                                  pickedSentence && isLocked(String(q.id))
                                    ? -1
                                    : 0
                                }
                                aria-disabled={isLocked(String(q.id))}
                                aria-label={`Question ${q.id}, blank: ${displaySentence(answers[q.id]) || "empty"}${results[q.id] ? ", " + results[q.id] : ""}`}
                                className="rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                                onClick={() => activateSlot(String(q.id))}
                                onKeyDown={(e) => slotKeyDown(e, String(q.id))}
                                onKeyUp={activationKeyUp}
                                style={{
                                  width: "300px",
                                  minHeight: "35px",
                                  marginTop: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  position: "relative",

                                  // 🔥 الايفيكت
                                  borderBottom: isLocked(String(q.id))
                                    ? "2px solid #16a34a"
                                    : isWrongAnswer(q.id)
                                      ? "2px solid #ef4444"
                                      : "2px solid black",
                                  ...(snapshot.isDraggingOver &&
                                  !isLocked(String(q.id))
                                    ? {
                                        outline: "2px dashed #2563eb",
                                        outlineOffset: 2,
                                        backgroundColor: "#dbeafe",
                                      }
                                    : {}),
                                  borderRadius: 8,
                                  transition: "all 0.2s ease",
                                  paddingLeft: "10px",

                                  // optional تكبير بسيط
                                  transform:
                                    snapshot.isDraggingOver &&
                                    !isLocked(String(q.id))
                                      ? "scale(1.02)"
                                      : "scale(1)",
                                }}
                                isDragDisabled={true}
                              >
                                {answers[q.id] && (
                                  <Draggable
                                    draggableId={`answer-${q.id}-${answers[q.id]}`}
                                    index={0}
                                    isDragDisabled={true}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={provided.draggableProps.style}
                                        tabIndex={-1}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          activateSlot(String(q.id));
                                        }}
                                      >
                                        <span className="font-semibold">
                                          {getTextById(answers[q.id])}
                                        </span>
                                      </div>
                                    )}
                                  </Draggable>
                                )}

                                {badge(`answer-${q.id}`)}
                                {/* ❌ WRONG */}
                                {isWrongAnswer(q.id) && (
                                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">
                                    ✕
                                  </div>
                                )}

                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                        <span
                          role="button"
                          tabIndex={pickedSentence ? -1 : 0}
                          aria-label={`Hear ${q.sentence}`}
                          className="relative rounded-md text-gray-400 text-lg focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                          onClick={() =>
                            playSentence(`text-${q.id}`, `text-${q.id}`)
                          }
                          onKeyDown={(e) => {
                            cancelSelection(e);
                            if (activateKey(e)) {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!e.repeat)
                                playSentence(`text-${q.id}`, `text-${q.id}`);
                            }
                          }}
                          onKeyUp={activationKeyUp}
                          style={
                            playingKey === `text-${q.id}`
                              ? activeStyle
                              : undefined
                          }
                        >
                          {q.sentence}
                          {badge(`text-${q.id}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* BUTTONS */}
          <div className="action-buttons-container mt-10">
            <button onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className="try-again-button">
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
      </div>
    </DragDropContext>
  );
};

export default Review10_Page1_Q2;
