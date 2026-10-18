import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_001_Steve.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_002_pilot.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_003_Janice.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_004_graphic_designer.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_005_Larry.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_006_teacher.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_007_Philip.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_008_vet.mp3";
import sound8 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_009_What's_Larry's_job.mp3";
import sound9 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_010_What's_Janice's_job.mp3";
import sound10 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_011_What's_Philip's_job.mp3";
import sound11 from "../../../assets/audio/WorkBook/Unit 4/Page 24 - H/Item_012_What's_Steve's_job.mp3";
import React, { useState, useRef, useEffect } from "react";

// استيراد الصور ومكونات الأزرار والتنبيهات
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex H 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex H 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex H 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex H 4.svg";

// بيانات التمرين
const chartData = [
  {
    name: "Steve",
    job: "pilot",
  },
  {
    name: "Janice",
    job: "graphic designer",
  },
  {
    name: "Larry",
    job: "teacher",
  },
  {
    name: "Philip",
    job: "vet",
  },
];
const questions = [
  {
    id: "h1",
    question: "What's Larry's job?",
    correctAnswer: "Larry is a teacher.",
  },
  {
    id: "h2",
    question: "What's Janice's job?",
    correctAnswer: "Janice is a graphic designer.",
  },
  {
    id: "h3",
    question: "What's Philip's job?",
    correctAnswer: "Philip is a vet.",
  },
  {
    id: "h4",
    question: "What's Steve's job?",
    correctAnswer: "Steve is a pilot.",
  },
];
const jobImages = [
  {
    job: "pilot",
    img: img1,
  },
  {
    job: "teacher",
    img: img2,
  },
  {
    job: "vet",
    img: img3,
  },
  {
    job: "graphic designer",
    img: img4,
  },
];
const answerOptions = [
  "Larry is a teacher.",
  "Janice is a graphic designer.",
  "Philip is a vet.",
  "Steve is a pilot.",
];
const IMAGE_DESCRIPTIONS = {
  [img1]: "A man standing in front of a blackboard.",
  [img2]: "A man wearing a blue uniform and cap.",
  [img3]: "A man examining a cat on a table.",
  [img4]: "A woman working at a desktop computer.",
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
  steve: sound0,
  pilot: sound1,
  janice: sound2,
  "graphic designer": sound3,
  larry: sound4,
  teacher: sound5,
  philip: sound6,
  vet: sound7,
  "what's larry's job": sound8,
  "what's janice's job": sound9,
  "what's philip's job": sound10,
  "what's steve's job": sound11,
};
const soundFor = (text) =>
  SOUNDS[
    String(text)
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .trim()
  ];
function useSelectAnswers(
  correct,
  missingMessage,
  groups = null,
  missingKind = "info",
) {
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
      ValidationAlert[missingKind](missingMessage);
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
    showCheckFeedback(
      audio.rootRef.current,
      score === total ? "success" : score ? "warning" : "error",
      msg,
    );
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
    choose,
    check,
    show,
    reset,
    props,
    nativeProps,
    resultStyle,
  };
}
const ReadChartAndAnswer = () => {
  const interaction = useSelectAnswers(
    Object.fromEntries(questions.map((q) => [q.id, q.correctAnswer])),
    "Please answer all questions first.",
    null,
    "warning",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const isWrong = (q) => interaction.results[q.id] === "wrong";
  const getSelectClass = (id) =>
    interaction.results[id] === "correct"
      ? "border-green-600"
      : interaction.results[id] === "wrong"
        ? "border-red-500"
        : "border-gray-300";
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
          gap: "35px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="H"
          title={<> Read the chart. Answer the questions.</>}
          subTitle={"Read one row of the chart at a time, then use that row to answer the matching job question"}
        />

        <div className="flex flex-col gap-2">
          {/* الجزء الأيسر: الجدول والصور */}
          <div className="flex gap-8 space-y-6">
            <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
              <tbody>
                {chartData.map((person, index) => (
                  <tr
                    key={person.name}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-3 border border-gray-200 font-semibold text-lg">
                      <AudioText
                        audioKey={"name-" + index}
                        src={soundFor(person.name)}
                        playSound={playSound}
                        playingKey={playingKey}
                      >
                        {person.name}
                      </AudioText>
                    </td>
                    <td className="p-3 border border-gray-200 text-lg">
                      <AudioText
                        audioKey={"job-" + index}
                        src={soundFor(person.job)}
                        playSound={playSound}
                        playingKey={playingKey}
                        className=""
                      >
                        {person.job}
                      </AudioText>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {jobImages.map((job) => (
                <img
                  key={job.job}
                  src={job.img}
                  alt={IMAGE_DESCRIPTIONS[job.img]}
                  className="max-w-full max-h-24 object-contain "
                />
              ))}
            </div>
          </div>

          {/* الجزء الأيمن: الأسئلة والأجوبة */}
          <div className="space-y-2">
            {questions.map((q, index) => (
              <div key={q.id} className="flex gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-blue-600">{index + 1}</span>
                  <p className="text-lg">
                    <AudioText
                      audioKey={"question-" + q.id}
                      src={soundFor(q.question)}
                      playSound={playSound}
                      playingKey={playingKey}
                      className=""
                    >
                      {q.question}
                    </AudioText>
                  </p>
                </div>
                <div className="relative">
                  <select
                    {...interaction.nativeProps(q.id)}
                    className={`${focusClass} focus-visible:rounded-sm! cursor-pointer w-full mb-5  pb-1 text-lg border-b-2 transition-colors ${getSelectClass(q.id, q.correctAnswer)}`}
                  >
                    <option value="" disabled></option>
                    {answerOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {isWrong(q) && (
                    <div className="absolute -top-4 -right-4 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
export default ReadChartAndAnswer;
