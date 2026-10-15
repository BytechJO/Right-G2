import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - J/Item_001_Yes,_she_can.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - J/Item_002_Yes,_it_can.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - J/Item_003_No,_she_can't.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - J/Item_004_Can_she_sing.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - J/Item_005_Can_it_swim.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - J/Item_006_Can_it_hop.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - J/Item_007_Can_she_fly.mp3";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Ex J 4.svg";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";

// Keep the score dialog's return focus on an enabled action in this exercise.
function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({ preventScroll: true });
  }
  ValidationAlert[kind](...messages);
}


const answerQuestions = [
  {
    id: "j1",
    img: img1,
    question: "Can she sing?",
    correctAnswer: "Yes, she can.",
  },
  {
    id: "j2",
    img: img2,
    question: "Can it swim?",
    correctAnswer: "Yes, it can.",
  },
  {
    id: "j3",
    img: img3,
    question: "Can it hop?",
    correctAnswer: "Yes, it can.",
  },
  {
    id: "j4",
    img: img4,
    question: "Can she fly?",
    correctAnswer: "No, she can't.",
  },
];
const initialState = {
  wordBank: [
    {
      id: "w1",
      text: "Yes, she can.",
    },
    {
      id: "w2",
      text: "Yes, it can.",
    },
    {
      id: "w3",
      text: "Yes, it can.",
    },
    {
      id: "w4",
      text: "No, she can't.",
    },
  ],
  j1: [],
  j2: [],
  j3: [],
  j4: [],
};
const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Keep this indicator local.
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
      background: "white",
      color: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 3,
      boxShadow: "0 1px 3px rgba(0,0,0,.25)",
    }}
  >
    <FaVolumeUp size={12} />
  </span>
);
const activate = (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  e.stopPropagation();
  if (!e.repeat) e.currentTarget.click();
};
const release = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
  }
};
function useExerciseAudio() {
  const rootRef = useRef(null),
    ownerRef = useRef(Symbol("workbook-exercise")),
    tokenRef = useRef(0);
  const [playingKey, setPlayingKey] = useState(null);
  const stopAudio = () => {
    tokenRef.current++;
    stopGlobalAudio(ownerRef.current);
    setPlayingKey(null);
  };
  const playSound = (key, src) => {
    if (!src) return;
    stopAudio();
    rootRef.current
      ?.querySelectorAll("audio")
      .forEach((audio) => audio.pause());
    const token = tokenRef.current;
    setPlayingKey(key);
    try {
      playGlobalAudio(src, {
        owner: ownerRef.current,
        onFinish: () => {
          if (tokenRef.current === token) setPlayingKey(null);
        },
      });
    } catch {
      stopAudio();
    }
  };
  useEffect(() => {
    const tokenState = tokenRef,
      owner = ownerRef.current;
    const onPlay = (e) => {
      if (e.target?.tagName !== "AUDIO") return;
      tokenRef.current++;
      stopGlobalAudio(ownerRef.current);
      setPlayingKey(null);
    };
    document.addEventListener("play", onPlay, true);
    return () => {
      document.removeEventListener("play", onPlay, true);
      tokenState.current++;
      stopGlobalAudio(owner);
    };
  }, []);
  return {
    rootRef,
    playingKey,
    playSound,
    stopAudio,
  };
}
// eslint-disable-next-line react-refresh/only-export-components -- Keep this control local.
const AudioText = ({
  children,
  audioKey,
  label,
  src,
  playSound,
  playingKey,
  className = "",
  style = {},
  tabIndex = 0,
}) => {
  if (!src)
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  return (
    <span
      role="button"
      tabIndex={tabIndex}
      aria-label={label || String(children) + ". Hear it."}
      className={className + " " + focusClass}
      onClick={() => playSound(audioKey, src)}
      onKeyDown={activate}
      onKeyUp={release}
      style={{
        borderRadius: "8px",
        ...style,
        position: "relative",
        cursor: "pointer",
        ...(playingKey === audioKey
          ? {
              boxShadow: "0 0 0 3px #2563eb",
              backgroundColor: "#dbeafe",
            }
          : {}),
      }}
    >
      {children}
      {playingKey === audioKey && <SpeakerBadge />}
    </span>
  );
};
const SOUNDS = {
  "yes, she can": sound0,
  "yes, it can": sound1,
  "no, she can't": sound2,
  "can she sing": sound3,
  "can it swim": sound4,
  "can it hop": sound5,
  "can she fly": sound6,
};
const IMAGE_DESCRIPTIONS = {
  [img1]: "A girl singing into a microphone.",
  [img2]: "A crocodile in water.",
  [img3]: "A brown rabbit.",
  [img4]: "A girl in a costume with wings.",
};
function useCheckButton(rootRef, checkDisabled) {
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = checkDisabled;
    button.style.cursor = checkDisabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(checkDisabled));
  }, [rootRef, checkDisabled]);
}
function useWordPlacement({
  initialAnswers,
  correctAnswers,
  bank,
  sounds,
  limits = {},
  labels = {},
  missingMessage,
  allowed = () => true,
  scoreGroups = null,
}) {
  const [values, setValues] = useState(initialAnswers),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [picked, setPicked] = useState(null),
    [message, setMessage] = useState("");
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();
  const bankRefs = useRef({}),
    slotRefs = useRef({}),
    focusFrame = useRef(null),
    suppressFocus = useRef(false);
  const slotIds = Object.keys(correctAnswers),
    locked = (id) => revealed || results[id] === "correct";
  const complete = slotIds.every((id) => results[id] === "correct");
  useCheckButton(rootRef, revealed || complete);
  const cancelFocus = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
  };
  const focus = (el) => {
    cancelFocus();
    focusFrame.current = requestAnimationFrame(() => {
      focusFrame.current = null;
      suppressFocus.current = true;
      try {
        el()?.focus();
      } finally {
        suppressFocus.current = false;
      }
    });
  };
  useEffect(
    () => () => {
      if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    },
    [],
  );
  const used = (word, current = values) =>
    Object.entries(current).filter(
      ([id, v]) => v === word && results[id] !== "wrong",
    ).length >= (limits[word] || 1);
  const available = (word) => bank.includes(word) && !revealed && !used(word);
  const place = (id, word) => {
    if (
      !slotIds.includes(id) ||
      locked(id) ||
      !bank.includes(word) ||
      !allowed(id, word)
    )
      return;
    if (
      Object.entries(values).filter(
        ([slot, v]) => slot !== id && v === word && locked(slot),
      ).length >= (limits[word] || 1)
    )
      return;
    const next = {
        ...values,
      },
      affected = [id];
    if ((limits[word] || 1) === 1) {
      for (const slot of slotIds)
        if (slot !== id && next[slot] === word && !locked(slot)) {
          next[slot] = "";
          affected.push(slot);
        }
    } else {
      const occupied = slotIds.filter(
        (slot) => slot !== id && next[slot] === word,
      );
      while (occupied.length >= limits[word]) {
        const prior = occupied.find((slot) => !locked(slot));
        if (!prior) return;
        next[prior] = "";
        affected.push(prior);
        occupied.splice(occupied.indexOf(prior), 1);
      }
    }
    next[id] = word;
    setValues(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([slot]) => !affected.includes(slot)),
      ),
    );
    setPicked(null);
    setMessage((labels[word] || word) + " placed in the blank.");
    return next;
  };
  const remove = (id) => {
    if (locked(id) || !values[id]) return;
    setValues((prev) => ({
      ...prev,
      [id]: "",
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setPicked(null);
    setMessage((labels[values[id]] || values[id]) + " returned to the bank.");
  };
  const cancel = () => {
    const old = picked;
    setPicked(null);
    setMessage("Selection cancelled.");
    if (old) focus(() => bankRefs.current[old]);
  };
  const wordLabel = (word) => labels[word] || word;
  const bankProps = (word) => ({
    "data-word-id": word,
    role: "button",
    tabIndex: picked ? -1 : 0,
    "aria-pressed": picked === word,
    "aria-disabled": !available(word),
    "aria-label":
      wordLabel(word) + ". Choose with Enter or Space, then place in a blank.",
    onClick: () => playSound("bank-" + word, sounds[word]),
    onFocus: (e) => {
      if (!suppressFocus.current && e.currentTarget.matches(":focus-visible"))
        playSound("bank-" + word, sounds[word]);
    },
    onKeyDown: (e) => {
      if (e.key === "Escape") {
        if (picked) {
          e.preventDefault();
          e.stopPropagation();
          cancel();
        }
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      playSound("bank-" + word, sounds[word]);
      if (!available(word)) return;
      const target =
        slotIds.find((id) => !locked(id) && allowed(id, word) && !values[id]) ||
        slotIds.find((id) => !locked(id) && allowed(id, word));
      if (!target) return;
      setPicked(word);
      setMessage(
        wordLabel(word) +
          " chosen. Press Enter or Space on a blank to place it.",
      );
      focus(() => slotRefs.current[target]);
    },
    onKeyUp: release,
  });
  const slotProps = (id, snapshot) => ({
    "data-slot-id": id,
    role: "button",
    tabIndex: picked && (locked(id) || !allowed(id, picked)) ? -1 : 0,
    "aria-disabled": locked(id),
    "aria-label":
      "Blank " +
      (slotIds.indexOf(id) + 1) +
      ". " +
      (wordLabel(values[id]) || "Empty") +
      ". " +
      (locked(id)
        ? "Correct and locked."
        : results[id] === "wrong"
          ? "Incorrect, editable."
          : "Editable."),
    onClick: () => {
      if (locked(id)) {
        playSound("slot-" + id, sounds[values[id]]);
        return;
      }
      remove(id);
    },
    onKeyDown: (e) => {
      if (e.key === "Tab" && picked) {
        const editable = slotIds.filter(
            (slot) => !locked(slot) && allowed(slot, picked),
          ),
          at = editable.indexOf(id),
          next = at + (e.shiftKey ? -1 : 1);
        if (next >= 0 && next < editable.length) {
          e.preventDefault();
          e.stopPropagation();
          focus(() => slotRefs.current[editable[next]]);
        }
        return;
      }
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat && results[id] === "wrong") remove(id);
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      if (locked(id)) {
        playSound("slot-" + id, sounds[values[id]]);
        return;
      }
      if (picked) {
        const word = picked,
          next = place(id, word);
        if (next)
          focus(
            () => bankRefs.current[bank.find((w) => !used(w, next)) || word],
          );
      } else remove(id);
    },
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: 0,
      ...(results[id] === "correct" || revealed
        ? {
            borderBottomColor: "#16a34a",
            boxShadow: "inset 0 0px #16a34a",
          }
        : {}),
      ...(snapshot?.isDraggingOver && !locked(id)
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const check = () => {
    if (revealed || complete) return;
    cancelFocus();
    setPicked(null);
    stopAudio();
    if (slotIds.some((id) => !values[id])) {
      ValidationAlert.info(missingMessage);
      setMessage(missingMessage);
      return;
    }
    const next = Object.fromEntries(
      slotIds.map((id) => [
        id,
        results[id] === "correct" ||
        (labels[values[id]] || values[id]) ===
          (labels[correctAnswers[id]] || correctAnswers[id])
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const groups = scoreGroups || slotIds.map((id) => [id]);
    const score = groups.filter((ids) =>
        ids.every((id) => next[id] === "correct"),
      ).length,
      total = groups.length,
      msg = `Score: ${score} / ${total}`;
    setMessage(
      msg + ". Correct answers are locked; incorrect answers can be changed.",
    );
    if (score === total) showCheckFeedback(rootRef.current, "success", msg);
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };
  const show = () => {
    cancelFocus();
    stopAudio();
    setPicked(null);
    setValues({
      ...correctAnswers,
    });
    setResults(Object.fromEntries(slotIds.map((id) => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    cancelFocus();
    stopAudio();
    setPicked(null);
    setValues({
      ...initialAnswers,
    });
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset. All answers and results cleared.");
  };
  const dragStart = () => {
    cancelFocus();
    setPicked(null);
  };
  const bankStyle = (word) => ({
    position: "relative",
    borderRadius: 8,
    ...(picked === word
      ? {
          outline: "4px solid #2563eb",
          outlineOffset: 2,
          backgroundColor: "#dbeafe",
        }
      : {}),
  });
  const move = (source, target) => {
    if (
      locked(source) ||
      locked(target) ||
      !values[source] ||
      !slotIds.includes(target)
    )
      return;
    setValues({
      ...values,
      [source]: values[target] || "",
      [target]: values[source],
    });
    setResults((p) => ({
      ...p,
      [source]: null,
      [target]: null,
    }));
    setPicked(null);
  };
  return {
    move,
    values,
    results,
    revealed,
    picked,
    message,
    rootRef,
    playingKey,
    playSound,
    stopAudio,
    bankRefs,
    slotRefs,
    locked,
    used,
    place,
    bankProps,
    slotProps,
    check,
    show,
    reset,
    dragStart,
    bankStyle,
  };
}
const WB_Unit3_Page19_Q2 = () => {
  const labels = Object.fromEntries(
    initialState.wordBank.map((w) => [w.id, w.text]),
  );
  const bankOrder = ["w3", "w1", "w4", "w2"];
  const interaction = useWordPlacement({
    initialAnswers: {},
    correctAnswers: Object.fromEntries(
      answerQuestions.map((q, i) => [q.id, initialState.wordBank[i].id]),
    ),
    bank: bankOrder,
    labels,
    sounds: Object.fromEntries(
      initialState.wordBank.map((w) => [
        w.id,
        SOUNDS[w.text.slice(0, -1).toLowerCase()],
      ]),
    ),
    missingMessage: "Please complete all answers first.",
  });
  const { rootRef, message, playSound, playingKey } = interaction;
  const items = {
    wordBank: bankOrder.map((id) =>
      initialState.wordBank.find((w) => w.id === id),
    ),
    ...Object.fromEntries(
      answerQuestions.map((q) => [
        q.id,
        interaction.values[q.id]
          ? [
              {
                id: interaction.values[q.id],
                text: labels[interaction.values[q.id]],
              },
            ]
          : [],
      ]),
    ),
  };
  const showResults =
    interaction.revealed ||
    answerQuestions.every((q) => interaction.locked(q.id));
  const isWrong = (id) => interaction.results[id] === "wrong";
  const handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset,
    checkAnswers = interaction.check;
  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (
      source.droppableId !== "wordBank" &&
      interaction.locked(source.droppableId)
    )
      return;
    const word = draggableId.split("-")[0];
    if (destination.droppableId === "wordBank") {
      if (source.droppableId !== "wordBank")
        interaction.slotProps(source.droppableId).onClick();
      return;
    }
    interaction.place(destination.droppableId, word);
  };
  return (
    <div className="main-container-component mb-15" ref={rootRef}>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
      <div
        className="div-forall"
        style={{
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="J"
          title={<>Read, look, and write the answers.</>}
          subTitle={"Use the picture or chart first, then write a short complete picnic and ability answer for each question."}
        />

        <DragDropContext
          enableDefaultSensors={false}
          sensors={[useMouseSensor, useTouchSensor]}
          onDragEnd={onDragEnd}
          onBeforeDragStart={interaction.dragStart}
        >
          {/* Word Bank */}
          <Droppable droppableId="wordBank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap justify-center gap-3 p-2 rounded-xl min-h-[40px] text-[20px]"
              >
                {items.wordBank.map((word, index) => {
                  const isUsed = interaction.used(word.id);
                  return (
                    <Draggable
                      key={word.id}
                      draggableId={`${word.id}-${index}`}
                      index={index}
                      isDragDisabled={isUsed || showResults} // 🔒 المنع
                    >
                      {(provided, snapshot) => {
                        const tile = (
                          <div
                            ref={(el) => {
                              provided.innerRef(el);
                              interaction.bankRefs.current[word.id] = el;
                            }}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            {...interaction.bankProps(word.id)}
                            style={{
                              ...interaction.bankStyle(word.id),
                              ...provided.draggableProps.style,
                              ...(snapshot.isDragging
                                ? {
                                    zIndex: 2147483647,
                                  }
                                : {}),
                            }}
                            className={`${focusClass} WB-word-bank 
            ${isUsed || showResults ? "bg-gray-100 text-gray-400 border border-blue-800 cursor-not-allowed opacity-70" : "bg-white text-gray-800 border border-blue-800 cursor-grab hover:bg-gray-50"}`}
                          >
                            {word.text}
                            {playingKey === "bank-" + word.id && (
                              <SpeakerBadge />
                            )}
                          </div>
                        );
                        return snapshot.isDragging
                          ? createPortal(
                              tile,
                              document.fullscreenElement || document.body,
                            )
                          : tile;
                      }}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-15">
            {answerQuestions.map((q, index) => (
              <div
                key={q.id}
                className="relative flex flex-col justify-center w-full"
              >
                <div className="flex gap-2 items-center">
                  <p className="font-bold text-blue-900 text-xl">{index + 1}</p>
                  <p className="text-[20px]">
                    <AudioText
                      tabIndex={interaction.picked ? -1 : 0}
                      audioKey={"question-" + q.id}
                      src={SOUNDS[q.question.slice(0, -1).toLowerCase()]}
                      playSound={playSound}
                      playingKey={playingKey}
                      className=""
                    >
                      {q.question}
                    </AudioText>
                  </p>
                </div>
                <img
                  alt={IMAGE_DESCRIPTIONS[q.img]}
                  src={q.img}
                  className="w-24 h-24 mt-2"
                  style={{
                    height: "90px",
                  }}
                />

                <Droppable
                  droppableId={q.id}
                  isDropDisabled={interaction.locked(q.id)}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={(el) => {
                        provided.innerRef(el);
                        interaction.slotRefs.current[q.id] = el;
                      }}
                      {...provided.droppableProps}
                      {...interaction.slotProps(q.id, snapshot)}
                      className={`${focusClass} w-[90%] min-h-[35px] border-b-2 flex items-center justify-center ${isWrong(q.id) && "border-red-500"}  ${snapshot.isDraggingOver && !interaction.locked(q.id) ? "bg-blue-100 border-blue-400 border-dashed" : isWrong(q.id) ? "border-red-500" : "border-gray-400"}`}
                    >
                      {items[q.id].map((word, i) => (
                        <Draggable
                          key={word.id}
                          draggableId={word.id}
                          index={i}
                          isDragDisabled={interaction.locked(q.id)}
                        >
                          {(provided, snapshot) => {
                            const tile = (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                tabIndex={-1}
                                style={{
                                  ...provided.draggableProps.style,
                                  ...(snapshot.isDragging
                                    ? {
                                        zIndex: 2147483647,
                                      }
                                    : {}),
                                }}
                                className="text-[20px]"
                              >
                                {word.text}
                              </div>
                            );
                            return snapshot.isDragging
                              ? createPortal(
                                  tile,
                                  document.fullscreenElement || document.body,
                                )
                              : tile;
                          }}
                        </Draggable>
                      ))}

                      {isWrong(q.id) && (
                        <div className="absolute top-0 right-8 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center rounded-full text-sm font-bold shadow-lg border-2 border-white">
                          ✕
                        </div>
                      )}

                      {provided.placeholder}
                      {playingKey === "slot-" + q.id && <SpeakerBadge />}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};
export default WB_Unit3_Page19_Q2;
