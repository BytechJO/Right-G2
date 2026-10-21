import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 8/Page 48 - H/Item_001_Picture_A.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 8/Page 48 - H/Item_002_Picture_B.mp3";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U8 Folder/Page 48/Ex H 2.svg";
const IMAGE_DESCRIPTIONS = {
  A: "Five family members standing by a tree: Dad and Mom behind three children. They wear red, teal, yellow, blue and green hats; Mom wears sunglasses, and each child holds a yo-yo.",
  B: "The same five family members by the tree, with their heads and eyes visible. No yo-yos are visible. Mom and the child on the left wear orange headbands, and the front child has tied-up hair.",
};
const focusClass =
  "focus-visible:outline-solid! focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
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
function useCheckButton(rootRef, checkDisabled) {
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = checkDisabled;
    button.style.cursor = checkDisabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(checkDisabled));
  }, [rootRef, checkDisabled]);
}
function showCheckFeedback(root, kind, ...messages) {
  if (kind === "success") {
    const returnTarget =
      root?.querySelector(".try-again-button:not(:disabled)") ||
      root?.querySelector(".show-answer-btn:not(:disabled)");
    returnTarget?.focus({
      preventScroll: true,
    });
  }
  ValidationAlert[kind](...messages);
}
const SOUNDS = {
  "picture a": clip0,
  "picture b": clip1,
  // "in picture a mom has sunglasses": clip2,
  // "in picture b mom has sunglasses": clip3,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const soundFor = (text) => SOUNDS[normalized(text)];
function useAnswers(correct, options = {}) {
  const audio = useExerciseAudio();
  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const ids = Object.keys(correct),
    complete = ids.every((id) => results[id] === "correct");
  const completionRef = useRef(false);
  completionRef.current = complete || revealed;
  useCheckButton(audio.rootRef, complete || revealed);
  const locked = (id) => revealed || results[id] === "correct";
  const chosen = (id, value) =>
    Array.isArray(correct[id])
      ? (values[id] || []).includes(value)
      : values[id] === value;
  const choose = (id, value) => {
    if (locked(id)) return;
    let next = value;
    if (Array.isArray(correct[id])) {
      const current = values[id] || [];
      if (current.includes(value)) next = current.filter((v) => v !== value);
      else {
        if (options.limit && current.length >= options.limit) return;
        next = [...current, value];
      }
    }
    setValues((prev) => ({
      ...prev,
      [id]: next,
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setMessage("Answer " + id + " updated.");
  };
  const stop = () => {
    audio.stopAudio();
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
  };
  const check = () => {
    if (completionRef.current) return;
    stop();
    if (
      ids.some((id) =>
        Array.isArray(correct[id])
          ? !values[id]?.length
          : values[id] === undefined || values[id] === "",
      )
    ) {
      const text = options.missing || "Please complete all answers first.";
      setMessage(text);
      ValidationAlert.info(text);
      return;
    }
    const same = (actual, expected) =>
      Array.isArray(expected)
        ? actual.length === expected.length &&
          expected.every((v) => actual.includes(v))
        : options.normalize
          ? normalized(actual) === normalized(expected)
          : actual === expected;
    const next = Object.fromEntries(
      ids.map((id) => [
        id,
        results[id] === "correct" || same(values[id], correct[id])
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter((v) => v === "correct").length;
    completionRef.current = score === ids.length;
    setMessage(
      "Score " +
        score +
        " out of " +
        ids.length +
        ". Correct answers are locked.",
    );
    showCheckFeedback(
      audio.rootRef.current,
      score === ids.length ? "success" : score ? "warning" : "error",
      "Score: " + score + " / " + ids.length,
    );
  };
  const show = () => {
    completionRef.current = true;
    stop();
    setValues(
      Object.fromEntries(
        ids.map((id) => [
          id,
          Array.isArray(correct[id]) ? [...correct[id]] : correct[id],
        ]),
      ),
    );
    setResults(Object.fromEntries(ids.map((id) => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    completionRef.current = false;
    stop();
    setValues({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const resultStyle = (id, value) =>
    chosen(id, value) && results[id]
      ? {
          borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
          boxShadow:
            "inset 0 0 0 1px " +
            (results[id] === "correct" ? "#16a34a" : "#ef4444"),
        }
      : {};
  const props = (id, value, src, label = String(value)) => ({
    role: "button",
    tabIndex: 0,
    "aria-label":
      "Question " +
      id +
      ": " +
      label +
      (locked(id) ? ". Correct and locked." : ""),
    "aria-pressed": chosen(id, value),
    "aria-disabled": locked(id),
    onKeyDown: activate,
    onKeyUp: release,
    onClick: () => {
      options.beforeInteract?.();
      if (src) audio.playSound("choice-" + id + "-" + value, src);
      choose(id, value);
    },
    style: {
      position: "relative",
      ...(chosen(id, value) && !results[id]
        ? {
            backgroundColor: "#dbeafe",
          }
        : {}),
      ...resultStyle(id, value),
    },
  });
  const nativeProps = (id) => ({
    "aria-label": "Answer " + id + (locked(id) ? ". Correct and locked." : ""),
    disabled: locked(id),
    value: values[id] ?? "",
    onChange: (e) => {
      const value = options.numeric ? Number(e.target.value) : e.target.value;
      choose(id, value);
      const src = soundFor(value === "doesnt" ? "doesn't have" : value);
      if (src) audio.playSound("answer-" + id, src);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        if (e.repeat) e.preventDefault();
      }
    },
    onKeyUp: (e) => {
      if (e.key === "Enter" || e.key === " ") e.stopPropagation();
    },
    style: {
      borderRadius: 0,
      ...(results[id]
        ? {
            borderBottomColor:
              results[id] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
    },
  });
  return {
    ...audio,
    setResults,
    setMessage,
    completionRef,
    values,
    results,
    revealed,
    message,
    locked,
    chosen,
    choose,
    check,
    show,
    reset,
    resultStyle,
    props,
    nativeProps,
  };
}
// Percentages follow the inspected SVG artwork, so regions scale with each picture.
// The larger detail buttons below are alternatives to the compact picture regions.
const DETAILS = [
  {
    id: "dad-hat",
    label: "Dad's hat",
    area: "Dad's head",
    subject: "Dad",
    item: "a hat",
    a: [39, 6, 22, 15],
    b: [40, 8, 18, 14],
  },
  {
    id: "mom-hat",
    label: "Mom's hat",
    area: "Mom's head",
    subject: "Mom",
    item: "a hat",
    a: [57, 9, 19, 8],
    b: [58, 10, 14, 7],
  },
  {
    id: "mom-glasses",
    label: "Mom's sunglasses",
    area: "Mom's eyes",
    subject: "Mom",
    item: "sunglasses",
    a: [57, 18, 14, 6],
    b: [58, 18, 10, 7],
  },
  {
    id: "left-hat",
    label: "Left child's hat",
    area: "Left child's head",
    subject: "the child on the left",
    item: "a hat",
    a: [19, 34, 21, 11],
    b: [22, 35, 15, 10],
  },
  {
    id: "middle-hat",
    label: "Middle child's hat",
    area: "Middle child's head",
    subject: "the child in the middle",
    item: "a hat",
    a: [41, 34, 21, 10],
    b: [41, 35, 19, 10],
  },
  {
    id: "front-hat",
    label: "Front child's hat",
    area: "Front child's head",
    subject: "the child at the front",
    item: "a hat",
    a: [55, 42, 19, 10],
    b: [57, 40, 15, 12],
  },
  {
    id: "left-yoyo",
    label: "Left child's yo-yo",
    area: "Beside the left child's hand",
    subject: "the child on the left",
    item: "a yo-yo",
    a: [17, 73, 7, 7],
    b: [17, 73, 7, 7],
  },
  {
    id: "middle-yoyo",
    label: "Middle child's yo-yo",
    area: "Below the middle child's hand",
    subject: "the child in the middle",
    item: "a yo-yo",
    a: [35, 81, 7, 7],
    b: [35, 81, 7, 7],
  },
  {
    id: "front-yoyo",
    label: "Front child's yo-yo",
    area: "Beside the front child's hand",
    subject: "the child at the front",
    item: "a yo-yo",
    a: [75, 86, 7, 7],
    b: [75, 86, 7, 7],
  },
];
const pictureData = [
  { side: "A", src: img1, audio: clip0 },
  { side: "B", src: img2, audio: clip1 },
];
// Rotate the choices without changing the correct explanation.
const choicesFor = (detail, index) => {
  const choices = [
    {
      value: "a-only",
      text: `In Picture A, ${detail.subject} has ${detail.item}. In Picture B, ${detail.subject} doesn't have ${detail.item}.`,
    },
    {
      value: "b-only",
      text: `In Picture A, ${detail.subject} doesn't have ${detail.item}. In Picture B, ${detail.subject} has ${detail.item}.`,
    },
    {
      value: "both",
      text: `In both pictures, ${detail.subject} has ${detail.item}.`,
    },
  ];
  const offset = index % choices.length;
  return [...choices.slice(offset), ...choices.slice(0, offset)];
};

export default function SpotTheDifference() {
  const a = useAnswers(
    Object.fromEntries(DETAILS.map((detail) => [detail.id, "a-only"])),
  );
  const [selectedDetails, setSelectedDetails] = useState({});
  const [activeDetail, setActiveDetail] = useState(null);
  const [zoom, setZoom] = useState(1);
  const choiceRefs = useRef({});
  const sourceRefs = useRef({});
  const returnSourceRef = useRef(null);
  const pendingFocusRef = useRef(null);
  const locked = (id) => a.locked(id);
  const checkDisabled =
    a.revealed || DETAILS.every((detail) => a.results[detail.id] === "correct");

  // Only deliberate keyboard selection moves focus; focusing never plays audio.
  useLayoutEffect(() => {
    const id = pendingFocusRef.current;
    pendingFocusRef.current = null;
    if (id) choiceRefs.current[id]?.focus();
  });

  const selectDetail = (detail, event, source) => {
    if (locked(detail.id)) {
      a.setMessage(`${detail.label} is correct and locked.`);
      return;
    }
    returnSourceRef.current = source;
    pendingFocusRef.current = event.detail === 0 ? detail.id : null;
    setSelectedDetails((prev) => ({ ...prev, [detail.id]: true }));
    setActiveDetail(detail.id);
    a.setMessage(
      `${detail.label} selected. Choose the sentence that explains the difference between Picture A and Picture B.`,
    );
  };
  const cancelSelection = (event) => {
    if (event.key !== "Escape" || !activeDetail) return;
    event.preventDefault();
    event.stopPropagation();
    pendingFocusRef.current = null;
    setActiveDetail(null);
    a.setMessage("Detail selection closed. Your answers are kept.");
    sourceRefs.current[returnSourceRef.current]?.focus();
  };
  const check = () => {
    if (a.completionRef.current) return;
    pendingFocusRef.current = null;
    if (DETAILS.some((detail) => !selectedDetails[detail.id])) {
      a.stopAudio();
      const message =
        "Please select all nine picture details and choose an explanation for each one.";
      a.setMessage(message);
      ValidationAlert.info(message);
      return;
    }
    setActiveDetail(null);
    a.check();
  };
  const show = () => {
    pendingFocusRef.current = null;
    setSelectedDetails(
      Object.fromEntries(DETAILS.map((detail) => [detail.id, true])),
    );
    setActiveDetail(null);
    a.show();
  };
  const reset = () => {
    pendingFocusRef.current = null;
    returnSourceRef.current = null;
    setSelectedDetails({});
    setActiveDetail(null);
    a.reset();
  };
  const resultColor = (id) =>
    a.results[id] === "correct"
      ? "#16a34a"
      : a.results[id] === "wrong"
        ? "#ef4444"
        : "#2563eb";
  const pictureStyle = (id) => {
    const selected = selectedDetails[id];
    return {
      border: `2px solid ${selected ? resultColor(id) : "transparent"}`,
      backgroundColor: selected
        ? a.results[id] === "correct"
          ? "rgba(22,163,74,.12)"
          : a.results[id] === "wrong"
            ? "rgba(239,68,68,.12)"
            : "rgba(37,99,235,.12)"
        : "transparent",
      boxShadow: activeDetail === id ? "0 0 0 2px #2563eb" : "none",
    };
  };

  return (
    <div
      className="main-container-component mb-10"
      ref={a.rootRef}
      onKeyDown={cancelSelection}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {a.message}
      </div>
      <div className="div-forall" style={{ gap: "35px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="H"
          title="Look and find. Say."
          subTitle="Select the nine differences, then choose a sentence to explain each one."
        />
        <div
          className="flex flex-col gap-5 "
          style={{ minWidth: 0, maxWidth: "100%" }}
        >
       
          <div
            role="group"
            aria-label="Picture zoom"
            className="flex gap-3 flex-wrap justify-center"
          >
            {[1, 1.5, 2].map((level) => (
              <button
                key={level}
                type="button"
                aria-pressed={zoom === level}
                className={`rounded-lg border-2 px-3 py-2 ${focusClass}`}
                style={{
                  minHeight: 44,
                  borderColor: zoom === level ? "#2563eb" : "#d1d5db",
                  backgroundColor: zoom === level ? "#dbeafe" : "white",
                }}
                onKeyDown={activate}
                onKeyUp={release}
                onClick={() => {
                  setZoom(level);
                  a.setMessage(`Pictures zoomed to ${level * 100} percent.`);
                }}
              >
                Zoom {level * 100}%
              </button>
            ))}
          </div>
          <div
            className="grid grid-cols-2 gap-6"
            style={{ justifyItems: "center", minWidth: 0, maxWidth: "100%" }}
          >
            {pictureData.map((picture) => (
              <div
                key={picture.side}
                className="rounded-lg"
                style={{ minWidth: 0, maxWidth: "100%" }}
              >
                <div className="text-center font-bold text-2xl mb-4">
                  <AudioText
                    audioKey={`picture-${picture.side.toLowerCase()}`}
                    src={picture.audio}
                    playSound={a.playSound}
                    playingKey={a.playingKey}
                  >
                    {`Picture ${picture.side}`}
                  </AudioText>
                </div>
                <div
                  role="region"
                  aria-label={`Picture ${picture.side}, scrollable comparison image`}
                  tabIndex={0}
                  className={`rounded-lg ${focusClass}`}
                  style={{
                    maxWidth: "100%",
                    overflow: "auto",
                    maxHeight: 700,
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <div
                    className="relative"
                    style={{
                      width: ((350 * 224.71) / 227.96) * zoom,
                      height: 350 * zoom,
                    }}
                  >
                    <img
                      src={picture.src}
                      alt={IMAGE_DESCRIPTIONS[picture.side]}
                      draggable={false}
                      className="rounded-lg"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                      }}
                    />
                    {DETAILS.map((detail, index) => {
                      const box = picture.side === "A" ? detail.a : detail.b;
                      const source = `${picture.side}-${detail.id}`;
                      return (
                        <button
                          type="button"
                          key={detail.id}
                          ref={(element) => {
                            sourceRefs.current[source] = element;
                          }}
                          data-detail={detail.id}
                          data-picture={picture.side}
                          aria-label={`Picture ${picture.side}, ${detail.area}. ${selectedDetails[detail.id] ? "Selected. " : ""}${locked(detail.id) ? "Correct and locked." : "Select this detail, then choose its explanation below."}`}
                          aria-pressed={!!selectedDetails[detail.id]}
                          aria-disabled={locked(detail.id)}
                          aria-controls={`difference-${detail.id}`}
                          aria-describedby="wb-unit8-p48-q1-help"
                          className={`absolute rounded-lg ${focusClass}`}
                          onClick={(event) =>
                            selectDetail(detail, event, source)
                          }
                          onKeyDown={activate}
                          onKeyUp={release}
                          style={{
                            left: `${box[0]}%`,
                            top: `${box[1]}%`,
                            width: `${box[2]}%`,
                            height: `${box[3]}%`,
                            padding: 0,
                            cursor: locked(detail.id)
                              ? "not-allowed"
                              : "pointer",
                            ...pictureStyle(detail.id),
                          }}
                        >
                          {selectedDetails[detail.id] && (
                            <span
                              aria-hidden="true"
                              className="absolute rounded-full text-white text-xs font-bold"
                              style={{
                                top: -8,
                                left: -8,
                                width: 20,
                                height: 20,
                                backgroundColor: resultColor(detail.id),
                                lineHeight: "20px",
                                pointerEvents: "none",
                              }}
                            >
                              {index + 1}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {DETAILS.map((detail, index) => {
              const selected = !!selectedDetails[detail.id];
              const choices = choicesFor(detail, index);
              const source = `detail-${detail.id}`;
              return (
                <div
                  id={`difference-${detail.id}`}
                  key={detail.id}
                  className="bg-white p-4 rounded-lg border-2 border-gray-200"
                >
                  <button
                    type="button"
                    ref={(element) => {
                      sourceRefs.current[source] = element;
                    }}
                    aria-pressed={selected}
                    aria-disabled={locked(detail.id)}
                    className={`font-semibold mb-3 rounded-lg border-2 px-3 py-2 ${focusClass}`}
                    style={{
                      minHeight: 44,
                      borderColor: selected
                        ? resultColor(detail.id)
                        : "#d1d5db",
                      backgroundColor: selected ? "#dbeafe" : "white",
                    }}
                    onClick={(event) => selectDetail(detail, event, source)}
                    onKeyDown={activate}
                    onKeyUp={release}
                  >{`${index + 1}. ${detail.label}${locked(detail.id) ? " — Correct and locked" : selected ? " — Selected" : " — Select detail"}`}</button>
                  <div
                    role="group"
                    aria-label={`${detail.label}: choose an explanation`}
                    className="relative space-y-2"
                  >
                    {choices.map((choice, choiceIndex) => {
                      const src =
                        detail.id === "mom-glasses" && choice.value !== "both"
                          ? choice.value === "a-only"
                            ? null
                            : null
                          : null;
                      const audioKey = `choice-${detail.id}-${choice.value}`;
                      const playing = a.playingKey === audioKey;
                      const chosen = a.chosen(detail.id, choice.value);
                      return (
                        <button
                          type="button"
                          key={choice.value}
                          ref={(element) => {
                            if (choiceIndex === 0)
                              choiceRefs.current[detail.id] = element;
                          }}
                          {...a.props(
                            detail.id,
                            choice.value,
                            null,
                            choice.text,
                          )}
                          aria-disabled={!selected || locked(detail.id)}
                          tabIndex={selected ? 0 : -1}
                          className={`relative w-full p-3 text-left rounded-lg border-2 transition ${focusClass} ${chosen && a.results[detail.id] === "wrong" ? "border-red-500 bg-red-50" : "bg-gray-100 border-gray-300 hover:border-blue-900"}`}
                          style={{
                            ...a.props(detail.id, choice.value).style,
                            minHeight: 44,
                            cursor:
                              !selected || locked(detail.id)
                                ? "not-allowed"
                                : "pointer",
                            ...(playing
                              ? {
                                  boxShadow: "0 0 0 3px #2563eb",
                                  backgroundColor: "#dbeafe",
                                }
                              : {}),
                          }}
                          onClick={() => {
                            if (!selected) {
                              a.setMessage(`Select ${detail.label} first.`);
                              return;
                            }
                            if (src) a.playSound(audioKey, src);
                            if (locked(detail.id)) {
                              a.setMessage(
                                `${detail.label} is correct and locked.`,
                              );
                              return;
                            }
                            a.choose(detail.id, choice.value);
                            a.setMessage(`${detail.label}: ${choice.text}`);
                          }}
                        >
                          {choice.text}
                          {src && (
                            <span className="sr-only">
                              {" "}
                              Audio:{" "}
                              {choice.value === "a-only"
                                ? "In Picture A, Mom has sunglasses."
                                : "In Picture B, Mom has sunglasses."}
                            </span>
                          )}
                          {chosen && a.results[detail.id] === "wrong" && (
                            <span
                              aria-hidden="true"
                              className="absolute top-1/2 -translate-y-1/2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                            >
                              ✕
                            </span>
                          )}
                          {playing && <SpeakerBadge />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Button
          handleShowAnswer={show}
          handleStartAgain={reset}
          checkAnswers={check}
        />
        <span className="sr-only">
          {checkDisabled
            ? "Check Answer is unavailable. Start Again to try again."
            : "Check Answer is available."}
        </span>
      </div>
    </div>
  );
}
