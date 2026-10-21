import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import theseAudio from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_004_These.mp3";
import thoseAudio from "../../../assets/audio/WorkBook/Unit 2/Page 10 - C/Item_003_Those.mp3";
import dogsAudio from "../../../assets/audio/WorkBook/Unit 2/Page 12 - H/Item_001_dogs.mp3";
import rabbitsAudio from "../../../assets/audio/WorkBook/Unit 2/Page 12 - H/Item_004_rabbits.mp3";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 12 - G/Item_001_are_ducks.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 12 - G/Item_002_are_flowers.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 12 - G/Item_003_are_butterflies.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 12 - G/Item_004_are_birds.mp3";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex G 6.svg";

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



const OPTIONS = ["These", "Those"];

const questions = [
  { key: "sentence1", img: img1, text: "are ducks." },
  { key: "sentence2", img: img2, text: "are flowers." },
  { key: "sentence3", img: img3, text: "are butterflies." },
  { key: "sentence4", img: img4, text: "are birds." },
  { key: "sentence5", img: img5, text: "are rabbits." },
  { key: "sentence6", img: img6, text: "are dogs." },
];

const correctAnswers = {
  sentence1: "Those",
  sentence2: "These",
  sentence3: "Those",
  sentence4: "These",
  sentence5: "Those",
  sentence6: "Those",
};

// eslint-disable-next-line react-refresh/only-export-components -- Local row preserves the existing layout.
const QuestionItem = ({
  index,
  question,
  interaction,
  handleAnswerChange,
  checked,
  isWrong,
}) => {
  return (
    <div className="flex items-center gap-4 p-2 rounded-xl">
      <div className="flex items-start gap-4 p-2 rounded-xl">
        <span className="font-semibold text-blue-900 text-xl">
          {index + 1}.
        </span>

        <img
          src={question.img}
          className="object-contain"
          style={{ height: "100px", width: "140px" }}
          alt={IMAGE_DESCRIPTIONS[question.img] || ""}
        />
      </div>
      <p className="relative text-xl text-gray-800 w-full">
        <select
          {...interaction.nativeProps(question.key)}
          onChange={(e) => {
            interaction.playSound(
              "native-" + question.key,
              e.target.value === "These" ? theseAudio : thoseAudio,
            );
            handleAnswerChange(question.key, e.target.value);
          }}
          className={
            focusClass + " mx-3 p-2 w-80 text-center text-lg border-b-2"
          }
        >
          <option value="" disabled>
            select the answer
          </option>
          {OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {interaction.playingKey === "native-" + question.key && (
          <SpeakerBadge />
        )}

        {checked && isWrong(question.key) && (
          <div className="absolute -top-2 left-26 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-sm font-bold shadow">
            ✕
          </div>
        )}

        {SOUNDS[question.text.replace(/\.$/, "")] ? (
          <AudioText
            audioKey={question.key}
            src={SOUNDS[question.text.replace(/\.$/, "")]}
            playSound={interaction.playSound}
            playingKey={interaction.playingKey}
          >
            {question.text}
          </AudioText>
        ) : (
          <span>
            are{" "}
            <AudioText
              audioKey={question.key}
              src={question.key === "sentence5" ? rabbitsAudio : dogsAudio}
              playSound={interaction.playSound}
              playingKey={interaction.playingKey}
            >
              {question.text.slice(4)}
            </AudioText>
          </span>
        )}
      </p>
    </div>
  );
};

const IMAGE_DESCRIPTIONS = {
  [img1]: "A hand pointing toward ducks in the distance.",
  [img2]: "A hand holding several flowers.",
  [img3]: "A hand pointing toward butterflies in the distance.",
  [img4]: "Two blue birds perched on an arm.",
  [img5]: "A hand pointing toward rabbits in the distance.",
  [img6]: "A hand pointing toward dogs in the distance.",
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
  "are ducks": sound0,
  "are flowers": sound1,
  "are butterflies": sound2,
  "are birds": sound3,
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
      button.style.cursor = "not-allowed";
      button.setAttribute("aria-disabled", "true");
    }
  };
  const resetCompletedCheck = () => {
    const previous = completedCheckRef.current;
    if (previous?.button?.style) {
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
const WB_Unit2_Page12_Q1 = () => {
  const interaction = useSelectAnswers(
    correctAnswers,
    "Please fill in all answers!",
  );
  const { rootRef, message } = interaction;
  const answers = interaction.values,
    checked = true;
  const handleAnswerChange = interaction.choose,
    isWrong = (id) => interaction.results[id] === "wrong";
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
      <div className="div-forall" style={{ gap: "25px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="G"
          title={"Look and write."}
          subTitle={
            "Look at the picture or sentence clue, say the park answer first, then write or select it carefully."
          }
        />

        <div className="family-completion-activity" dir="ltr">
          <div className="sentences">
            {questions.map((q, index) => (
              <QuestionItem
                key={q.key}
                index={index}
                question={q}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
                checked={checked}
                isWrong={isWrong}
                interaction={interaction}
              />
            ))}
          </div>

          <div className="mt-10">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page12_Q1;
