import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - L/Item_001_True.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - L/Item_002_False.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - L/Item_003_Those_are_birds.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - L/Item_004_This_is_a_fox.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - L/Item_005_These_are_clocks.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - L/Item_006_This_is_a_duck.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 2/Page 13 - L/Item_007_Those_are_clouds.mp3";
import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex J 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 13/Ex J 5.svg";
import trueIcon from "../../../assets/imgs/true.svg";

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


// بيانات التمرين: الأسئلة، الصور، والإجابات الصحيحة
const exerciseQuestions = [
  { id: "q1", text: "Those are birds.", img: img1, correctAnswer: false }, // الصورة لطائر واحد، والجملة تقول "birds"
  { id: "q2", text: "This is a fox.", img: img2, correctAnswer: true },
  { id: "q3", text: "These are clocks.", img: img3, correctAnswer: true },
  { id: "q4", text: "This is a duck.", img: img4, correctAnswer: true },
  { id: "q5", text: "Those are clouds.", img: img5, correctAnswer: true },
];

const IMAGE_DESCRIPTIONS = {
  [img1]: "A blue bird perched on a branch.",
  [img2]: "An orange fox head.",
  [img3]: "Five clocks.",
  [img4]: "A duck swimming in water.",
  [img5]: "Three grey clouds.",
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
          ? { boxShadow: "0 0 0 3px #2563eb", backgroundColor: "#dbeafe" }
          : {}),
      }}
    >
      {children}
      {playingKey === audioKey && <SpeakerBadge />}
    </span>
  );
};
const SOUNDS = {
  true: sound0,
  false: sound1,
  "those are birds": sound2,
  "this is a fox": sound3,
  "these are clocks": sound4,
  "this is a duck": sound5,
  "those are clouds": sound6,
};
function useSelectAnswers(correct, missingMessage) {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (
      !completedCheckRef.current ||
      (button?.style && completedCheckRef.current.button !== button)
    ) {
      completedCheckRef.current = {
        button,
        cursor: button?.style?.cursor,
        aria: button?.getAttribute?.("aria-disabled"),
      };
    }
    if (button?.style) {
      button.disabled = true;
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
      previous.button.disabled = false;
      previous.button.style.cursor = previous.cursor || "";
      if (previous.aria == null)
        previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const audio = useExerciseAudio();
  const locked = (id) => revealed || results[id] === "correct";
  const choose = (id, value) => {
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    if (locked(id)) {
      setMessage("This answer is correct and locked.");
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
    setMessage("Question " + id + ": " + value + " selected.");
  };
  const check = (checkEvent) => {
    if (completedCheckRef.current) {
      completeCheck(checkEvent);
      return;
    }

    if (revealed) return;
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
    const score = Object.values(next).filter((x) => x === "correct").length,
      total = Object.keys(correct).length,
      msg = "Score: " + score + " / " + total;
    setMessage(
      msg + ". Correct answers are locked. Incorrect answers can be changed.",
    );
    ((score === total ? "success" : score ? "warning" : "error") ===
      "success" && completeCheck(checkEvent),
      showCheckFeedback(audio.rootRef.current, score === total ? "success" : score ? "warning" : "error", msg));
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
    resetCompletedCheck();

    audio.stopAudio();
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    setValues({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const props = (id, value, src) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": values[id] === value,
    "aria-disabled": locked(id),
    "aria-label":
      "Question " +
      id +
      ": " +
      value +
      (locked(id)
        ? ". Correct answer locked."
        : results[id] === "wrong"
          ? ". Incorrect. Choose another answer."
          : ""),
    onKeyDown: activate,
    onKeyUp: release,
    onClick: () => {
      if (src) audio.playSound("choice-" + id + "-" + value, src);
      choose(id, value);
    },
    style: {
      position: "relative",
      ...(values[id] === value && results[id]
        ? {
            boxShadow:
              "inset 0 0 0 2px " +
              (results[id] === "correct" ? "#16a34a" : "#ef4444"),
            borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
            borderBottomColor:
              results[id] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
      ...(audio.playingKey === "choice-" + id + "-" + value
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
    style: {
      borderRadius: 0,
      ...(results[id]
        ? {
            borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
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
    choose,
    check,
    show,
    reset,
    props,
    nativeProps,
  };
}
//.
const WB_Unit2_Page13_Q2 = () => {
  const interaction = useSelectAnswers(
    Object.fromEntries(exerciseQuestions.map((q) => [q.id, q.correctAnswer])),
    "Please answer all questions before checking.",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const checkDisabled =
    interaction.revealed ||
    exerciseQuestions.every(
      (question) => interaction.results[question.id] === "correct",
    );
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = checkDisabled;
    button.style.cursor = checkDisabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(checkDisabled));
  }, [checkDisabled, rootRef]);
  const userAnswers = interaction.values;
  const handleShowAnswer = interaction.show,
    handleStartAgain = interaction.reset,
    checkAnswers = interaction.check;
  const getCheckboxClass = (id, option) =>
    userAnswers[id] === option
      ? interaction.results[id] === "correct"
        ? "border-green-500"
        : interaction.results[id] === "wrong"
          ? "border-red-500"
          : "border-blue-500 bg-blue-100"
      : "border-gray-300 bg-white";

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
      <div className="div-forall" style={{ gap: "25px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="J"
          title={
            <>
              Look, read, and write <span style={{ color: "navy" }}>✓</span>.
            </>
          }
          subTitle={"Compare each statement with the picture or text before choosing Check, X, True, or False."}
        />

        <div className="flex flex-col justify-start">
          {exerciseQuestions.map((question, index) => (
            <div
              key={question.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-6 p-3 rounded-lg hover:bg-gray-50"
            >
              <div className="w-66 flex items-center justify-center">
                {/* الصورة */}
                <img
                  src={question.img}
                  alt={IMAGE_DESCRIPTIONS[question.img] || ""}
                  className="object-contain"
                  style={{ height: "80px" }}
                />
              </div>
              {/* النص */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-600 text-xl">
                  {index + 1}
                </span>
                <p className="text-xl text-gray-800">
                  <AudioText
                    audioKey={"text-" + question.id}
                    src={SOUNDS[question.text.replace(/\.$/, "").toLowerCase()]}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {question.text}
                  </AudioText>
                </p>
              </div>

              {/* مربعات الاختيار (True/False) */}
              <div className="flex items-center gap-x-4 relative">
                {interaction.results[question.id] === "wrong" &&
                  userAnswers[question.id] !== undefined &&
                  userAnswers[question.id] !== question.correctAnswer && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <span className="text-white text-xs font-bold"> ✕</span>
                    </div>
                  )}
                {/* True */}
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-gray-600 mb-1">
                      True
                    </span>
                  )}
                  <div
                    {...interaction.props(question.id, true, SOUNDS["true"])}
                    className={`${focusClass} w-10 h-10 border-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${getCheckboxClass(question.id, true)}`}
                  >
                    {playingKey === "choice-" + question.id + "-true" && (
                      <SpeakerBadge />
                    )}
                    {userAnswers[question.id] === true && (
                      <img
                        src={trueIcon}
                        alt=""
                        aria-hidden="true"
                        style={{ height: "25px" }}
                      />
                    )}
                  </div>
                </div>
                {/* False */}
                <div className="flex flex-col items-center">
                  {index === 0 && (
                    <span className="font-semibold text-gray-600 mb-1">
                      False
                    </span>
                  )}
                  <div
                    {...interaction.props(question.id, false, SOUNDS["false"])}
                    className={`${focusClass} w-10 h-10 border-2 rounded-md cursor-pointer flex items-center justify-center transition-all ${getCheckboxClass(question.id, false)}`}
                  >
                    {playingKey === "choice-" + question.id + "-false" && (
                      <SpeakerBadge />
                    )}
                    {userAnswers[question.id] === false && (
                      <img
                        src={trueIcon}
                        alt=""
                        aria-hidden="true"
                        style={{ height: "25px" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* أزرار التحكم */}
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

export default WB_Unit2_Page13_Q2;
