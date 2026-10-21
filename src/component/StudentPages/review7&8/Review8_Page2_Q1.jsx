import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import { FaVolumeUp } from "react-icons/fa";
import img1 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/Asset 39.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/Asset 40.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/Asset 41.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page 73/Asset 42.svg";
import sound1 from "../../../assets/audio/ClassBook/U 8/cd50pg73-instruction1-adult-lady_QhaIWovW.mp3";
import trueIcon from "../../../assets/imgs/true.svg";
import falseIcon from "../../../assets/imgs/false.svg";

const captions = [
  {
    start: 0.56,
    end: 10.199,
    text: "Page 73, review 8, exercise D. Do they both have long U? Listen and write ✓ or X.",
  },
  { start: 11.239, end: 14.159, text: "1, shoes, tube." },
  { start: 15.239, end: 18.34, text: "2,sue, blue." },
  { start: 19.22, end: 21.78, text: "3, tune, cup." },
  { start: 23.08, end: 26.04, text: "4, glue, June." },
];
const questions = [
  {
    id: 1,
    image: img1,
    correct: "✗",
    alt: "Blue lace-up footwear beside a white squeeze container with a grey cap.",
  },
  {
    id: 2,
    image: img2,
    correct: "✓",
    alt: "A blue spill from a squeeze container beside a girl wearing a yellow apron.",
  },
  {
    id: 3,
    image: img3,
    correct: "✗",
    alt: "Red musical symbols beside a handled drinking vessel with a saucer.",
  },
  {
    id: 4,
    image: img4,
    correct: "✓",
    alt: "A bottle labeled Glue beside a calendar headed JUNE.",
  },
];
const focusClass =
  " rounded-md focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
const isActivateKey = (e) => e.key === "Enter" || e.key === " ";

