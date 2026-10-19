/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import imgIceCream from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 9.svg";
import imgSwimming from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 10.svg";
import imgAtSchool from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 12.svg";
import imgAtPark from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 13.svg";
import imgBoyAvatar from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 11.svg";
import imgBoyAvatar2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 59/SVG/Asset 14.svg";
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - E/Item_001_Look_at_them.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - E/Item_002_What_are_they_doing.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - E/Item_003_They.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - E/Item_004_ice_cream.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - E/Item_005_in_the_pool.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - E/Item_006_Look_at_Hansel_and_me.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - E/Item_007_What_are_we_doing.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - E/Item_008_We.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - E/Item_009_at_school.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 10/Page 59 - E/Item_010_at_the_park.mp3";
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
      onClick={(e) => {
        e.stopPropagation();
        playSound(audioKey, src);
      }}
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
  "look at them": clip0,
  "what are they doing": clip1,
  they: clip2,
  "ice cream": clip3,
  "in the pool": clip4,
  "look at hansel and me": clip5,
  "what are we doing": clip6,
  we: clip7,
  "at school": clip8,
  "at the park": clip9,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [imgIceCream]: "Two children holding ice cream cones.",
  [imgSwimming]: "Two children in a swimming pool.",
  [imgAtSchool]: "Two boys in a classroom.",
  [imgAtPark]: "Two boys playing with a soccer ball on grass.",
  [imgBoyAvatar]: "A smiling boy with dark hair.",
  [imgBoyAvatar2]: "A smiling boy with dark hair.",
};
function CustomSelect({ id, a, OPTIONS, CORRECT_E }) {
  const value = a.values[id];
  return (
    <div className="relative inline-block mx-1">
      {/* ❌ Wrong Answer */}
      {!!a.results[id] && value && value !== CORRECT_E[id] && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow">
          ✕
        </div>
      )}

      <select
        className={
          `w-35 cursor-pointer p-1 border-b-2 bg-transparent focus:outline-none ${!!a.results[id] && value && value !== CORRECT_E[id] && "border-red-500"}` +
          " " +
          focusClass +
          " focus-visible:rounded-sm!"
        }
        {...a.nativeProps(id)}
        style={{
          ...{},
          ...a.nativeProps(id).style,
        }}
      >
        <option value="">...</option>
        {OPTIONS[id].map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
function WB_Unit10_Page59_Q2() {
  const CORRECT_E = {
    q1: "are eating",
    q2: "are swimming",
    q3: "are talking",
    q4: "are playing",
  };
  const OPTIONS = {
    q1: ["are eating", "is eating", "are playing"],
    q2: ["are swimming", "is swimming", "are running"],
    q3: ["are talking", "is talking", "am talking"],
    q4: ["are playing", "is playing", "am playing"],
  };
  const a = useAnswers(CORRECT_E);
  const { rootRef, message, playingKey, playSound } = a;
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
      <div className="div-forall">
        <ExerciseHeader
          isWorkbook
          sectionLetter="E"
          title={<>Look and write. Read.</>}
          subTitle={
            "Look at each scene, decide who is doing the action, then complete the present-continuous sentence."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
          <div className="hidden md:block absolute left-1/2 -bottom-58 -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={imgBoyAvatar}
              className="object-contain mt-12"
              style={{
                height: "180px",
              }}
              alt={
                IMAGE_DESCRIPTIONS[imgBoyAvatar] ||
                "Illustration for this question"
              }
            />
            <img
              src={imgBoyAvatar2}
              style={{
                height: "180px",
              }}
              className="object-contain mt-20"
              alt={
                IMAGE_DESCRIPTIONS[imgBoyAvatar2] ||
                "Illustration for this question"
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-bold text-blue-600">1</span>
              <img
                src={imgIceCream}
                className="object-cover"
                style={{
                  height: "100px",
                  width: "auto",
                }}
                alt={
                  IMAGE_DESCRIPTIONS[imgIceCream] ||
                  "Illustration for this question"
                }
              />
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 relative">
              <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 border-l border-t border-gray-100"></div>
              <p className="text-gray-700 text-lg">
                <AudioText
                  audioKey={"fragment-1288"}
                  src={soundFor(" They ")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={a.picked ? -1 : 0}
                >
                  {" They "}
                </AudioText>
                <CustomSelect
                  id="q1"
                  a={a}
                  OPTIONS={OPTIONS}
                  CORRECT_E={CORRECT_E}
                />
                <AudioText
                  audioKey={"fragment-1335"}
                  src={soundFor(" ice cream. ")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={a.picked ? -1 : 0}
                >
                  {" ice cream. "}
                </AudioText>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 justify-end">
              <img
                src={imgSwimming}
                className="object-cover"
                style={{
                  height: "100px",
                  width: "auto",
                }}
                alt={
                  IMAGE_DESCRIPTIONS[imgSwimming] ||
                  "Illustration for this question"
                }
              />
              <span className="font-bold text-blue-600">2</span>
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 relative">
              <div className="absolute -top-2 right-4 w-4 h-4 rotate-45 border-l border-t border-gray-100"></div>
              <p className="text-gray-700 text-lg">
                <AudioText
                  audioKey={"fragment-2003"}
                  src={soundFor(" They ")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={a.picked ? -1 : 0}
                >
                  {" They "}
                </AudioText>
                <CustomSelect
                  id="q2"
                  a={a}
                  OPTIONS={OPTIONS}
                  CORRECT_E={CORRECT_E}
                />
                <AudioText
                  audioKey={"fragment-2050"}
                  src={soundFor(" in the pool. ")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={a.picked ? -1 : 0}
                >
                  {" in the pool. "}
                </AudioText>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-bold text-blue-600">3</span>
              <img
                src={imgAtSchool}
                className="object-cover"
                style={{
                  height: "100px",
                  width: "auto",
                }}
                alt={
                  IMAGE_DESCRIPTIONS[imgAtSchool] ||
                  "Illustration for this question"
                }
              />
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 relative">
              <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 border-l border-t border-gray-100"></div>
              <p className="text-gray-700 text-lg">
                <AudioText
                  audioKey={"fragment-2705"}
                  src={soundFor(" We ")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={a.picked ? -1 : 0}
                >
                  {" We "}
                </AudioText>
                <CustomSelect
                  id="q3"
                  a={a}
                  OPTIONS={OPTIONS}
                  CORRECT_E={CORRECT_E}
                />
                <AudioText
                  audioKey={"fragment-2750"}
                  src={soundFor(" at school. ")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={a.picked ? -1 : 0}
                >
                  {" at school. "}
                </AudioText>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 justify-end">
              <img
                src={imgAtPark}
                className="object-cover"
                style={{
                  height: "100px",
                  width: "auto",
                }}
                alt={
                  IMAGE_DESCRIPTIONS[imgAtPark] ||
                  "Illustration for this question"
                }
              />
              <span className="font-bold text-blue-600">4</span>
            </div>
            <div className="p-4 rounded-2xl border border-gray-100 relative">
              <div className="absolute -top-2 right-4 w-4 h-4 rotate-45 border-l border-t border-gray-100"></div>
              <p className="text-gray-700 text-lg">
                <AudioText
                  audioKey={"fragment-3412"}
                  src={soundFor(" We ")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={a.picked ? -1 : 0}
                >
                  {" We "}
                </AudioText>
                <CustomSelect
                  id="q4"
                  a={a}
                  OPTIONS={OPTIONS}
                  CORRECT_E={CORRECT_E}
                />
                <AudioText
                  audioKey={"fragment-3457"}
                  src={soundFor(" at the park. ")}
                  playSound={playSound}
                  playingKey={playingKey}
                  tabIndex={a.picked ? -1 : 0}
                >
                  {" at the park. "}
                </AudioText>
              </p>
            </div>
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
export default WB_Unit10_Page59_Q2;
