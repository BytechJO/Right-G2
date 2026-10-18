import burgerReplyClip from "../../../assets/audio/WorkBook/Unit 5/Page 29 - E/Item_002_He_likes_burgers.mp3";
/* eslint-disable react-refresh/only-export-components -- Keep exercise controls local. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_001_I_don't_like_spaghetti.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_002_I_don't_like_rice.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_003_I_like_stew.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_004_I_don't_like_fish.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_005_I_like_chicken.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - B/Item_006_I_like_burgers.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 5/Page 29 - F/Item_001_He_likes_fruit._He_is_happy.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 5/Page 29 - F/Item_002_He_likes_chicken._He_is_happy.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 5/Page 29 - F/Item_003_He_doesn't_like_fish._He_isn't_happy.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 5/Page 29 - F/Item_004_He_doesn't_like_rice._He_isn't_happy.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 5/Page 29 - F/Item_005_She_likes_stew._She_is_happy.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 5/Page 29 - F/Item_006_She_likes_meat._She_is_happy.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 5/Page 29 - F/Item_007_She_doesn't_like_chicken.mp3";
import clip13 from "../../../assets/audio/WorkBook/Unit 5/Page 29 - F/Item_008_She_doesn't_like_meat.mp3";
import clip14 from "../../../assets/audio/WorkBook/Unit 5/Page 29 - F/Item_009_He_likes_fish.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Asset 17.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Asset 18.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Asset 19.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Asset 20.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Asset 21.svg";
import trueIcon from "../../../assets/imgs/true.svg";
const questions = [
  {
    id: 1,
    option1: "He likes fruit. He is happy.",
    option2: "He likes chicken. He is happy.",
    correct: "yes",
    img: img1,
  },
  {
    id: 2,
    option1: "He doesn’t like fish. He isn’t happy.",
    option2: "He doesn’t like rice. He isn’t happy.",
    correct: "no",
    img: img2,
  },
  {
    id: 3,
    option1: "She likes stew. She is happy.",
    option2: "She likes meat. She is happy.",
    correct: "yes",
    img: img3,
  },
  {
    id: 4,
    option1: "She doesn’t like chicken.",
    option2: "She doesn’t like meat.",
    correct: "yes",
    img: img4,
  },
  {
    id: 5,
    option1: "He likes fish.",
    option2: "He likes burgers.",
    correct: "no",
    img: img5,
  },
];
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
  "i don't like spaghetti": clip0,
  "i don't like rice": clip1,
  "i like stew": clip2,
  "i don't like fish": clip3,
  "i like chicken": clip4,
  "i like burgers": clip5,
  "he likes fruit he is happy": clip6,
  "he likes chicken he is happy": clip7,
  "he doesn't like fish he isn't happy": clip8,
  "he doesn't like rice he isn't happy": clip9,
  "she likes stew she is happy": clip10,
  "she likes meat she is happy": clip11,
  "she doesn't like chicken": clip12,
  "she doesn't like meat": clip13,
  "he likes fish": clip14,
  "he likes burgers": burgerReplyClip,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .trim()
    .replace(/\s+/g, " ");
const soundFor = (text) => SOUNDS[normalized(text)];
function useAnswers(correct, options = {}) {
  const audio = useExerciseAudio();
  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const ids = Object.keys(correct),
    complete = ids.every((id) => results[id] === "correct");
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
    if (complete || revealed) return;
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
      ...resultStyle(id, value),
    },
  });
  const nativeProps = (id) => ({
    "aria-label": "Answer " + id + (locked(id) ? ". Correct and locked." : ""),
    disabled: locked(id),
    value: values[id] ?? "",
    onChange: (e) => choose(id, e.target.value),
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
const IMAGE_DESCRIPTIONS = {
  [img1]: "A boy seated at a table with a bowl of fruit.",
  [img2]: "A boy seated at a table with a plate of rice.",
  [img3]: "A woman seated at a table with a bowl of soup.",
  [img4]: "A girl seated at a table with a roast chicken.",
  [img5]: "A boy seated at a table with burgers.",
};
const WB_Unit5_Page29_Q2 = () => {
  const a = useAnswers(
    Object.fromEntries(questions.map((q) => [q.id, q.correct])),
  );
  const { rootRef, message, playingKey } = a;
  const handleShowAnswer = a.show,
    handleStartAgain = a.reset,
    checkAnswers = a.check;
  const answers = a.values;
  const isWrong = (q) => a.results[q.id] === "wrong";
  const labelProps = (q, value) => {
    const phrase = value === "yes" ? q.option1 : q.option2,
      p = a.props(q.id, value, soundFor(phrase), phrase);
    return {
      ...p,
      onClick: (e) => {
        e.preventDefault();
        p.onClick();
      },
      style: {
        position: "relative",
        borderRadius: 4,
      },
    };
  };
  //..
  const boxStyle = (q, value) => a.resultStyle(q.id, value);
  return (
    <div ref={rootRef} className="main-container-component">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
      <div
        className="div-forall mb-10"
        style={{
          gap: "35px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="F"
          title={"Look, read, and write ✓."}
          subTitle={
            "Compare each statement with the picture or text before choosing Check, X, True, or False."
          }
        />

        <div className="space-y-4 mb-5">
          {questions.map((q) => (
            <div key={q.id} className="flex flex-col">
              <div className="grid grid-cols-[1fr_1fr] items-center">
                <div className="flex gap-5">
                  <span className="text-2xl text-blue-900 font-semibold">
                    {q.id}
                  </span>
                  <img
                    src={q.img}
                    className="object-contain"
                    style={{
                      height: "100px",
                      width: "150px",
                    }}
                    alt={IMAGE_DESCRIPTIONS[q.img]}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <label
                      {...labelProps(q, "yes")}
                      className={`${focusClass} flex items-center gap-2 cursor-pointer text-lg`}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={answers[q.id] === "yes"}
                        onChange={() => a.choose(q.id, "yes")}
                        tabIndex={-1}
                        aria-hidden="true"
                        disabled={a.locked(q.id)}
                        className="hidden"
                      />

                      <span
                        style={boxStyle(q, "yes")}
                        className={`w-10 h-10 border-2 border-gray-400 rounded-sm flex items-center justify-center text-2xl font-bold ${answers[q.id] === "yes" ? "text-green-600" : ""}`}
                      >
                        {answers[q.id] === "yes" ? (
                          <img
                            src={trueIcon}
                            style={{
                              height: "25px",
                            }}
                            alt=""
                            aria-hidden="true"
                          />
                        ) : (
                          ""
                        )}
                      </span>

                      {q.option1}
                      {playingKey === "choice-" + q.id + "-yes" && (
                        <SpeakerBadge />
                      )}
                    </label>

                    {isWrong(q) && answers[q.id] === "yes" && (
                      <div className="absolute -top-2 left-7 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <label
                      {...labelProps(q, "no")}
                      className={`${focusClass} flex items-center gap-2 cursor-pointer text-lg`}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={answers[q.id] === "no"}
                        onChange={() => a.choose(q.id, "no")}
                        tabIndex={-1}
                        aria-hidden="true"
                        disabled={a.locked(q.id)}
                        className="hidden"
                      />

                      <span
                        style={boxStyle(q, "no")}
                        className={`w-10 h-10 border-2 border-gray-400 rounded-sm flex items-center justify-center text-2xl font-bold ${answers[q.id] === "no" ? "text-green-600" : ""}`}
                      >
                        {answers[q.id] === "no" ? (
                          <img
                            src={trueIcon}
                            style={{
                              height: "25px",
                            }}
                            alt=""
                            aria-hidden="true"
                          />
                        ) : (
                          ""
                        )}
                      </span>

                      {q.option2}
                      {playingKey === "choice-" + q.id + "-no" && (
                        <SpeakerBadge />
                      )}
                    </label>

                    {isWrong(q) && answers[q.id] === "no" && (
                      <div className="absolute -top-2 left-7 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          checkAnswers={checkAnswers}
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
        />
      </div>
    </div>
  );
};
export default WB_Unit5_Page29_Q2;