const Review8_Page2_Q1 = () => {
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

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [playingId, setPlayingId] = useState(null);
  const [forceStopAudio, setForceStopAudio] = useState(false);
  const exerciseRef = useRef(null);
  const itemAudioRef = useRef(null);
  const timerRef = useRef(null);
  const isLocked = (id) => locked || results[id] === "correct";
  const stopItemSound = () => {
    if (timerRef.current !== null) clearInterval(timerRef.current);
    timerRef.current = null;
    const audio = itemAudioRef.current;
    itemAudioRef.current = null;
    setPlayingId(null);
    if (audio) {
      audio.onloadedmetadata = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const stopInstruction = () => {
    const audio = exerciseRef.current?.querySelector("audio");
    if (audio) {
      audio.pause();
      
    }
    setForceStopAudio(true);
  };
  // const playPair = (index) => {
  //   stopItemSound();
  //   stopInstruction();
  //   const q = questions[index],
  //     segment = captions[index + 1];
  //   const audio = new Audio(sound1);
  //   itemAudioRef.current = audio;
  //   const finish = () => {
  //     if (itemAudioRef.current !== audio) return;
  //     stopItemSound();
  //   };
  //   const fail = () => {
  //     if (itemAudioRef.current !== audio) return;
  //     finish();
  //     setAnnouncement("Audio could not be played. Please try again.");
  //   };
  //   const start = () => {
  //     if (itemAudioRef.current !== audio) return;
  //     audio.onloadedmetadata = null;
  //     try {
  //       audio.currentTime = segment.start;
  //       audio
  //         .play()
  //         .then(() => {
  //           if (itemAudioRef.current !== audio) {
  //             audio.pause();
  //             return;
  //           }
  //           setPlayingId(q.id);
  //           timerRef.current = setInterval(() => {
  //             if (
  //               itemAudioRef.current === audio &&
  //               (audio.currentTime >= segment.end || audio.ended)
  //             )
  //               finish();
  //           }, 50);
  //         })
  //         .catch(fail);
  //     } catch {
  //       fail();
  //     }
  //   };
  //   audio.onended = finish;
  //   audio.onerror = fail;
  //   if (audio.readyState >= 1) start();
  //   else audio.onloadedmetadata = start;
  // };
  useEffect(() => {
    const onOtherPlay = (event) => {
      const audio = itemAudioRef.current;
      if (!audio || event.target === audio) return;
      itemAudioRef.current = null;
      if (timerRef.current !== null) clearInterval(timerRef.current);
      timerRef.current = null;
      audio.onloadedmetadata = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      setPlayingId(null);
    };
    document.addEventListener("play", onOtherPlay, true);
    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      if (timerRef.current !== null) clearInterval(timerRef.current);
      const audio = itemAudioRef.current;
      itemAudioRef.current = null;
      if (audio) {
        audio.onloadedmetadata = null;
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  const selectAnswer = (id, value) => {
    if (isLocked(id)) {
      setAnnouncement(
        `Question ${id} is locked. Press Start Again to try again.`,
      );
      return;
    }
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setResults((prev) => ({ ...prev, [id]: null }));
    setAnnouncement(
      `Question ${id}: ${value === "✓" ? "tick" : "cross"} selected.`,
    );
  };
  const showAnswers = () => {
    stopItemSound();
    stopInstruction();
    setAnswers(Object.fromEntries(questions.map((q) => [q.id, q.correct])));
    setResults(Object.fromEntries(questions.map((q) => [q.id, "correct"])));
    setLocked(true);
    setAnnouncement("All correct answers shown and locked.");
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    stopItemSound();
    stopInstruction();
    if (questions.some((q) => !answers[q.id])) {
      const msg = "Please choose ✓ or ✗ for all questions!";
      ValidationAlert.info(msg);
      setAnnouncement(msg);
      return;
    }
    const next = Object.fromEntries(
      questions.map((q) => [
        q.id,
        results[q.id] === "correct" || answers[q.id] === q.correct
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter(
        (result) => result === "correct",
      ).length,
      total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg = `<div style="font-size:20px;text-align:center;margin-top:8px;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${total}</span></div>`;
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
    setLocked(score === total);
    setAnnouncement(
      [
        `Score ${score} out of ${total}.`,
        ...questions.map(
          (q) =>
            `Question ${q.id} is ${next[q.id] === "correct" ? "correct and locked" : "incorrect"}.`,
        ),
        score < total
          ? "You can change incorrect answers and check again."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  };
  const resetAnswers = () => {
    stopItemSound();
    stopInstruction();
    
    setAnswers({});
    setResults({});
    setLocked(false);
    setAnnouncement("Activity reset. All answers and results cleared.");
  };
  const choiceProps = (q, value) => ({
    type: "button",
    "aria-pressed": answers[q.id] === value,
    "aria-disabled": isLocked(q.id),
    "aria-label": `Question ${q.id}: ${value === "✓" ? "Tick, both have long u" : "Cross, they do not both have long u"}${answers[q.id] === value && results[q.id] ? (results[q.id] === "correct" ? ", correct and locked" : ", incorrect, you can change it") : ""}`,
    style:
      answers[q.id] === value && results[q.id]
        ? {
            borderColor: results[q.id] === "correct" ? "#16a34a" : "#ef4444",
            boxShadow:
              results[q.id] === "correct" ? "0 2px 0 #16a34a" : undefined,
          }
        : undefined,
    onKeyDown: (e) => {
      if (isActivateKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) e.currentTarget.click();
      }
    },
    onKeyUp: (e) => {
      if (isActivateKey(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
  });
  return (
    <div className="main-container-component" ref={exerciseRef}>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="div-forall" style={{ gap: "40px" }}>
        <ExerciseHeader
          sectionLetter="D"
          title={"Do they both have long u? Listen and write ✓ or ✗."}
          subTitle={"Listen to both sounds carefully, then choose Yes/No only after comparing them."}
          isReview={true}
        />
        <div className="flex flex-col gap-5">
          <QuestionAudioPlayer
            src={sound1}
            pageId="sb_review8_page2_q1"
            captions={captions}
            stopAtSecond={10.199}
            forceStop={forceStopAudio}
            onInteract={() => {
              stopItemSound();
              setForceStopAudio(false);
            }}
          />
          <div className="flex justify-center gap-8">
            {questions.map((q) => (
              <div key={q.id} className="flex flex-col items-center w-full">
                <div className="flex gap-2 items-center justify-center">
                  <p className="text-[20px] font-bold h-[60%]">{q.id}.</p>
                  <span
                    // role="button"
                    // tabIndex={0}
                    aria-label={`Question ${q.id}: ${q.alt} Press Enter or Space to hear both words.`}
                    className={`relative inline-block`}
                    // style={
                    //   playingId === q.id
                    //     ? {
                    //         outline: "4px solid #2563eb",
                    //         outlineOffset: 2,
                    //         backgroundColor: "#dbeafe",
                    //       }
                    //     : undefined
                    // }
                    // onClick={() => playPair(index)}
                    // onKeyDown={(e) => {
                    //   if (isActivateKey(e)) {
                    //     e.preventDefault();
                    //     e.stopPropagation();
                    //     // if (!e.repeat) playPair(index);
                    //   }
                    // }}
                    // onKeyUp={(e) => {
                    //   if (isActivateKey(e)) {
                    //     e.preventDefault();
                    //     e.stopPropagation();
                    //   }
                    // }}
                  >
                    <img
                      src={q.image}
                      alt={q.alt}
                      style={{ width: "auto", height: "200px" }}
                      className="rounded-md"
                    />
                    {/* {playingId === q.id && (
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
                          background: "#fff",
                          color: "#000",
                          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
                        }}
                      >
                        <FaVolumeUp size={12} />
                      </span>
                    )} */}
                  </span>
                </div>
                <div className="flex gap-4">
                  {["✓", "✗"].map((value) => (
                    <div key={value} className="relative">
                      <button
                        {...choiceProps(q, value)}
                        onClick={() => selectAnswer(q.id, value)}
                        className={`w-10 h-10 border-2 flex items-center ${value === "✓" ? "ml-5" : ""} justify-center rounded-md text-xl font-bold transition ${answers[q.id] === value ? "border-blue-800 bg-blue-100 text-black" : "bg-white text-black border-gray-500"}${focusClass}`}
                      >
                        <img
                          src={value === "✓" ? trueIcon : falseIcon}
                          alt=""
                          aria-hidden="true"
                          style={{ height: "25px", width: "auto" }}
                        />
                      </button>
                      {results[q.id] === "wrong" && answers[q.id] === value && (
                        <span
                          aria-hidden="true"
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white"
                        >
                          ✕
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={(checkEvent) => { resetCompletedCheck(); (resetAnswers)(checkEvent); }} className="try-again-button">
            Start Again ↻
          </button>
          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};
export default Review8_Page2_Q1;
