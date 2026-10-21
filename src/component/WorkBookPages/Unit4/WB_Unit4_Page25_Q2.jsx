/* eslint-disable react-refresh/only-export-components -- Exercise-local controls preserve the shared components. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - J/Item_001_grows_food.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - J/Item_002_teachers.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - J/Item_003_He's.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - J/Item_004_They're.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - J/Item_005_fixes_cars.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - J/Item_006_policemen.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - J/Item_007_vet.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - J/Item_008_photographer.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex J 4.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A man holding two baskets of vegetables.",
  [img2]: "Two uniformed officers beside a patrol car.",
  [img3]: "A person working under the hood of a red car.",
  [img4]: "A person holding a camera up to one eye.",
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
  "grows food": sound0,
  teachers: sound1,
  "he's": sound2,
  "they're": sound3,
  "fixes cars": sound4,
  policemen: sound5,
  vet: sound6,
  photographer: sound7,
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
const WB_Unit4_Page25_Q2 = () => {
  const data = [
    {
      id: 1,
      img: img1,
      per: "He's",
      relations: ["grows food", "fixes cars"],
      correctRelation: "grows food",
    },
    {
      id: 2,
      img: img2,
      per: "They're",
      relations: ["teachers.", "policemen"],
      correctRelation: "policemen",
    },
    {
      id: 3,
      img: img3,
      per: "He's",
      relations: ["grows food", "fixes cars"],
      correctRelation: "fixes cars",
    },
    {
      id: 4,
      img: img4,
      per: "He's",
      relations: ["vet", "photographer."],
      correctRelation: "photographer.",
    },
  ];
  const interaction = useSelectAnswers(
    Object.fromEntries(data.map((item) => [item.id, item.correctRelation])),
    "Please choose an answer for all questions first.",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const userSelections = Object.fromEntries(
    data.map((item) => [
      item.id,
      {
        relation: interaction.values[item.id],
      },
    ]),
  );
  const isWrong = (item) => interaction.results[item.id] === "wrong";
  const getButtonClass = (item, value) =>
    userSelections[item.id].relation === value
      ? "border-blue-900"
      : "border-gray-300 bg-white hover:border-blue-900";
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
          gap: "90px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="J"
          title={<>Look, read, and circle.</>}
          subTitle={"Read the clue and look at the picture, then tap the jobs and wants answer you would circle."}
        />

        <div className="grid grid-cols-2 gap-x-20 gap-y-10">
          {data.map((item) => (
            <div key={item.id} className="flex items-center gap-6">
              <div className="flex items-start gap-4 max-w-full">
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt={IMAGE_DESCRIPTIONS[item.img]}
                  className="object-contain rounded-xl "
                  style={{
                    height: "120px",
                    width: "120px",
                  }}
                />
              </div>

              <div className="flex items-center gap-4 text-lg text-gray-800">
                <AudioText
                  audioKey={"person-" + item.id}
                  src={soundFor(item.per)}
                  playSound={playSound}
                  playingKey={playingKey}
                  className=""
                >
                  {item.per}
                </AudioText>

                <div className="flex flex-col gap-4">
                  {item.relations.map((r) => (
                    <div key={r} className="relative">
                      <button
                        {...interaction.props(item.id, r, soundFor(r))}
                        style={{
                          ...interaction.props(item.id, r).style,
                          borderRadius: "9999px",
                        }}
                        className={`${focusClass} w-40 px-4 py-1 rounded-full border-2 font-medium transition-all ${getButtonClass(item, r)} ${isWrong(item) && userSelections[item.id]?.relation === r && "border-red-500 bg-white"}`}
                      >
                        {r}
                        {playingKey === "choice-" + item.id + "-" + r && (
                          <SpeakerBadge />
                        )}
                      </button>

                      {isWrong(item) &&
                        userSelections[item.id]?.relation === r && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
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
export default WB_Unit4_Page25_Q2;
