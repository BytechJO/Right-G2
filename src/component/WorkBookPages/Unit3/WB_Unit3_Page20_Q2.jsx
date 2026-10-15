import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 20 - B/Item_001_John.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 20 - B/Item_002_Stella.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 20 - B/Item_003_Where's_my_yo-yo,_John.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 3/Page 20 - B/Item_004_Which_one.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 3/Page 20 - B/Item_005_The_yellow_one._It's_yellow_like_a_banana.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 3/Page 20 - B/Item_006_Oh_yes!_Here_you_are.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 3/Page 20 - B/Item_007_Where_are_my_jeans,_John.mp3";
import sound7 from "../../../assets/audio/WorkBook/Unit 3/Page 20 - B/Item_008_Which_ones.mp3";
import sound8 from "../../../assets/audio/WorkBook/Unit 3/Page 20 - B/Item_009_The_blue_ones_that_I_bought_with_the_red_jacket.mp3";
import sound9 from "../../../assets/audio/WorkBook/Unit 3/Page 20 - B/Item_010_Here_you_are.mp3";
import React, { useState, useRef, useEffect } from "react";
import sound from "../../../assets/audio/WorkBook/cd3pg20instruction-adult-lady_bOtPfDKP.mp3";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import placeholderImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Asset 37.svg";
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


const conversations = [
  {
    id: "conv1",
    lines: [
      {
        speaker: "Stella",
        text: [
          "Where's my ",
          {
            id: "c1_1",
            correct: "y",
          },
          "o-",
          {
            id: "c1_2",
            correct: "y",
          },
          "o, John?",
        ],
      },
      {
        speaker: "John",
        text: ["Which one?"],
      },
      {
        speaker: "Stella",
        text: [
          "The ",
          {
            id: "c1_3",
            correct: "y",
          },
          "ellow one. It's ",
          {
            id: "c1_4",
            correct: "y",
          },
          "ellow like a banana.",
        ],
      },
      {
        speaker: "John",
        text: [
          "Oh yes! Here ",
          {
            id: "c1_5",
            correct: "y",
          },
          "ou are.",
        ],
      },
    ],
  },
  {
    id: "conv2",
    lines: [
      {
        speaker: "Stella",
        text: [
          "Where are my ",
          {
            id: "c2_1",
            correct: "j",
          },
          "eans, ",
          {
            id: "c2_2",
            correct: "J",
          },
          "ohn?",
        ],
      },
      {
        speaker: "John",
        text: ["Which ones?"],
      },
      {
        speaker: "Stella",
        text: [
          "The blue ones that I bought with the red ",
          {
            id: "c2_3",
            correct: "j",
          },
          "acket?",
        ],
      },
      {
        speaker: "John",
        text: [
          "Here ",
          {
            id: "c2_4",
            correct: "y",
          },
          "ou are.",
        ],
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
const SOUNDS = {
  john: sound0,
  stella: sound1,
  "where's my yo-yo, john": sound2,
  "which one": sound3,
  "the yellow one. it's yellow like a banana": sound4,
  "oh yes! here you are": sound5,
  "where are my jeans, john": sound6,
  "which ones": sound7,
  "the blue ones that i bought with the red jacket": sound8,
  "here you are": sound9,
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
const WB_Unit3_Page20_Q2 = () => {
  const blanks = conversations.flatMap((conv) =>
    conv.lines.flatMap((line) =>
      line.text.filter((part) => typeof part === "object"),
    ),
  );
  const interaction = useSelectAnswers(
    Object.fromEntries(
      blanks.map((blank) => [blank.id, blank.correct.toLowerCase()]),
    ),
    "Please fill all blanks first.",
  );
  const { rootRef, message, playingKey, playSound } = interaction;
  const [forceStop, setForceStop] = useState(0);
  const stopMain = () => setForceStop((n) => n + 1);
  const handleShowAnswer = () => {
      stopMain();
      interaction.show();
    },
    handleStartAgain = () => {
      stopMain();
      interaction.reset();
    },
    checkAnswers = () => {
      if (
        interaction.revealed ||
        blanks.every((b) => interaction.results[b.id] === "correct")
      )
        return;
      stopMain();
      interaction.check();
    };
  const isWrongAnswer = (id) => interaction.results[id] === "wrong";
  const stopAtSecond = 9.159;
  const captions = [
    {
      start: 0.5,
      end: 9.159,
      text: "Page 20 phonics, exercise B. Listen and write the missing letters. Practice the conversation in pairs.",
    },
  ];
  const lineSounds = [
    [sound2, sound3, sound4, sound5],
    [sound6, sound7, sound8, sound9],
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
      <div
        className="div-forall"
        style={{
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="B"
          title={<> Listen and select the missing letters.</>}
          subTitle={"Replay each word, listen for j or y, then choose the missing letter."}
        />

        <QuestionAudioPlayer
          pageId="wb_unit3_page20_q2"
          forceStop={forceStop}
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 mt-4">
          <img
            src={placeholderImg}
            alt="A boy and a girl beside a red car."
            style={{
              height: "180px",
            }}
          />

          <div className="space-y-6">
            {conversations.map((conv, convIndex) => (
              <div key={conv.id}>
                {conv.lines.map((line, lineIndex) => (
                  <p
                    key={lineIndex}
                    className="text-lg leading-10 flex flex-wrap items-center"
                  >
                    <AudioText
                      className="font-bold w-20 inline-block"
                      audioKey={conv.id + "-" + lineIndex}
                      src={lineSounds[convIndex][lineIndex]}
                      playingKey={playingKey}
                      playSound={(key, src) => {
                        stopMain();
                        playSound(key, src);
                      }}
                      label={
                        "Hear " +
                        line.speaker +
                        ": " +
                        line.text
                          .map((p) => (typeof p === "string" ? p : p.correct))
                          .join("")
                      }
                    >
                      {line.speaker}:
                    </AudioText>

                    {line.text.map((part, partIndex) =>
                      typeof part === "string" ? (
                        <span key={partIndex}>{part}</span>
                      ) : (
                        <span key={part.id} className="relative mx-1">
                          <select
                            {...interaction.nativeProps(part.id)}
                            onChange={(e) => {
                              stopMain();
                              interaction.choose(part.id, e.target.value);
                            }}
                            className={`${focusClass} focus-visible:outline-solid! focus-visible:rounded-sm! border-b-2 px-1 text-[22px] font-bold bg-transparent cursor-pointer
                              ${isWrongAnswer(part.id, part.correct) ? "border-red-500" : "border-gray-400"}`}
                          >
                            <option value=""></option>
                            <option value="y">y</option>
                            <option value="j">j</option>
                          </select>

                          {isWrongAnswer(part.id, part.correct) && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                              ✕
                            </span>
                          )}
                        </span>
                      ),
                    )}
                  </p>
                ))}
              </div>
            ))}
          </div>
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
export default WB_Unit3_Page20_Q2;
