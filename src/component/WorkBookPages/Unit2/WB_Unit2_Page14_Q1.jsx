import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import sound from "../../../assets/audio/WorkBook/p14Q1.mp3";
import clockImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 1.svg";
import brickImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 2.svg";
import candyImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 3.svg";
import sockImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 4.svg";
import lockImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 5.svg";
import foxImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 6.svg";
import mugImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 7.svg";
import featherImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 8.svg";
import queenImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 9.svg";
import boxImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 10.svg";
import catImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 14/Ex A 12.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

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


const listenQuestions = [
  {
    id: "q1",
    options: [
      { id: "opt1_1", img: clockImg, isCorrect: true },
      { id: "opt1_2", img: brickImg, isCorrect: false },
      { id: "opt1_3", img: candyImg, isCorrect: false },
    ],
  },
  {
    id: "q2",
    options: [
      { id: "opt2_1", img: sockImg, isCorrect: false },
      { id: "opt2_2", img: lockImg, isCorrect: false },
      { id: "opt2_3", img: foxImg, isCorrect: true },
    ],
  },
  {
    id: "q3",
    options: [
      { id: "opt3_1", img: mugImg, isCorrect: false },
      { id: "opt3_2", img: featherImg, isCorrect: false },
      { id: "opt3_3", img: queenImg, isCorrect: true },
    ],
  },
  {
    id: "q4",
    options: [
      { id: "opt4_1", img: boxImg, isCorrect: false },
      { id: "opt4_2", img: brickImg, isCorrect: false },
      { id: "opt4_3", img: catImg, isCorrect: true },
    ],
  },
];

const IMAGE_DESCRIPTIONS = {
  [clockImg]: "A round clock.",
  [brickImg]: "A yellow brick with holes.",
  [candyImg]: "Three wrapped sweets.",
  [sockImg]: "A striped sock.",
  [lockImg]: "A padlock.",
  [foxImg]: "An orange fox.",
  [mugImg]: "A blue mug.",
  [featherImg]: "Three feathers.",
  [queenImg]: "A woman wearing a crown.",
  [boxImg]: "An open cardboard box.",
  [catImg]: "An orange cat head.",
};
const focusClass =
  "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";

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
const WB_Unit2_Page14_Q1 = () => {
  const interaction = useSelectAnswers(
    Object.fromEntries(
      listenQuestions.map((q) => [q.id, q.options.find((o) => o.isCorrect).id]),
    ),
    "Please answer all questions before checking.",
  );
  const { rootRef, message } = interaction;
  const checkDisabled =
    interaction.revealed ||
    listenQuestions.every(
      (question) => interaction.results[question.id] === "correct",
    );
  useEffect(() => {
    const button = rootRef.current?.querySelector(".check-button2");
    if (!button) return;
    button.disabled = checkDisabled;
    button.style.cursor = checkDisabled ? "not-allowed" : "";
    button.setAttribute("aria-disabled", String(checkDisabled));
  }, [checkDisabled, rootRef]);
  const selectedOptions = interaction.values,
    stopAtSecond = 6.35;
  const [instructionPause, setInstructionPause] = useState(0);
  const pauseInstruction = () => {
    rootRef.current
      ?.querySelectorAll("audio")
      .forEach((audio) => audio.pause());
    setInstructionPause((n) => n + 1);
  };
  const handleShowAnswer = () => {
      pauseInstruction();
      interaction.show();
    },
    handleStartAgain = () => {
      pauseInstruction();
      interaction.reset();
    },
    checkAnswers = (checkEvent) => {
      if (checkDisabled) return;
      pauseInstruction();
      interaction.check(checkEvent);
    };
  const getCircleClass = (id, option) =>
    selectedOptions[id] !== option.id
      ? "border-transparent"
      : interaction.results[id] === "correct"
        ? "border-green-500"
        : interaction.results[id] === "wrong"
          ? "border-red-500"
          : "border-blue-500";
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 6.34,
      text: "Page 14, phonics exercise A. Listen, look, and circle.",
    },
    {
      start: 7.52,
      end: 9,
      text: "1-clock.",
    },
    {
      start: 9.5,
      end: 11.64,
      text: "2-fox.",
    },
    {
      start: 12,
      end: 13.6,
      text: "3-queen.",
    },
    {
      start: 14.5,
      end: 16.8,
      text: "4-cat.",
    },
  ];

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
      <div className="div-forall" style={{ gap: "45px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="A"
          title={<>Listen, look, and circle.</>}
          subTitle={"Play each word, say its beginning or ending sound, then circle the matching picture."}
        />

        <QuestionAudioPlayer
          pageId="wb_unit2_page14_q1"
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
          forceStop={instructionPause}
        />
        <div className="grid grid-cols-2 gap-15">
          {listenQuestions.map((question, index) => (
            <div key={question.id} className="flex items-center gap-4">
              <span className="font-bold text-blue-600 text-xl">
                {index + 1}
              </span>
              <div className="flex-1 grid grid-cols-3 gap-4">
                {question.options.map((option) => (
                  <div key={option.id} className="relative w-24">
                    <div
                      key={option.id}
                      {...interaction.props(question.id, option.id)}
                      onClick={() => {
                        pauseInstruction();
                        interaction.choose(question.id, option.id);
                      }}
                      aria-label={
                        "Question " +
                        (index + 1) +
                        ": " +
                        IMAGE_DESCRIPTIONS[option.img] +
                        (interaction.locked(question.id)
                          ? " Correct and locked."
                          : "")
                      }
                      className={`${focusClass} w-24 h-24 rounded-full border-4 cursor-pointer overflow-hidden transition-colors ${getCircleClass(question.id, option)}`}
                    >
                      <div
                        className="w-20 h-20 overflow-hidden bg-center bg-contain bg-no-repeat"
                        style={{ backgroundImage: `url(${option.img})` }}
                      />
                    </div>{" "}
                    {interaction.results[question.id] === "wrong" &&
                      selectedOptions[question.id] === option.id &&
                      !option.isCorrect && (
                        <div className="absolute -top-2 right-2 bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-base font-bold shadow-lg border-2 border-white">
                          ✕
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
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

export default WB_Unit2_Page14_Q1;
