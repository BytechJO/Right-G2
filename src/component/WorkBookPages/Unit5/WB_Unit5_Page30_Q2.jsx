/* eslint-disable react-refresh/only-export-components -- Keep exercise controls local. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_001_Megan_likes_fruit,_vegetables,_and_milk._She_doesn't_like_bread_or_fish.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_002_Megan's_brother,_Jimmy,_likes_vegetables,_nuts,_and_soup._He_doesn't_lik.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_003_Megan's_dad_likes.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_004_candy.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_005_pasta.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_006_Megan_doesn't_like.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_007_vegetables.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_008_bread.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_009_fish.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_010_Megan's_mom_likes.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_011_meat.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_012_soda.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_013_Megan's_brother_doesn't_like.mp3";
import clip13 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_014_nuts.mp3";
import clip14 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_015_burgers.mp3";
import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
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
  "megan likes fruit vegetables and milk she doesn't like bread or fish": clip0,
  "megan's brother jimmy likes vegetables nuts and soup he doesn't lik": clip1,
  "megan's dad likes": clip2,
  candy: clip3,
  pasta: clip4,
  "megan doesn't like": clip5,
  vegetables: clip6,
  bread: clip7,
  fish: clip8,
  "megan's mom likes": clip9,
  meat: clip10,
  soda: clip11,
  "megan's brother doesn't like": clip12,
  nuts: clip13,
  burgers: clip14,
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
export default function WB_Unit5_Page30_Q2() {
  const questions = [
    {
      id: 1,
      text: "Megan’s dad likes ...",
      options: ["candy", "pasta", "bread"],
    },
    {
      id: 2,
      text: "Megan doesn’t like ...",
      options: ["vegetables", "bread", "fish"],
    },
    {
      id: 3,
      text: "Megan’s mom likes ...",
      options: ["meat", "soda", "vegetables"],
    },
    {
      id: 4,
      text: "Megan’s brother doesn’t like ...",
      options: ["candy", "nuts", "burgers"],
    },
  ];
  const correctAnswers = {
    1: ["pasta", "bread"],
    2: ["bread", "fish"],
    3: ["meat", "vegetables"],
    4: ["candy", "burgers"],
  };
  const a = useAnswers(correctAnswers, {
    limit: 2,
  });
  const { rootRef, message, playingKey, playSound } = a;
  const handleShowAnswer = a.show,
    handleStartAgain = a.reset,
    checkAnswers = a.check;
  const answers = a.values;
  const isWrong = (id) => a.results[id] === "wrong";
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
        className="div-forall"
        style={{
          gap: "30px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="H"
          title={<>Look, read, and circle</>}
          subTitle={"Read the whole food paragraph first, then return to it for each multiple-choice question."}
        />

        <div className="flex flex-col gap-6">
          <p className="text-gray-700 leading-relaxed text-[18px]">
            <AudioText
              audioKey="paragraph-megan"
              src={clip0}
              playSound={playSound}
              playingKey={playingKey}
            >
            Megan likes fruit, vegetables, and milk. She doesn’t like bread or
            fish. Her mom likes meat and vegetables. She doesn’t like candy,
            fruit, or soda. Her dad likes pasta, chicken, and bread. He doesn’t
            like coffee, tea, or milk.
            </AudioText>{" "}
            <AudioText
              audioKey="paragraph-jimmy"
              src={clip1}
              playSound={playSound}
              playingKey={playingKey}
            >
            Megan’s brother, Jimmy, likes vegetables,
            nuts, and soup. He doesn’t like candy, burgers, or fruit.
            </AudioText>
          </p>

          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="relative p-3 rounded-lg">
                <div className="flex">
                  <span className="text-[18px] mb-2 w-80">
                    {" "}
                    {q.id}.{" "}
                    <AudioText
                      audioKey={"question-" + q.id}
                      src={soundFor(q.text)}
                      playSound={playSound}
                      playingKey={playingKey}
                      className=""
                    >
                      {q.text}
                    </AudioText>
                  </span>
                  <div className="flex gap-10">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        {...a.props(q.id, opt, soundFor(opt))}
                        style={{
                          ...a.props(q.id, opt).style,
                          borderRadius: "9999px",
                        }}
                        className={`${focusClass} w-30 h-10 px-3 py-1 border rounded-full transition
                    ${answers[q.id]?.includes(opt) ? "border-2 border-blue-900" : "border-gray-500 hover:border-blue-900 hover:border-2"}`}
                      >
                        {opt}
                        {playingKey === "choice-" + q.id + "-" + opt && (
                          <SpeakerBadge />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {isWrong(q.id) && (
                  <div className="absolute top-2 left-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                    ✕
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
}
