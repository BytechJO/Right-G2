import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import yesPluralAudio from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_014_Yes,_they_are.mp3";
import noPluralAudio from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_015_No,_they_aren't.mp3";
import yesSingularAudio from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_012_Yes,_it_is.mp3";
import noSingularAudio from "../../../assets/audio/WorkBook/Unit 2/Page 10 - D/Item_013_No,_it_isn't.mp3";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 12 - H/Item_001_dogs.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 12 - H/Item_002_squirrel.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 12 - H/Item_003_horse.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 12 - H/Item_004_rabbits.mp3";
import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Asset 43.svg";

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


const correctAnswers = {
  input1_1: "Are these",
  input1_2: "Yes, they are.",
  input2_1: "Is this a",
  input2_2: "Yes, it is.",
  input3_1: "Is this a",
  input3_2: "Yes, it is.",
  input4_1: "Are these",
  input4_2: "No, they aren't.",
};

const questions = [
  { id: "q1", number: 1, question1_end: "dogs?", image: 2 },
  { id: "q2", number: 2, question1_end: "squirrel?", image: 3 },
  { id: "q3", number: 3, question1_end: "horse?", image: 0 },
  { id: "q4", number: 4, question1_end: "rabbits?", image: 1 },
];

/* ================= MAIN ================= */

const IMAGE_DESCRIPTIONS = {
  [img]: "A brown horse.",
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
  dogs: sound0,
  squirrel: sound1,
  horse: sound2,
  rabbits: sound3,
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
const WB_Unit2_Page12_Q2 = () => {
  const interaction = useSelectAnswers(
    correctAnswers,
    "Please complete all fields first.",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const inputs = Object.fromEntries(
      Object.keys(correctAnswers).map((id) => [
        id,
        interaction.values[id] ?? "",
      ]),
    ),
    results = Object.fromEntries(
      Object.entries(interaction.results).map(([id, r]) => [
        id,
        r === "correct" ? true : r === "wrong" ? false : undefined,
      ]),
    );
  const handleSelectChange = (id, value) => {
      if (id.endsWith("_2")) {
        const sounds = {
          "Yes, they are.": yesPluralAudio,
          "No, they aren't.": noPluralAudio,
          "Yes, it is.": yesSingularAudio,
          "No, it isn't.": noSingularAudio,
        };
        playSound("native-" + id, sounds[value]);
      }
      interaction.choose(id, value);
    },
    checkAnswers = interaction.check,
    resetExercise = interaction.reset,
    handleShowAnswer = interaction.show;
  const getInputBorderColor = (name) =>
    interaction.results[name] === "correct"
      ? "border-green-600"
      : interaction.results[name] === "wrong"
        ? "border-red-500"
        : "border-gray-300";

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
      <div className="div-forall" style={{ gap: "5px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="H"
          title={"Look, trace, and write."}
          subTitle={"Trace the question first, then connect it to the animal picture that makes the sentence correct."}
        />
        <div className="font-sans w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* LEFT SIDE */}
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="flex items-start space-x-3 text-lg">
                  <span className="font-bold text-blue-900">{q.number}</span>

                  <div className="w-full space-y-4">
                    <div className="relative">
                      <div
                        className={`border-b-2 pb-2 ${getInputBorderColor(`input${q.number}_1`)}`}
                      >
                        <select
                          className={`${focusClass} bg-transparent ${
                            inputs[`input${q.number}_1`] === ""
                              ? "text-gray-400"
                              : "text-black"
                          }`}
                          {...interaction.nativeProps(`input${q.number}_1`)}
                          onChange={(e) =>
                            handleSelectChange(
                              `input${q.number}_1`,
                              e.target.value,
                            )
                          }
                        >
                          <option value="" disabled hidden>
                            -- Select Question --
                          </option>
                          <option value="Is this a">Is this a</option>
                          <option value="Are these">Are these</option>
                        </select>

                        <span className="text-red-600 ml-2">
                          <AudioText
                            audioKey={q.id}
                            src={SOUNDS[q.question1_end.replace(/\?$/, "")]}
                            playSound={playSound}
                            playingKey={playingKey}
                          >
                            {q.question1_end}
                          </AudioText>
                        </span>
                      </div>

                      {/* ❌ ICON */}
                      {results[`input${q.number}_1`] === false && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <span className="text-white text-sm font-bold">
                            ✕
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div
                        className={`border-b-2 pb-2 ${getInputBorderColor(`input${q.number}_2`)}`}
                      >
                        <select
                          className={`${focusClass} bg-transparent ${
                            inputs[`input${q.number}_2`] === ""
                              ? "text-gray-400"
                              : "text-black"
                          }`}
                          {...interaction.nativeProps(`input${q.number}_2`)}
                          onChange={(e) =>
                            handleSelectChange(
                              `input${q.number}_2`,
                              e.target.value,
                            )
                          }
                        >
                          <option value="" disabled hidden>
                            -- Select Answer --
                          </option>
                          <option value="Yes, they are.">Yes, they are.</option>
                          <option value="No, they aren't.">
                            No, they aren't.
                          </option>
                          <option value="Yes, it is.">Yes, it is.</option>
                          <option value="No, it isn't.">No, it isn't.</option>
                        </select>
                        {playingKey === "native-input" + q.number + "_2" && (
                          <SpeakerBadge />
                        )}
                      </div>

                      {/* ❌ ICON */}
                      {results[`input${q.number}_2`] === false && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <span className="text-white text-sm font-bold">
                            ✕
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT MATCHING */}
            <div className="flex justify-center items-center">
              <img
                src={img}
                alt={IMAGE_DESCRIPTIONS[img] || ""}
                className="w-full max-w-[400px] object-contain"
                style={{ height: "100%" }}
              />
            </div>
          </div>

          <div className="mt-10">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={resetExercise}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page12_Q2;
