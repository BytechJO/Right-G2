import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - K/Item_001_He_can_swim.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - K/Item_002_He_can_take_a_photo.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 19 - K/Item_003_It_can_fly.mp3";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 31.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 32.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 33.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 34.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 35.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 19/Asset 36.svg";
import trueIcon from "../../../assets/imgs/true.svg";
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


const checkQuestions = [
  {
    id: "k1",
    sentence: "He can swim.",
    options: [
      {
        id: "opt1",
        img: img1,
        isCorrect: true,
      },
      {
        id: "opt2",
        img: img5,
        isCorrect: false,
      },
    ],
  },
  {
    id: "k2",
    sentence: "He can take a photo.",
    options: [
      {
        id: "opt3",
        img: img2,
        isCorrect: true,
      },
      {
        id: "opt4",
        img: img3,
        isCorrect: false,
      },
    ],
  },
  {
    id: "k3",
    sentence: "It can fly.",
    options: [
      {
        id: "opt5",
        img: img6,
        isCorrect: true,
      },
      {
        id: "opt6",
        img: img4,
        isCorrect: false,
      },
    ],
  },
];
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
  "he can swim": sound0,
  "he can take a photo": sound1,
  "it can fly": sound2,
};
const IMAGE_DESCRIPTIONS = {
  [img1]: "A boy swimming in a pool.",
  [img2]: "A boy taking a photograph with a camera.",
  [img3]: "A girl sitting at a picnic table with food.",
  [img4]: "A brown squirrel.",
  [img5]: "A hippopotamus in water.",
  [img6]: "A blue bird flying.",
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
function useSelectAnswers(correct, missingMessage, groups = null) {
  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const audio = useExerciseAudio();
  const completed = Object.keys(correct).every(
    (id) => results[id] === "correct",
  );
  useCheckButton(audio.rootRef, revealed || completed);
  const locked = (id) => revealed || results[id] === "correct";
  const choose = (id, value) => {
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    if (locked(id)) {
      setMessage("Correct answer locked.");
      return;
    }
    setValues((p) => ({
      ...p,
      [id]: value,
    }));
    setResults((p) => ({
      ...p,
      [id]: null,
    }));
    setMessage("Answer " + id + ": " + value + " selected.");
  };
  const check = () => {
    if (revealed || completed) return;
    audio.stopAudio();
    if (
      Object.keys(correct).some(
        (id) => values[id] === undefined || values[id] === "",
      )
    ) {
      ValidationAlert.info(missingMessage);
      setMessage(missingMessage);
      return;
    }
    const next = Object.fromEntries(
      Object.keys(correct).map((id) => [
        id,
        results[id] === "correct" || values[id] === correct[id]
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const units = groups || Object.keys(correct).map((id) => [id]),
      score = units.filter((ids) =>
        ids.every((id) => next[id] === "correct"),
      ).length,
      total = units.length,
      msg = "Score: " + score + " / " + total;
    setMessage(
      msg + ". Correct answers are locked; incorrect answers can be changed.",
    );
    showCheckFeedback(audio.rootRef.current, score === total ? "success" : score ? "warning" : "error", msg);
  };
  const show = () => {
    audio.stopAudio();
    setValues({
      ...correct,
    });
    setResults(
      Object.fromEntries(Object.keys(correct).map((id) => [id, "correct"])),
    );
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    audio.stopAudio();
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    setValues({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const resultStyle = (id) =>
    results[id]
      ? {
          borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
          boxShadow:
            "inset 0 0 0 2px " +
            (results[id] === "correct" ? "#16a34a" : "#ef4444"),
        }
      : {};
  const props = (id, value, src, label = String(value)) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": values[id] === value,
    "aria-disabled": locked(id),
    "aria-label":
      "Question " +
      id +
      ": " +
      label +
      (locked(id)
        ? ". Correct and locked."
        : results[id] === "wrong"
          ? ". Incorrect. Choose again."
          : ""),
    onKeyDown: activate,
    onKeyUp: release,
    onClick: () => {
      if (src) audio.playSound("choice-" + id + "-" + value, src);
      choose(id, value);
    },
    style: {
      position: "relative",
      ...(values[id] === value ? resultStyle(id) : {}),
      ...(typeof value === "boolean" && values[id] === value && !results[id]
        ? {
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const nativeProps = (id) => ({
    "aria-label": "Answer " + id + (locked(id) ? ". Correct and locked." : ""),
    disabled: locked(id),
    value: values[id] ?? "",
    onChange: (e) => choose(id, e.target.value),
    onKeyUp: (e) => {
      if (e.key === "Enter" || e.key === " ") e.stopPropagation();
    },
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        if (e.repeat) e.preventDefault();
      }
    },
    style: {
      borderRadius: 0,
      ...resultStyle(id),
    },
  });
  return {
    ...audio,
    values,
    results,
    revealed,
    message,
    locked,
    choose,
    check,
    show,
    reset,
    props,
    nativeProps,
    resultStyle,
  };
}
const WB_Unit3_Page19_Q3 = () => {
  const interaction = useSelectAnswers(
    Object.fromEntries(
      checkQuestions.map((q) => [q.id, q.options.find((o) => o.isCorrect).id]),
    ),
    "Please answer all questions first!",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const selections = interaction.values;
  const isWrongSelected = (id, option) =>
    interaction.results[id] === "wrong" && selections[id] === option.id;
  const handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset,
    checkAnswers = interaction.check;
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
          gap: "80px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="K"
          title={"Look, read, and write ✓."}
          subTitle={
            "Compare each statement with the picture or text before choosing Check, X, True, or False."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {checkQuestions.map((q, index) => (
            <div key={q.id} className="flex gap-5">
              <span className="font-bold text-blue-900 text-[20px]">
                {index + 1}
              </span>
              <div className="flex flex-col">
                {q.options.map((opt) => (
                  <div
                    key={opt.id}
                    {...interaction.props(
                      q.id,
                      opt.id,
                      undefined,
                      IMAGE_DESCRIPTIONS[opt.img],
                    )}
                    style={{
                      ...interaction.props(q.id, opt.id).style,
                      borderRadius: 12,
                    }}
                    className={`cursor-pointer ${focusClass}`}
                  >
                    <div className="relative inline-block">
                      <img
                        alt={IMAGE_DESCRIPTIONS[opt.img]}
                        src={opt.img}
                        style={{
                          height: "150px",
                        }}
                        className="block"
                      />
                      {/* مربع الاختيار الأساسي */}
                      <div
                        style={{
                          ...(selections[q.id] === opt.id
                            ? {
                                backgroundColor: "#dbeafe",
                                ...interaction.resultStyle(q.id),
                              }
                            : {}),
                        }}
                        className={`absolute bottom-0 right-0 w-10 h-10 border-2 rounded-xl bg-white flex items-center justify-center
    ${isWrongSelected(q.id, opt) ? "border-red-500" : "border-black"}
  `}
                      >
                        {selections[q.id] === opt.id && (
                          <img
                            alt=""
                            aria-hidden="true"
                            src={trueIcon}
                            style={{
                              height: "25px",
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* X أبيض داخل دائرة حمراء للاختيار الخاطئ */}
                    {isWrongSelected(q.id, opt) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>
                ))}
                <p className="text-center text-[20px]">
                  <AudioText
                    audioKey={"sentence-" + q.id}
                    src={SOUNDS[q.sentence.slice(0, -1).toLowerCase()]}
                    playSound={playSound}
                    playingKey={playingKey}
                    className=""
                  >
                    {q.sentence}
                  </AudioText>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};
export default WB_Unit3_Page19_Q3;
