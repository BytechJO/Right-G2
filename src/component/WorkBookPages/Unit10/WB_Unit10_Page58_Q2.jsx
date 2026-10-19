/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import imgGirl from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 7.svg";
import imgBoy from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 58/SVG/Asset 8.svg";
// check
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - C/Item_001_She_is_wearing_a_color_T-shirt,_a_color_hat,_color_socks,_and_color_shoe.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 58 - C/Item_002_He_is_wearing_a_color_T-shirt,_a_color_cap,_color_socks_and_color_shoes.mp3";
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
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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
    audio.rootRef.current
      ?.querySelectorAll("audio")
      .forEach((player) => player.pause());
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
      else audio.stopAudio();
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
const SOUNDS = {
  "she is wearing a color t-shirt a color hat color socks and color shoe":
    clip0,
  "he is wearing a color t-shirt a color cap color socks and color shoes":
    clip1,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [imgGirl]:
    "A child in a green hat and blue T-shirt holding red flowers, wearing yellow socks and black shoes.",
  [imgBoy]:
    "A boy in a yellow T-shirt and red cap, with green socks and black shoes.",
};
function ColorSelect({ id, a, COLORS, COLOR_STYLES, CORRECT_C }) {
  const value = a.values[id];
  return (
    <div className="relative inline-block">
      {/* ❌ Wrong Answer */}
      {!!a.results[id] && value && value !== CORRECT_C[id] && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
          ✕
        </div>
      )}

      <select
        className={
          `mx-1 p-1 border-b-2 bg-transparent focus:outline-none transition-all ${a.results[id] ? (value === CORRECT_C[id] ? "border-gray-300" : "border-red-500") : "border-gray-300 focus:border-blue-400"}` +
          " " +
          focusClass +
          " focus-visible:rounded-sm!"
        }
        {...a.nativeProps(id)}
        style={{
          ...{
            color: value ? COLOR_STYLES[value] : "#999",
            fontWeight: "700",
          },
          ...a.nativeProps(id).style,
        }}
      >
        <option value="">color</option>
        {COLORS.map((c) => (
          <option
            key={c}
            value={c}
            style={{
              color: COLOR_STYLES[c],
              fontWeight: "700",
            }}
          >
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
function WB_Unit10_Page58_Q2() {
  const COLORS = ["blue", "green", "yellow", "black", "red", "white", "pink"];
  const CORRECT_C = {
    c1_1: "blue",
    c1_2: "green",
    c1_3: "yellow",
    c1_4: "black",
    c1_5: "red",
    c2_1: "yellow",
    c2_2: "red",
    c2_3: "green",
    c2_4: "black",
  };
  const COLOR_STYLES = {
    blue: "#2563eb",
    green: "#16a34a",
    yellow: "#eab308",
    black: "#000000",
    red: "#dc2626",
    white: "#9ca3af",
    // بدل الأبيض الرمادي عشان يبين
    pink: "#ec4899",
  };
  const a = useAnswers(CORRECT_C);
  const { rootRef, message, playingKey } = a;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleReset = a.reset;
  return (
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
          gap: "55px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="C"
          title={<>Read, look, and write.</>}
          subTitle={"Look closely at the clothing colors and items, then complete each sentence from left to right."}
        />

        <div className="space-y-4">
          {/* الفقرة الأولى - البنت */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <img
              src={imgGirl}
              className="object-contain"
              style={{
                height: "200px",
                width: "auto",
              }}
              alt={
                IMAGE_DESCRIPTIONS[imgGirl] || "Illustration for this question"
              }
            />
            <div
              className={
                "flex-1 text-xl leading-loose text-gray-700 w-[90%]" +
                " " +
                focusClass
              }
              role="group"
              tabIndex={0}
              aria-label={
                "Picture 1 description. Press Enter or Space to listen."
              }
              onClick={(e) => {
                if (!e.target.closest("button,select"))
                  a.playSound("description-1", clip0);
              }}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget) activate(e);
              }}
              onKeyUp={(e) => {
                if (e.target === e.currentTarget) release(e);
              }}
              style={{
                ...{},
                position: "relative",
                borderRadius: 8,
                ...(playingKey === "description-1"
                  ? {
                      boxShadow: "0 0 0 3px #2563eb",
                      backgroundColor: "#dbeafe",
                    }
                  : {}),
              }}
            >
              <span className="font-bold text-blue-900 mr-2">1</span>
              She is wearing a{" "}
              <ColorSelect
                id="c1_1"
                a={a}
                COLORS={COLORS}
                COLOR_STYLES={COLOR_STYLES}
                CORRECT_C={CORRECT_C}
              />{" "}
              T-shirt, a{" "}
              <ColorSelect
                id="c1_2"
                a={a}
                COLORS={COLORS}
                COLOR_STYLES={COLOR_STYLES}
                CORRECT_C={CORRECT_C}
              />{" "}
              hat,
              <ColorSelect
                id="c1_3"
                a={a}
                COLORS={COLORS}
                COLOR_STYLES={COLOR_STYLES}
                CORRECT_C={CORRECT_C}
              />{" "}
              socks, and{" "}
              <ColorSelect
                id="c1_4"
                a={a}
                COLORS={COLORS}
                COLOR_STYLES={COLOR_STYLES}
                CORRECT_C={CORRECT_C}
              />{" "}
              shoes. She is carrying some{" "}
              <ColorSelect
                id="c1_5"
                a={a}
                COLORS={COLORS}
                COLOR_STYLES={COLOR_STYLES}
                CORRECT_C={CORRECT_C}
              />{" "}
              flowers.
              <>{playingKey === "description-1" && <SpeakerBadge />}</>
            </div>
          </div>

          {/* الفقرة الثانية - الولد */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div
              className={
                "flex-1 text-xl leading-loose text-gray-700" + " " + focusClass
              }
              role="group"
              tabIndex={0}
              aria-label={
                "Picture 2 description. Press Enter or Space to listen."
              }
              onClick={(e) => {
                if (!e.target.closest("button,select"))
                  a.playSound("description-2", clip1);
              }}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget) activate(e);
              }}
              onKeyUp={(e) => {
                if (e.target === e.currentTarget) release(e);
              }}
              style={{
                ...{},
                position: "relative",
                borderRadius: 8,
                ...(playingKey === "description-2"
                  ? {
                      boxShadow: "0 0 0 3px #2563eb",
                      backgroundColor: "#dbeafe",
                    }
                  : {}),
              }}
            >
              <span className="font-bold text-blue-900 mr-2">2</span>
              He is wearing a{" "}
              <ColorSelect
                id="c2_1"
                a={a}
                COLORS={COLORS}
                COLOR_STYLES={COLOR_STYLES}
                CORRECT_C={CORRECT_C}
              />{" "}
              T-shirt, a{" "}
              <ColorSelect
                id="c2_2"
                a={a}
                COLORS={COLORS}
                COLOR_STYLES={COLOR_STYLES}
                CORRECT_C={CORRECT_C}
              />{" "}
              cap,
              <ColorSelect
                id="c2_3"
                a={a}
                COLORS={COLORS}
                COLOR_STYLES={COLOR_STYLES}
                CORRECT_C={CORRECT_C}
              />{" "}
              socks and{" "}
              <ColorSelect
                id="c2_4"
                a={a}
                COLORS={COLORS}
                COLOR_STYLES={COLOR_STYLES}
                CORRECT_C={CORRECT_C}
              />{" "}
              shoes.
              <>{playingKey === "description-2" && <SpeakerBadge />}</>
            </div>
            <img
              src={imgBoy}
              className="object-contain"
              style={{
                height: "200px",
                width: "120px",
              }}
              alt={
                IMAGE_DESCRIPTIONS[imgBoy] || "Illustration for this question"
              }
            />
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
            handleShowAnswer={handleShowAnswer}
          />
        </div>
      </div>
    </div>
  );
}
export default WB_Unit10_Page58_Q2;
