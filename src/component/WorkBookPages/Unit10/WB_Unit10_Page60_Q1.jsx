/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import imgRun from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 60/SVG/Asset 1.svg";
import imgDrink from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 60/SVG/Asset 2.svg";
import imgListen from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 60/SVG/Asset 3.svg";
import imgWatch from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 60/SVG/Asset 4.svg";
import imgWork from "../../../assets/imgs/WorkBook/Right Int WB G2 U10 Folder/Page 60/SVG/Asset 5.svg";
import { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 10/Page 60 - F/Item_001_They're_(run).mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 10/Page 60 - F/Item_002_It's_(drink)_..._milk.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 10/Page 60 - F/Item_003_He's_(listen)_..._to_the_radio.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 10/Page 60 - F/Item_004_I'm_(watch)_..._a_movie.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 10/Page 60 - F/Item_005_We're_(work)_..._on_the_computer.mp3";
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
  "they're (run)": clip0,
  "it's (drink) milk": clip1,
  "he's (listen) to the radio": clip2,
  "i'm (watch) a movie": clip3,
  "we're (work) on the computer": clip4,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [imgRun]: "A woman on a couch watching a television.",
  [imgDrink]: "A white cat drinking from a bowl.",
  [imgListen]: "Two children running outdoors.",
  [imgWatch]: "A man sitting beside a radio.",
  [imgWork]: "Two people using a computer.",
};
function WB_Unit10_Page60_Q1() {
  const CORRECT_F = {
    q1: "running",
    q2: "drinking",
    q3: "listening",
    q4: "watching",
    q5: "working",
  };
  const CORRECT_F_NUM = {
    q1_num: "4",
    q2_num: "2",
    q3_num: "1",
    q4_num: "3",
    q5_num: "5",
  };
  const ALL_CORRECT = {
    ...CORRECT_F,
    ...CORRECT_F_NUM,
  };
  const OPTIONS = [
    "running",
    "drinking",
    "listening",
    "watching",
    "working",
    "eating",
    "sleeping",
  ];
  const QUESTIONS = [
    {
      id: "q1",
      img: imgRun,
      num: "1",
      prefix: "They're (run) ",
      suffix: ".",
    },
    {
      id: "q2",
      img: imgDrink,
      num: "2",
      prefix: "It's (drink) ",
      suffix: " milk.",
    },
    {
      id: "q3",
      img: imgListen,
      num: "3",
      prefix: "He's (listen) ",
      suffix: " to the radio.",
    },
    {
      id: "q4",
      img: imgWatch,
      num: "4",
      prefix: "I'm (watch) ",
      suffix: " a movie.",
    },
    {
      id: "q5",
      img: imgWork,
      num: "5",
      prefix: "We're (work) ",
      suffix: " on the computer.",
    },
  ];

  // ⭐ positions لكل صورة (عدليهم حسب مكان المربع الأبيض)
  // ⭐ positions لكل صورة (عدليهم حسب مكان المربع الأبيض)
  const positions = {
    q1: {
      top: "12%",
      left: "89%",
    },
    q2: {
      top: "12%",
      left: "89%",
    },
    q3: {
      top: "12%",
      left: "89%",
    },
    q4: {
      top: "12%",
      left: "89%",
    },
    q5: {
      top: "12%",
      left: "90%",
    },
  };
  const PICTURES = [
    QUESTIONS[3],
    QUESTIONS[2],
    QUESTIONS[0],
    QUESTIONS[4],
    QUESTIONS[1],
  ];
  const a = useAnswers(ALL_CORRECT, {
    missing: "Please complete all answers!",
  });
  const { rootRef, message } = a;
  const answers = a.values;
  const checkAnswers = a.check,
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
          gap: "35px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="F"
          title="Complete. Look and match."
          subTitle={
            "Change each verb to its -ing form first, then match the completed sentence to the picture."
          }
        />

        <div className="flex flex-col gap-5">
          {/* ⭐ الصور */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mx-auto w-fit">
            {PICTURES.map((q, pictureIndex) => {
              const pos = positions[q.id];
              return (
                <div
                  key={q.id}
                  className={
                    "relative sm:col-span-2 " +
                    (pictureIndex === 3
                      ? "sm:col-start-2"
                      : pictureIndex === 4
                        ? "sm:col-start-4"
                        : "")
                  }
                >
                  <div className="relative w-fit">
                    <img
                      src={q.img}
                      className="object-contain"
                      style={{
                        height: "120px",
                      }}
                      alt={IMAGE_DESCRIPTIONS[q.img]}
                    />

                    {/* ⭐ select داخل الصورة */}
                    <div
                      className="absolute"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <select
                        className={
                          `text-center w-9 h-8 rounded-md font-bold
                          focus:outline-none focus:ring-0
                          ${a.results[q.id + "_num"] ? (answers[`${q.id}_num`] === CORRECT_F_NUM[`${q.id}_num`] ? "border-gray-300" : "border-red-500") : "border-blue-900"}` +
                          " focus-visible:rounded-sm! " +
                          focusClass
                        }
                        {...a.nativeProps(q.id + "_num")}
                        aria-label={
                          "Picture: " +
                          IMAGE_DESCRIPTIONS[q.img] +
                          " Choose its sentence number."
                        }
                        onChange={(e) => {
                          a.stopAudio();
                          a.choose(q.id + "_num", e.target.value);
                        }}
                        style={{
                          ...a.nativeProps(q.id + "_num").style,
                          borderRadius: 6,
                          ...(a.results[q.id + "_num"]
                            ? {
                                boxShadow:
                                  "inset 0 0 0 2px " +
                                  (a.results[q.id + "_num"] === "correct"
                                    ? "#16a34a"
                                    : "#ef4444"),
                                borderColor:
                                  a.results[q.id + "_num"] === "correct"
                                    ? "#16a34a"
                                    : "#ef4444",
                              }
                            : {}),
                        }}
                      >
                        <option value=""></option>
                        {QUESTIONS.map((opt) => (
                          <option key={opt.id} value={opt.num}>
                            {opt.num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* الجمل */}
          <div className="space-y-4 max-w-full">
            {QUESTIONS.map((q) => (
              <div
                key={q.id}
                className="flex items-center text-lg p-2 rounded-lg hover:bg-gray-50"
              >
                <span className="font-bold text-blue-800 w-8 text-2xl">
                  {q.num}
                </span>

                <div
                  className={"flex-1 flex items-center flex-wrap " + focusClass}
                  role="group"
                  tabIndex={0}
                  aria-label={"Hear sentence " + q.num + " prompt"}
                  onClick={(e) => {
                    if (!e.target.closest("select"))
                      a.playSound(
                        "prompt-" + q.id,
                        soundFor(q.prefix + q.suffix),
                      );
                  }}
                  onKeyDown={(e) => {
                    if (e.target === e.currentTarget) activate(e);
                  }}
                  onKeyUp={(e) => {
                    if (e.target === e.currentTarget) release(e);
                  }}
                  style={{
                    position: "relative",
                    borderRadius: 8,
                    ...(a.playingKey === "prompt-" + q.id
                      ? {
                          boxShadow: "0 0 0 3px #2563eb",
                          backgroundColor: "#dbeafe",
                        }
                      : {}),
                  }}
                >
                  <span className="text-gray-700 text-2xl">{q.prefix}</span>

                  <div className="relative inline-block mx-2">
                    {a.results[q.id] === "wrong" &&
                      answers[q.id] &&
                      answers[q.id] !== CORRECT_F[q.id] && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow z-10">
                          ✕
                        </div>
                      )}

                    <select
                      className={
                        `p-1 border-b-2 bg-transparent font-bold
                        focus:outline-none focus:ring-0
                        ${a.results[q.id] ? (answers[q.id] === CORRECT_F[q.id] ? "border-gray-300" : "border-red-500") : "border-gray-300"}` +
                        " focus-visible:rounded-sm! " +
                        focusClass
                      }
                      {...a.nativeProps(q.id)}
                      aria-label={
                        "Sentence " + q.num + ". Choose the missing verb."
                      }
                      onChange={(e) => {
                        a.stopAudio();
                        a.choose(q.id, e.target.value);
                      }}
                      style={{
                        ...a.nativeProps(q.id).style,
                      }}
                    >
                      <option value="">...</option>
                      {OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="text-gray-700 text-2xl">{q.suffix}</span>
                  <>{a.playingKey === "prompt-" + q.id && <SpeakerBadge />}</>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            handleStartAgain={handleReset}
            checkAnswers={checkAnswers}
            handleShowAnswer={a.show}
          />
        </div>
      </div>
    </div>
  );
}
export default WB_Unit10_Page60_Q1;
