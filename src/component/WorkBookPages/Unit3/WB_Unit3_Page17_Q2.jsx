import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - F/Item_001_aekt_a_tpoho.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - F/Item_002_kema_a_chasdiwn.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 17 - F/Item_003_deri_a_ekib.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { createPortal } from "react-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  useMouseSensor,
  useTouchSensor,
} from "@hello-pangea/dnd";

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
      aria-label={String(children) + ". Hear it."}
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
  "aekt a tpoho": sound0,
  "kema a chasdiwn": sound1,
  "deri a ekib": sound2,
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
const WB_Unit3_Page17_Q2 = () => {
  const data = [
    {
      scrambled: "aekt a tpoho",
      answer: "take a photo",
    },
    {
      scrambled: "kema a chasdiwn",
      answer: "make a sandwich",
    },
    {
      scrambled: "deri a ekib",
      answer: "ride a bike",
    },
    {
      scrambled: "lyf a tiek",
      answer: "fly a kite",
    },
    {
      scrambled: "chneb",
      answer: "bench",
    },
    {
      scrambled: "lyap eht murd",
      answer: "play the drum",
    },
  ];
  const tokens = data.flatMap((item, r) =>
    item.scrambled.split(" ").flatMap((word, w) =>
      word.split("").map((char, c) => ({
        id: r + "__" + w + "__" + c + "__" + char,
        char,
      })),
    ),
  );
  const labels = Object.fromEntries(tokens.map((t) => [t.id, t.char]));
  const correct = {},
    scoreGroups = [];
  data.forEach((item, r) => {
    const ids = [];
    item.answer.split(" ").forEach((word, w) => {
      const pool = tokens.filter((t) => t.id.startsWith(r + "__" + w + "__"));
      word.split("").forEach((char, c) => {
        const at = pool.findIndex((t) => t.char === char),
          token = pool.splice(at, 1)[0],
          id = r + "__" + w + "__" + c;
        correct[id] = token.id;
        ids.push(id);
      });
    });
    scoreGroups.push(ids);
  });
  const interaction = useWordPlacement({
    initialAnswers: {},
    correctAnswers: correct,
    bank: tokens.map((t) => t.id),
    labels,
    sounds: {},
    allowed: (slot, word) =>
      slot.split("__").slice(0, 2).join("__") ===
      word.split("__").slice(0, 2).join("__"),
    scoreGroups,
    missingMessage: "Please complete all answers before checking.",
  });
  const { rootRef, message, playingKey, playSound } = interaction;
  const inputs = data.map((item, r) =>
    item.answer.split(" ").map((word, w) =>
      word.split("").map((_, c) => {
        const id = interaction.values[r + "__" + w + "__" + c];
        return id
          ? {
              id,
              char: labels[id],
            }
          : null;
      }),
    ),
  );
  const showAnswer = interaction.revealed;
  const wrong = data.map((_, r) =>
    scoreGroups[r].some((id) => interaction.results[id] === "wrong"),
  );
  const isLetterUsed = (_, id) => interaction.used(id);
  const onDragEnd = ({ destination, draggableId }) => {
    if (destination) interaction.place(destination.droppableId, draggableId);
  };
  const checkAnswers = interaction.check,
    reset = interaction.reset;
  return (
    <DragDropContext
      enableDefaultSensors={false}
      sensors={[useMouseSensor, useTouchSensor]}
      onDragEnd={onDragEnd}
      onBeforeDragStart={interaction.dragStart}
    >
      <div className="main-container-component" ref={rootRef}>
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
            marginBottom: "60px",
            gap: "30px",
          }}
        >
          <div className="page8-content">
            <ExerciseHeader
              isWorkbook
              sectionLetter="F"
              title={"Unscramble and write."}
              subTitle={"Say the correct picnic and ability word or sentence first, then rearrange the pieces into that order."}
            />
          </div>
          <div className="flex flex-col gap-5">
            {data.map((item, i) => {
              const scrambledWords = item.scrambled.split(" ");
              const answerWords = item.answer.split(" ");
              return (
                <div
                  className="border-2 border-gray-300 p-5 rounded-lg"
                  key={i}
                  style={{
                    marginBottom: "14px",
                    width: "100%",
                  }}
                >
                  <div className="scrambled-wb-unit3-p17-q2">
                    <div className="text-[22px]">
                      <span
                        className="text-[22px] text-blue-900"
                        style={{
                          fontWeight: "600",
                          marginRight: "8px",
                        }}
                      >
                        {i + 1}.
                      </span>
                      <AudioText
                        tabIndex={interaction.picked ? -1 : 0}
                        audioKey={"scrambled-" + i}
                        src={SOUNDS[item.scrambled]}
                        playSound={playSound}
                        playingKey={playingKey}
                        className=""
                      >
                        {item.scrambled}
                      </AudioText>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        // marginTop: "10px",
                      }}
                    >
                      {scrambledWords.map((word, wordIndex) => (
                        <Droppable
                          key={`bank-${i}-${wordIndex}`}
                          droppableId={`bank__${i}__${wordIndex}__0`}
                          direction="horizontal"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              style={{
                                display: "flex",
                                gap: "6px",
                                padding: "8px",
                                // border: "2px dashed #ccc",
                                borderRadius: "10px",
                                minHeight: "42px",
                                alignItems: "center",
                              }}
                            >
                              {word.split("").map((char, charIndex) => {
                                const letterId = `${i}__${wordIndex}__${charIndex}__${char}`;
                                const used =
                                  isLetterUsed(i, letterId) || showAnswer;
                                return (
                                  <Draggable
                                    key={letterId}
                                    draggableId={letterId}
                                    index={charIndex}
                                    isDragDisabled={used}
                                  >
                                    {(provided, snapshot) => {
                                      const tile = (
                                        <span
                                          ref={(el) => {
                                            provided.innerRef(el);
                                            interaction.bankRefs.current[
                                              letterId
                                            ] = el;
                                          }}
                                          {...(!used
                                            ? provided.draggableProps
                                            : {})}
                                          {...(!used
                                            ? provided.dragHandleProps
                                            : {})}
                                          className={
                                            "WB-word-bank " + focusClass
                                          }
                                          style={{
                                            ...interaction.bankStyle(letterId),
                                            width: "32px",
                                            height: "32px",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            // border: "2px solid #2c5287",
                                            // borderRadius: "8px",
                                            // background: "white",
                                            // fontWeight: "bold",
                                            textTransform: "lowercase",
                                            opacity: used ? 0.35 : 1,
                                            cursor: used
                                              ? "not-allowed"
                                              : "grab",
                                            ...provided.draggableProps.style,
                                            ...(snapshot.isDragging
                                              ? {
                                                  zIndex: 2147483647,
                                                }
                                              : {}),
                                          }}
                                          {...interaction.bankProps(letterId)}
                                        >
                                          {char}
                                        </span>
                                      );
                                      return snapshot.isDragging
                                        ? createPortal(
                                            tile,
                                            document.fullscreenElement ||
                                              document.body,
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
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <div
                      // className="border-b-2 border-gray-500"
                      style={{
                        minHeight: "56px",
                        display: "flex",
                        alignItems: "center",
                        gap: "25px",
                        flexWrap: "wrap",
                        padding: "8px 10px",
                      }}
                    >
                      {(showAnswer ? answerWords : inputs[i]).map(
                        (wordValue, wordIndex) => {
                          const targetLength = answerWords[wordIndex].length;
                          return (
                            <div
                              key={`answer-word-${i}-${wordIndex}`}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                // ⭐ مهم
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <div className="flex gap-3">
                                {Array.from({
                                  length: targetLength,
                                }).map((_, charIndex) => (
                                  <Droppable
                                    key={`blank-${i}-${wordIndex}-${charIndex}`}
                                    droppableId={`${i}__${wordIndex}__${charIndex}`}
                                    isDropDisabled={interaction.locked(
                                      `${i}__${wordIndex}__${charIndex}`,
                                    )}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={(el) => {
                                          provided.innerRef(el);
                                          interaction.slotRefs.current[
                                            `${i}__${wordIndex}__${charIndex}`
                                          ] = el;
                                        }}
                                        {...provided.droppableProps}
                                        {...interaction.slotProps(
                                          `${i}__${wordIndex}__${charIndex}`,
                                          snapshot,
                                        )}
                                        style={{
                                          width: "34px",
                                          height: "40px",
                                          borderBottom: "2px solid",
                                          borderColor:
                                            snapshot.isDraggingOver &&
                                            !interaction.locked(
                                              `${i}__${wordIndex}__${charIndex}`,
                                            )
                                              ? "#60a5fa"
                                              : "#9ca3af",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "20px",
                                          fontWeight: "700",
                                          background:
                                            snapshot.isDraggingOver &&
                                            !interaction.locked(
                                              `${i}__${wordIndex}__${charIndex}`,
                                            )
                                              ? "#eff6ff"
                                              : "transparent",
                                          ...interaction.slotProps(
                                            `${i}__${wordIndex}__${charIndex}`,
                                            snapshot,
                                          ).style,
                                        }}
                                        className={focusClass}
                                      >
                                        <span
                                          style={{
                                            cursor: showAnswer
                                              ? "default"
                                              : "pointer",
                                          }}
                                          className="text-black hover:text-red-500"
                                        >
                                          {showAnswer
                                            ? answerWords[wordIndex][charIndex]
                                            : inputs[i][wordIndex][charIndex]
                                                ?.char || ""}
                                        </span>
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                ))}
                              </div>
                              {/* ⭐ الكلمة المجمعة */}
                              <div
                                style={{
                                  minHeight: "40px",
                                  fontSize: "22px",
                                  fontWeight: "600",
                                  color: "#1e3a8a",
                                  borderBottom: "2px solid gray",
                                  borderBottomColor: Array.from(
                                    answerWords[wordIndex],
                                  ).every(
                                    (_, c) =>
                                      interaction.results[
                                        `${i}__${wordIndex}__${c}`
                                      ] === "correct",
                                  )
                                    ? "#16a34a"
                                    : "gray",
                                  textAlign: "center",
                                  width: "100%",
                                }}
                              >
                                <span>
                                  {showAnswer
                                    ? answerWords[wordIndex]
                                    : inputs[i][wordIndex]
                                        .map((slot) => slot?.char || "")
                                        .join("")}
                                </span>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>

                    {wrong[i] && (
                      <div className="wrong-icon-wb-unit1-p3-q1">✕</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            onClick={interaction.show}
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
export default WB_Unit3_Page17_Q2;
