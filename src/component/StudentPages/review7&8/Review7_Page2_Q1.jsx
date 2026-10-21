import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 71/Ex C 1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 71/Ex C 2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 71/Ex C 3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 71/Ex C 4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 71/Ex C 5.svg";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";
import audio5 from "../../../assets/audio/ClassBook/U 8/cd49pg71-instruction1-adult-lady_ejSLDj8H.mp3";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const focusClass =
  " focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const Review7_Page2_Q1 = () => {
  const completedCheckRef = useRef(null);
  const completeCheck = (event) => {
    const button = event?.currentTarget;
    if (!completedCheckRef.current || (button?.style && completedCheckRef.current.button !== button)) {
      completedCheckRef.current = { button, cursor: button?.style?.cursor, aria: button?.getAttribute?.("aria-disabled") };
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
      if (previous.aria == null) previous.button.removeAttribute("aria-disabled");
      else previous.button.setAttribute("aria-disabled", previous.aria);
    }
    completedCheckRef.current = null;
  };

  const items = [
    { img: img1, correct: "yes", alt: "A long pale object with rounded ends." },
    {
      img: img2,
      correct: "no",
      alt: "A metal object with a loop at one end and teeth at the other.",
    },
    {
      img: img3,
      correct: "no",
      alt: "A helmeted child riding a two-wheeled vehicle.",
    },
    {
      img: img4,
      correct: "yes",
      alt: "A green tree covered in white snow.",
    },
    { img: img5, correct: "yes", alt: "A pink washing bar labeled SOAP." },
  ];
  const captions = [
    {
      start: 0.539,
      end: 9.939,
      text: "Page 71. Review 7. Exercise C. Does it have a long O? Listen and write ✓ or X.",
    },
    { start: 11.179, end: 15.319, text: "1: bone. 2: key." },
    { start: 16.34, end: 23.199, text: "3: bike. 4: snow. 5: soap" },
  ];
  const [selected, setSelected] = useState(Array(items.length).fill(""));
  const [locked, setLocked] = useState(false);
  const [results, setResults] = useState(Array(items.length).fill(null));
  const [message, setMessage] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const [forceStopAudio, setForceStopAudio] = useState(false);
  const exerciseRef = useRef(null);
  const audioRef = useRef(null);
  const isLocked = (index) => locked || results[index] === "correct";
  const setAnnouncement = setMessage;
  const stopAudio = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const playAudio = (src, key) => {
    if (!src) return;
    stopAudio();
    document.querySelectorAll("audio").forEach((audio) => audio.pause());
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      setPlayingKey(null);
      audio.onended = null;
      audio.onerror = null;
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    audio.play().catch(fail);
  };
  useEffect(() => {
    const onOtherPlay = (event) => {
      if (event.target === audioRef.current) return;
      const audio = audioRef.current;
      audioRef.current = null;
      setPlayingKey(null);
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
    document.addEventListener("play", onOtherPlay, true);
    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  const choiceProps = (i, value) => ({
    type: "button",
    "aria-pressed": selected[i] === value,
    "aria-disabled": isLocked(i),
    "aria-label": `Question ${i + 1}: ${value === "yes" ? "Tick, has long o" : "Cross, does not have long o"}${
      selected[i] === value && results[i] === "correct"
        ? ", correct and locked"
        : selected[i] === value && results[i] === "wrong"
          ? ", incorrect, you can change it"
          : ""
    }`,
    style:
      selected[i] === value && results[i]
        ? {
            borderColor: results[i] === "correct" ? "#16a34a" : "#ef4444",
            boxShadow: results[i] === "correct" ? "0 2px 0 #16a34a" : undefined,
          }
        : undefined,
    onKeyDown: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) e.currentTarget.click();
    },
    onKeyUp: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
    },
  });
  const speakerBadge = (key) =>
    playingKey === key && (
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          width: 22,
          height: 22,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 3,
          lineHeight: 1,
          background: "#fff",
          color: "#000",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );

  const playPicture = (i) => {
    setForceStopAudio(true);
    playAudio(items[i].audio, "picture-" + i);
  };
  const pictureProps = (i) =>
    !items[i].audio
      ? {}
      : {
          role: "button",
          tabIndex: 0,
          "aria-label": `Picture ${i + 1}: ${items[i].alt} Press Enter or Space to listen.`,
          onClick: () => playPicture(i),
          onKeyDown: (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            e.stopPropagation();
            if (!e.repeat) playPicture(i);
          },
          onKeyUp: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
            }
          },
        };

  const choose = (i, value) => {
    if (isLocked(i)) {
      setMessage(
        `Question ${i + 1} is locked. Press Start Again to try again.`,
      );
      return;
    }

    const updated = [...selected];
    updated[i] = value;
    setSelected(updated);
    setResults((previous) =>
      previous.map((result, index) => (index === i ? null : result)),
    );
    setMessage(
      `Question ${i + 1}: ${value === "yes" ? "tick" : "cross"} selected.`,
    );
  };

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;

    if (selected.includes("")) {
      ValidationAlert.info("Please answer all questions.");
      setMessage("Please answer all questions.");
      return;
    }

    stopAudio();
    const checked = items.map((item, i) =>
      results[i] === "correct" || selected[i] === item.correct
        ? "correct"
        : "wrong",
    );
    const score = checked.filter((result) => result === "correct").length;
    const total = items.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setResults(checked);
    setLocked(score === total);
    setMessage(
      `Score ${score} out of ${total}. ${checked.map((result, i) => `Question ${i + 1}: ${result === "correct" ? "correct and locked" : "incorrect, editable"}.`).join(" ")}`,
    );
  };

  const showAnswers = () => {
    stopAudio();
    setSelected(items.map((i) => i.correct));
    setLocked(true);
    setResults(Array(items.length).fill("correct"));
    setMessage("Correct answers are shown and locked.");
  };

  const reset = () => {
    stopAudio();
    const audio = exerciseRef.current?.querySelector("audio");
    if (audio) {
      audio.pause();
      
    }
    setForceStopAudio(true);
    setSelected(Array(items.length).fill(""));
    setLocked(false);
    setResults(Array(items.length).fill(null));
    setMessage("Exercise reset. All answers and results are cleared.");
  };

  return (
    <div
      ref={exerciseRef}
      className="main-container-component mb-20"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") e.stopPropagation();
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") e.stopPropagation();
      }}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
      <p id="r7p2q1-help" className="sr-only">
        Use Tab and Shift+Tab to move between controls. Enter or Space chooses
        tick or cross. Pictures with individual recordings can be activated to
        listen. Correct answers lock after checking; incorrect answers can be
        changed.
      </p>
      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="C"
          title={"Does it have a long o? Listen and write ✓ or ✗."}
          subTitle={
            "Listen to both sounds carefully, then choose Yes/No only after comparing them."
          }
          isReview={true}
        />
        <QuestionAudioPlayer
          pageId="sb_review7_page2_q1"
          src={audio5}
          captions={captions}
          stopAtSecond={9.93}
          forceStop={forceStopAudio}
          onInteract={() => {
            stopAudio();
            setForceStopAudio(false);
          }}
        />
        {/* GRID */}
        <div className="flex flex-wrap gap-3 w-full justify-between">
          {items.map((item, i) => {
            const isWrong = results[i] === "wrong";
            return (
              <div
                key={i}
                role="group"
                aria-label={`Question ${i + 1}`}
                aria-describedby="r7p2q1-help"
                className="flex flex-col items-center justify-center mt-4"
              >
                {" "}
                <div className="relative">
                  <div className="flex">
                    {/* number in corner */}
                    <span className="text-lg font-bold">{i + 1}</span>

                    {/* image + audio */}
                    <img
                      src={item.img}
                      alt={item.alt}
                      {...pictureProps(i)}
                      className={
                        "object-contain" + (item.audio ? focusClass : "")
                      }
                      style={{
                        height: "100px",
                        width: "auto",
                        boxShadow:
                          playingKey === "picture-" + i
                            ? "0 0 0 3px #2563eb"
                            : undefined,
                        backgroundColor:
                          playingKey === "picture-" + i ? "#dbeafe" : undefined,
                      }}
                    />

                    {speakerBadge("picture-" + i)}
                    {/* Wrong Icon */}
                    {isWrong && (
                      <div
                        aria-hidden="true"
                        className="absolute top-0 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                      >
                        <span className="text-white font-bold">✕</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    {...choiceProps(i, "yes")}
                    onClick={() => choose(i, "yes")}
                    className={`w-10 h-10 border flex items-center justify-center rounded text-lg ${focusClass} ${
                      selected[i] === "yes"
                        ? "border-2 border-blue-800 bg-blue-100 text-black"
                        : "border-red-700 "
                    }`}
                  >
                    <img
                      src={trueIcon}
                      alt=""
                      aria-hidden="true"
                      style={{ height: "25px", width: "auto" }}
                    />
                  </button>

                  <button
                    {...choiceProps(i, "no")}
                    onClick={() => choose(i, "no")}
                    className={`w-10 h-10 border flex items-center justify-center rounded text-lg ${focusClass} ${
                      selected[i] === "no"
                        ? "border-2 border-blue-800 bg-blue-100 text-black"
                        : "border-red-700 "
                    }`}
                  >
                    <img
                      src={falseIcon}
                      alt=""
                      aria-hidden="true"
                      style={{ height: "25px", width: "auto" }}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* buttons */}
        <div className="action-buttons-container">
          <button type="button" onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className={"try-again-button"}>
            Start Again ↻
          </button>

          <button
            type="button"
            onClick={showAnswers}
            className={"show-answer-btn"}
          >
            Show Answer
          </button>

          <button
            type="button"
            onClick={checkAnswers}
            aria-disabled={locked}
            className={"check-button2"}
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review7_Page2_Q1;
