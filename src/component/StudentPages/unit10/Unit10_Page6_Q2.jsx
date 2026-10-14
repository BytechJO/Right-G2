import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";

import imgA from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 1.svg";
import imgB from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 2.svg";
import imgC from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 3.svg";
import imgD from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 4.svg";
import imgE from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 5.svg";
import imgF from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page 87/Ex E 6.svg";
import Button from "../../WorkBookPages/Button";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import s0 from "../../../assets/audio/ClassBook/U 10/Page 87 - E/Item_001_It's_drinking_milk.mp3";
import s1 from "../../../assets/audio/ClassBook/U 10/Page 87 - E/Item_002_She's_setting_the_table.mp3";
import s2 from "../../../assets/audio/ClassBook/U 10/Page 87 - E/Item_003_He's_throwing_a_ball.mp3";
import s3 from "../../../assets/audio/ClassBook/U 10/Page 87 - E/Item_004_She's_helping_Mom.mp3";
import s4 from "../../../assets/audio/ClassBook/U 10/Page 87 - E/Item_005_He's_getting_dressed.mp3";
import s5 from "../../../assets/audio/ClassBook/U 10/Page 87 - E/Item_006_He's_reading_a_newspaper.mp3";
const questionTexts = [
  "It’s drinking milk.",
  "She’s setting the table.",
  "He’s throwing a ball.",
  "She’s helping Mom.",
  "He’s getting dressed.",
  "He’s reading a newspaper.",
];

const sentences = ["a", "b", "c", "d", "e", "f"];

const correct = {
  "q-0": "c",
  "q-1": "a",
  "q-2": "d",
  "q-3": "e",
  "q-4": "b",
  "q-5": "f",
};

const options = sentences;
const questions = questionTexts.map((text, id) => ({
  id,
  text,
  correct: correct[`q-${id}`],
}));
const sentenceSounds = Object.fromEntries(
  questionTexts.map((text, i) => [text, [s0, s1, s2, s3, s4, s5][i]]),
);
const sensors = [useMouseSensor, useTouchSensor];
const activateKey = (e) => e.key === "Enter" || e.key === " ";
const activeStyle = {
  outline: "4px solid #2563eb",
  outlineOffset: 2,
  backgroundColor: "#dbeafe",
};

