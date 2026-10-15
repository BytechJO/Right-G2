import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 18 - G/Item_001_can.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 18 - G/Item_002_can't.mp3";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex G 6.svg";
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



// بيانات التمرين
const writeQuestions = [
  {
    id: "g1",
    img: img1,
    modal: "can",
    correctBefore: "I",
    correctAfter: "fly a kite.",
    beforeOptions: ["I", "It"],
    afterOptions: ["fly a kite.", "swim."],
  },
  {
    id: "g2",
    img: img2,
    modal: "can",
    correctBefore: "I",
    correctAfter: "paint a picture.",
    beforeOptions: ["I", "It"],
    afterOptions: ["paint a picture.", "ride a bike."],
  },
  {
    id: "g3",
    img: img3,
    modal: "can",
    correctBefore: "I",
    correctAfter: "climb a tree.",
    beforeOptions: ["I", "It"],
    afterOptions: ["climb a tree.", "sleep."],
  },
  {
    id: "g4",
    img: img4,
    modal: "can't",
    correctBefore: "I",
    correctAfter: "ride a bike.",
    beforeOptions: ["I", "It"],
    afterOptions: ["ride a bike.", "swim."],
  },
  {
    id: "g5",
    img: img5,
    modal: "can",
    correctBefore: "I",
    correctAfter: "sleep.",
    beforeOptions: ["I", "It"],
    afterOptions: ["sleep.", "paint a picture."],
  },
  {
    id: "g6",
    img: img6,
    modal: "can't",
    correctBefore: "It",
    correctAfter: "swim.",
    beforeOptions: ["I", "It"],
    afterOptions: ["swim.", "fly a kite."],
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
  can: sound0,
  "can't": sound1,
};
const IMAGE_DESCRIPTIONS = {
  [img1]: "A girl flying a kite.",
  [img2]: "A person painting at an easel.",
  [img3]: "A child climbing a tree.",
  [img4]: "A boy on a bicycle with his arms raised.",
  [img5]: "A child yawning in bed.",
  [img6]: "An orange cat in a pool.",
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
          borderBottomColor:
            results[id] === "correct" ? "#16a34a" : "#ef4444",
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
const WB_Unit3_Page18_Q1 = () => {
  const interaction = useSelectAnswers(
    Object.fromEntries(
      writeQuestions.flatMap((q) => [
        [q.id + "-before", q.correctBefore],
        [q.id + "-after", q.correctAfter],
      ]),
    ),
    "Please answer all questions first.",
    writeQuestions.map((q) => [q.id + "-before", q.id + "-after"]),
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const isCorrect = (id) =>
    ["before", "after"].every(
      (field) => interaction.results[id + "-" + field] === "correct",
    );
  const getClass = (id) =>
    isCorrect(id)
      ? "border-b-2 border-green-600"
      : ["before", "after"].some(
            (field) => interaction.results[id + "-" + field] === "wrong",
          )
        ? "border-red-500"
        : "border-gray-50";
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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="G"
          title={"Look, read, and write."}
          subTitle={
            "Look at the picture or sentence clue, say the picnic and ability answer first, then write or select it carefully."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-15">
          {writeQuestions.map((q, index) => {
            const isWrong = (qId) =>
              ["before", "after"].some(
                (field) => interaction.results[qId + "-" + field] === "wrong",
              );
            return (
              <div key={q.id} className="space-y-2 relative">
                <div className="flex items-start gap-4">
                  <span className="font-bold text-blue-600 text-xl">
                    {index + 1}
                  </span>
                  <div className="flex flex-col gap-5">
                    <img
                      src={q.img}
                      alt={IMAGE_DESCRIPTIONS[q.img]}
                      className="w-full max-h-24 object-cover rounded-lg shadow-sm"
                    />
                    <div
                      className={`flex items-center gap-2 border-b-2 pb-1 ${getClass(q.id)}`}
                    >
                      {/* before */}
                      <select
                        {...interaction.nativeProps(q.id + "-before")}
                        className={`${focusClass} focus-visible:outline-solid! focus-visible:rounded-sm! bg-transparent text-[20px] border-b-2 border-gray-500 w-15`}
                      >
                        <option value="" disabled></option>
                        {q.beforeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      {/* can / can't */}
                      <AudioText
                        audioKey={"modal-" + q.id}
                        src={SOUNDS[q.modal]}
                        playSound={playSound}
                        playingKey={playingKey}
                        className="font-semibold text-blue-700 text-xl"
                      >
                        {q.modal}
                      </AudioText>

                      {/* after */}
                      <select
                        {...interaction.nativeProps(q.id + "-after")}
                        className={`${focusClass} focus-visible:outline-solid! focus-visible:rounded-sm! bg-transparent text-[20px] border-b-2 border-gray-500 w-40`}
                      >
                        <option value="" disabled></option>
                        {q.afterOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {isWrong(q.id) && (
                        <div className="absolute bottom-2 -right-2 bg-red-500 font-bold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow border-2 border-white text-2xl">
                          ✕
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
export default WB_Unit3_Page18_Q1;