const Unit10_Page6_Q2 = () => {
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
  const allDone = questions.every((q) => isLocked(`q-${q.id}`));
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
      !questions.some((q) => `q-${q.id}` === slot) ||
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
    setAnnouncement(
      `${sentence} placed in question ${Number(slot.slice(2)) + 1}.`,
    );
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
      const match = /^q-(\d+)-(.+)$/.exec(draggableId);
      if (
        !match ||
        answers[`q-${match[1]}`] !== match[2] ||
        isLocked(`q-${match[1]}`)
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
      questions.find((q) => !isLocked(`q-${q.id}`) && !answers[`q-${q.id}`]) ||
      questions.find((q) => !isLocked(`q-${q.id}`));
    if (!target) return;
    setPickedSentence(sentence);
    setAnnouncement(
      `${sentence} selected. Press Enter or Space on a blank to place it.`,
    );
    focusSafely(() => blankRefs.current[`q-${target.id}`]);
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
      playSentence(
        questions.find((q) => `q-${q.id}` === slot)?.text,
        `text-${slot}`,
      );
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
      Object.fromEntries(questions.map((q) => [`q-${q.id}`, q.correct])),
    );
    setResults(
      Object.fromEntries(questions.map((q) => [`q-${q.id}`, "correct"])),
    );
    setRevealed(true);
    setAnnouncement("All correct sentences shown and locked.");
  };
  const checkAnswers = () => {
    if (revealed || allDone) return;
    clearSelection();
    stopAudio();
    if (questions.some((q) => !answers[`q-${q.id}`])) {
      ValidationAlert.info("Please complete all answers.");
      setAnnouncement("Please complete all answers.");
      return;
    }
    const next = Object.fromEntries(
      questions.map((q) => [
        `q-${q.id}`,
        results[`q-${q.id}`] === "correct" || answers[`q-${q.id}`] === q.correct
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
            `Question ${q.id}: ${next[`q-${q.id}`] === "correct" ? "correct and locked" : "incorrect"}.`,
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
//..

//...
  const isWrongAnswer = (slot) => results[slot] === "wrong";
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
        <div className="div-forall" style={{ gap: "20px" }}>
          <ExerciseHeader
            sectionLetter="E"
            title="Read and label."
            subTitle={
              "Match each clue first, then drag the item to its correct target and check the snap position."
            }
          />
          <div>
            {/* ================= BANK ================= */}
            <Droppable droppableId="bank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    display: "flex",
                    gap: "50px",
                    justifyContent: "center",
                    marginBottom: "30px",
                    // border: "2px dashed gray",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  {options.map((l, index) => {
                    const isUsed = isSentenceUsed(l);

                    return (
                      <Draggable
                        key={`bank-${l}`}
                        draggableId={`bank-${l}`} // 🔥 UNIQUE
                        index={index}
                        isDragDisabled={allDone || isUsed}
                      >
                        {(provided) => (
                          <div
                            ref={(el) => {
                              provided.innerRef(el);
                              chipRefs.current[l] = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            role="button"
                            tabIndex={pickedSentence ? -1 : 0}
                            aria-label={`Label ${l}. Press Enter or Space to choose it.`}
                            aria-pressed={pickedSentence === l}
                            aria-disabled={allDone || isUsed}
                            className=" focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                            onKeyDown={(e) => {
                              cancelSelection(e);
                              if (activateKey(e)) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!e.repeat) pickSentence(l);
                              }
                            }}
                            onKeyUp={activationKeyUp}
                            style={{
                              ...provided.draggableProps.style,
                              ...(pickedSentence === l ? activeStyle : {}),
                              width: "40px",
                              height: "40px",
                              border: "2px solid #0013a5",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              background:
                                pickedSentence === l
                                  ? "#dbeafe"
                                  : isUsed
                                    ? "#e5e7eb"
                                    : "#fff",
                              color: isUsed ? "#9ca3af" : "#000",
                            }}
                          >
                            {l}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* ================= QUESTIONS ================= */}
            <div style={{ display: "flex", gap: "40px" }}>
              <div style={{ flex: 1 }}>
                {questions.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "25px",
                    }}
                  >
                    <span style={{ width: "20px", fontWeight: "bold" }}>
                      {i + 1}
                    </span>

                    <span
                      role="button"
                      tabIndex={pickedSentence ? -1 : 0}
                      aria-label={`Hear ${q.text}`}
                      className="relative rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                      onClick={() => playSentence(q.text, `text-q-${i}`)}
                      onKeyDown={(e) => {
                        cancelSelection(e);
                        if (activateKey(e)) {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!e.repeat) playSentence(q.text, `text-q-${i}`);
                        }
                      }}
                      onKeyUp={activationKeyUp}
                      style={{
                        ...(playingKey === `text-q-${i}` ? activeStyle : {}),
                        flex: 1,
                        marginLeft: "10px",
                        fontSize: "18px",
                        fontWeight: "700",
                      }}
                    >
                      {q.text}
                      {badge(`text-q-${i}`)}
                    </span>

                    <Droppable
                      droppableId={`q-${i}`}
                      isDropDisabled={isLocked(`q-${i}`)}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={(el) => {
                            provided.innerRef(el);
                            blankRefs.current[`q-${i}`] = el;
                          }}
                          {...provided.droppableProps}
                          role="button"
                          tabIndex={pickedSentence && isLocked(`q-${i}`) ? -1 : 0}
                          aria-label={`Question ${i + 1}, label: ${answers[`q-${i}`] || "empty"}${results[`q-${i}`] ? ", " + results[`q-${i}`] : ""}`}
                          aria-disabled={isLocked(`q-${i}`)}
                          className="rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
                          onClick={() => activateSlot(`q-${i}`)}
                          onKeyDown={(e) => slotKeyDown(e, `q-${i}`)}
                          onKeyUp={activationKeyUp}
                          style={{
                            width: "40px",
                            height: "40px",
                            border:isLocked(`q-${i}`) ?"3px solid #16a34a" : "2px solid #0013a5",
                            borderBottom:"2px solid #0013a5",
                            borderRadius: "10px",
                            // borderColor: isLocked(`q-${i}`)
                            //   ? "#16a34a"
                            //   : "#0013a5",
                            // borderWidth: isLocked(`q-${i}`)
                            //   ? "3px"
                            //   : undefined,
                            ...(snapshot.isDraggingOver && !isLocked(`q-${i}`)
                              ? {
                                  outline: "2px dashed #2563eb",
                                  outlineOffset: 2,
                                  backgroundColor: "#dbeafe",
                                }
                              : {}),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            fontSize: "18px",
                            fontWeight: "700",
                          }}
                        >
                          {answers[`q-${i}`] && (
                            <Draggable
                              draggableId={`q-${i}-${answers[`q-${i}`]}`} // 🔥 UNIQUE
                              index={0}
                              isDragDisabled={isLocked(`q-${i}`)}
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
                                    activateSlot(`q-${i}`);
                                  }}
                                >
                                  {answers[`q-${i}`]}
                                </div>
                              )}
                            </Draggable>
                          )}

                          {isWrongAnswer(`q-${i}`) && (
                            <div
                              style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-6px",
                                width: "18px",
                                height: "18px",
                                background: "red",
                                color: "white",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                border: "2px solid white",
                              }}
                            >
                              ✕
                            </div>
                          )}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>

              {/* الصور */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                {[imgA, imgB, imgC, imgD, imgE, imgF].map((img, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px" }}>
                    <span>{options[i]}</span>
                    <img
                      src={img}
                      alt={
                        [
                          "A woman carrying a plate to a laid table.",
                          "A boy buttoning his shirt.",
                          "A white cat drinking from a bowl.",
                          "A boy throwing a ball.",
                          "A child handing a pot to a woman.",
                          "An older man reading a newspaper in an armchair.",
                        ][i]
                      }
                      style={{ height: "120px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* ================= BUTTONS ================= */}

          <Button
            handleStartAgain={reset}
            handleShowAnswer={showAnswers}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit10_Page6_Q2;
