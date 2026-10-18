/* eslint-disable react-refresh/only-export-components -- Drawing and audio controls are exercise-local. */
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import blankClock from "../../../assets/imgs/WorkBook/Right Int WB G2 U6 Folder/Page 35/Ex F 2.svg";
import clockAudio0 from "../../../assets/audio/WorkBook/Unit 6/Page 35 - F/Item_001_It_is_ten_o'clock.mp3";
import clockAudio1 from "../../../assets/audio/WorkBook/Unit 6/Page 35 - F/Item_002_It_is_half_past_three.mp3";
import clockAudio2 from "../../../assets/audio/WorkBook/Unit 6/Page 35 - F/Item_003_It_is_five_o'clock.mp3";
import clockAudio3 from "../../../assets/audio/WorkBook/Unit 6/Page 35 - F/Item_004_It_is_half_past_nine.mp3";
import clockAudio4 from "../../../assets/audio/WorkBook/Unit 6/Page 35 - F/Item_005_It_is_six_o'clock.mp3";
import clockAudio5 from "../../../assets/audio/WorkBook/Unit 6/Page 35 - F/Item_006_It_is_half_past_two.mp3";
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
const questions = [
  "It is ten o’clock.",
  "It is half past three.",
  "It is five o’clock.",
  "It is half past nine.",
  "It is six o’clock.",
  "It is half past two.",
];
const correct = [
  {
    h: 10,
    m: 0,
    p: "am",
  },
  {
    h: 3,
    m: 30,
    p: "am",
  },
  {
    h: 5,
    m: 0,
    p: "am",
  },
  {
    h: 9,
    m: 30,
    p: "am",
  },
  {
    h: 6,
    m: 0,
    p: "am",
  },
  {
    h: 2,
    m: 30,
    p: "am",
  },
];
const questionSounds = [
  clockAudio0,
  clockAudio1,
  clockAudio2,
  clockAudio3,
  clockAudio4,
  clockAudio5,
];
const MINUTE_STEP = 30;
const CLOCK_SIZE = 200;
// Center of the existing Workbook clock artwork in its 200 x 200 overlay.
const CLOCK_CENTER = {
  x: 98,
  y: 96.3,
};
const HANDS = {
  hour: {
    length: 43,
    width: 7,
    knob: 9,
    color: "#2c5287",
    hit: 28,
  },
  minute: {
    length: 68,
    width: 4,
    knob: 8,
    color: "#e53935",
    hit: 30,
  },
};
const initialTimes = () =>
  questions.map(() => ({
    h: 12,
    m: 0,
    touched: false,
  }));
const digitalTime = (time) => time.h + ":" + String(time.m).padStart(2, "0");
const spokenTime = (time) =>
  time.m === 0 ? time.h + " o'clock" : time.h + " thirty";
function releaseHandCapture(drag) {
  if (!drag) return;
  try {
    if (drag.node.hasPointerCapture(drag.pointerId))
      drag.node.releasePointerCapture(drag.pointerId);
  } catch {
    /* The hand may have unmounted or lost capture. */
  }
}
const WB_Unit6_Page35_Q2 = () => {
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();
  const [times, setTimes] = useState(initialTimes);
  const [results, setResults] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [focusedHand, setFocusedHand] = useState(null);
  const timesRef = useRef(times),
    resultsRef = useRef(results),
    revealedRef = useRef(revealed);
  const svgRefs = useRef({}),
    dragRef = useRef(null);
  const isLocked = (i) =>
    revealedRef.current || resultsRef.current[i] === "correct";
  const complete = questions.every((_, i) => results[i] === "correct");
  const checkDisabled = revealed || complete;
  const writeTimes = (next) => {
    timesRef.current = next;
    setTimes(next);
  };
  const writeResults = (next) => {
    resultsRef.current = next;
    setResults(next);
  };
  const cancelDrag = (announce = false) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    writeTimes(
      timesRef.current.map((time, i) =>
        i === drag.index ? drag.before : time,
      ),
    );
    writeResults({
      ...resultsRef.current,
      [drag.index]: drag.beforeResult,
    });
    releaseHandCapture(drag);
    if (announce)
      setAnnouncement(
        "Clock " +
          (drag.index + 1) +
          ": movement cancelled. The previous time is restored.",
      );
  };
  useEffect(() => {
    const state = dragRef;
    return () => {
      const drag = state.current;
      state.current = null;
      releaseHandCapture(drag);
    };
  }, []);
  const commit = (i, patch) => {
    if (isLocked(i)) return;
    const next = timesRef.current.map((time, index) =>
      index === i
        ? {
            ...time,
            ...patch,
            touched: true,
          }
        : time,
    );
    writeTimes(next);
    writeResults({
      ...resultsRef.current,
      [i]: null,
    });
    return next[i];
  };
  const announceTime = (i, hand) =>
    setAnnouncement(
      "Clock " +
        (i + 1) +
        ", " +
        hand +
        " hand. The time is " +
        spokenTime(timesRef.current[i]) +
        ".",
    );
  const resetClock = (i) => {
    if (isLocked(i)) return;
    cancelDrag();
    writeTimes(
      timesRef.current.map((time, index) =>
        index === i
          ? {
              h: 12,
              m: 0,
              touched: false,
            }
          : time,
      ),
    );
    writeResults({
      ...resultsRef.current,
      [i]: null,
    });
    setAnnouncement(
      "Clock " + (i + 1) + " reset. Set its time before checking.",
    );
  };
  const onHandKeyDown = (event, i, hand) => {
    if (event.key === "Escape" && dragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      cancelDrag(true);
      return;
    }
    if (
      ![
        "ArrowUp",
        "ArrowRight",
        "ArrowDown",
        "ArrowLeft",
        "Enter",
        " ",
        "Backspace",
        "Delete",
      ].includes(event.key)
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    if (isLocked(i)) return;
    if (
      event.repeat &&
      ["Enter", " ", "Backspace", "Delete"].includes(event.key)
    )
      return;
    cancelDrag();
    setFocusedHand({
      index: i,
      hand,
    });
    if (event.key === "Backspace" || event.key === "Delete") {
      resetClock(i);
      return;
    }
    const direction =
      event.key === "ArrowDown" || event.key === "ArrowLeft" ? -1 : 1;
    const time = timesRef.current[i];
    commit(
      i,
      hand === "hour"
        ? {
            h: ((time.h - 1 + direction + 12) % 12) + 1,
          }
        : {
            m: (time.m + direction * MINUTE_STEP + 60) % 60,
          },
    );
    announceTime(i, hand);
  };
  const onHandKeyUp = (event) => {
    if (
      [
        "Enter",
        " ",
        "Backspace",
        "Delete",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown",
        "ArrowLeft",
        "Escape",
      ].includes(event.key)
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  const pointerAngle = (i, event) => {
    const svg = svgRefs.current[i];
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const dx =
      ((event.clientX - rect.left) * CLOCK_SIZE) / rect.width - CLOCK_CENTER.x;
    const dy =
      ((event.clientY - rect.top) * CLOCK_SIZE) / rect.height - CLOCK_CENTER.y;
    if (!Number.isFinite(dx) || !Number.isFinite(dy) || Math.hypot(dx, dy) < 6)
      return null;
    return ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
  };
  const moveHand = (i, hand, angle) => {
    if (isLocked(i)) return;
    const time = timesRef.current[i];
    const value =
      hand === "hour"
        ? Math.round(((angle - time.m / 2 + 360) % 360) / 30) % 12 || 12
        : (Math.round(angle / 6 / MINUTE_STEP) * MINUTE_STEP) % 60;
    if (value === (hand === "hour" ? time.h : time.m) && time.touched) return;
    commit(
      i,
      hand === "hour"
        ? {
            h: value,
          }
        : {
            m: value,
          },
    );
  };
  const ownDrag = (event, i, hand) => {
    const drag = dragRef.current;
    return drag &&
      drag.pointerId === event.pointerId &&
      drag.node === event.currentTarget &&
      drag.index === i &&
      drag.hand === hand
      ? drag
      : null;
  };
  const onHandPointerDown = (event, i, hand) => {
    if (isLocked(i) || dragRef.current || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      return;
    }
    dragRef.current = {
      index: i,
      hand,
      pointerId: event.pointerId,
      node: event.currentTarget,
      before: {
        ...timesRef.current[i],
      },
      beforeResult: resultsRef.current[i],
    };
    setFocusedHand({
      index: i,
      hand,
    });
    event.currentTarget.focus({
      preventScroll: true,
    });
  };
  const onHandPointerMove = (event, i, hand) => {
    if (!ownDrag(event, i, hand) || isLocked(i)) return;
    event.preventDefault();
    event.stopPropagation();
    const angle = pointerAngle(i, event);
    if (angle !== null) moveHand(i, hand, angle);
  };
  const onHandPointerEnd = (event, i, hand, cancelled) => {
    const drag = ownDrag(event, i, hand);
    if (!drag) return;
    event.preventDefault();
    event.stopPropagation();
    if (cancelled) {
      cancelDrag(true);
      return;
    }
    onHandPointerMove(event, i, hand);
    dragRef.current = null;
    releaseHandCapture(drag);
    if (timesRef.current[i].touched) announceTime(i, hand);
  };
  const checkAnswers = () => {
    if (
      revealedRef.current ||
      questions.every((_, i) => resultsRef.current[i] === "correct")
    )
      return;
    cancelDrag();
    stopAudio();
    if (timesRef.current.some((time) => !time.touched)) {
      const message = "Please set the time on every clock.";
      setAnnouncement(message);
      ValidationAlert.info(message);
      return;
    }
    const next = Object.fromEntries(
      timesRef.current.map((time, i) => [
        i,
        resultsRef.current[i] === "correct" ||
        (time.h === correct[i].h && time.m === correct[i].m)
          ? "correct"
          : "wrong",
      ]),
    );
    writeResults(next);
    const score = Object.values(next).filter(
        (result) => result === "correct",
      ).length,
      total = questions.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const message =
      '<div style="font-size:20px;text-align:center;"><span style="color:' +
      color +
      ';font-weight:bold;">Score: ' +
      score +
      " / " +
      total +
      "</span></div>";
    setAnnouncement(
      "Score " +
        score +
        " out of " +
        total +
        ". " +
        questions
          .map(
            (_, i) =>
              "Clock " +
              (i + 1) +
              (next[i] === "correct"
                ? " is correct and locked."
                : " is not correct. Change it and check again."),
          )
          .join(" "),
    );
    showCheckFeedback(
      rootRef.current,
      score === total ? "success" : score ? "warning" : "error",
      message,
    );
  };
  const showAnswers = () => {
    if (revealedRef.current) return;
    cancelDrag();
    stopAudio();
    setFocusedHand(null);
    writeTimes(
      correct.map((time) => ({
        h: time.h,
        m: time.m,
        touched: true,
      })),
    );
    writeResults(Object.fromEntries(questions.map((_, i) => [i, "correct"])));
    revealedRef.current = true;
    setRevealed(true);
    setAnnouncement("All correct clock times are shown and locked.");
  };
  const reset = () => {
    cancelDrag();
    stopAudio();
    setFocusedHand(null);
    writeTimes(initialTimes());
    writeResults({});
    revealedRef.current = false;
    setRevealed(false);
    setAnnouncement(
      "Activity reset. All clocks, locks and results are cleared.",
    );
  };
  //....
  return (
    <div ref={rootRef} className="main-container-component">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div
        className="div-forall"
        style={{
          gap: "15px",
          marginBottom:"50px"
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="F"
          title="Read and draw."
          subTitle={
            "Read the time phrase first, then draw both clock hands to match it."
          }
        />
        <p id="wb-unit6-p35-q2-help" className="sr-only">
          Press a sentence to hear it. Tab reaches the hour hand and then the
          minute hand. Drag a hand with a mouse, touch or pen, or use the arrows
          to adjust it. Enter or Space advances the focused hand once. Hours
          move by one and minutes move by 30. Backspace or Delete resets an
          editable clock. Escape cancels a pending drag. The digital time is
          read-only. Check Answer checks the time; correct clocks lock and
          incorrect clocks remain editable.
        </p>
        <div>
          <div
            className="grid grid-cols-2 gap-y-5 mb-5"
            style={{
              justifyItems: "center",
            }}
          >
            {questions.map((question, i) => {
              const time = times[i],
                locked = isLocked(i),
                status = results[i];
              const ring =
                status === "correct"
                  ? "#16a34a"
                  : status === "wrong"
                    ? "#ef4444"
                    : null;
              const hourAngle = (time.h % 12) * 30 + time.m / 2,
                minuteAngle = time.m * 6;
              const gap = Math.abs(
                ((hourAngle - minuteAngle + 540) % 360) - 180,
              );
              const hands = [
                {
                  name: "hour",
                  angle: hourAngle,
                  hitFrom: 0,
                },
                {
                  name: "minute",
                  angle: minuteAngle,
                  hitFrom: gap < 25 ? HANDS.hour.length + 10 : 0,
                },
              ];
              const statusText = revealed
                ? "Correct answer shown: " + spokenTime(time)
                : status === "correct"
                  ? "Correct and locked: " + spokenTime(time)
                  : status === "wrong"
                    ? "Not correct. Set to " +
                      spokenTime(time) +
                      ". Change the hands and check again."
                    : time.touched
                      ? "Set to " + spokenTime(time)
                      : "Not set yet.";
              return (
                <div key={i} className="flex flex-col gap-2.5">
                  <div className="text-[20px]">
                    <span className="font-bold mr-1.5 text-blue-900">
                      {i + 1}
                    </span>
                    <AudioText
                      audioKey={"question-" + i}
                      src={questionSounds[i]}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      {question}
                    </AudioText>
                  </div>
                  <div
                    role="group"
                    aria-label={"Clock " + (i + 1) + ". " + statusText}
                    className="flex flex-col gap-2.5"
                  >
                    <div
                      className="relative"
                      style={{
                        width: CLOCK_SIZE,
                        height: CLOCK_SIZE,
                        borderRadius: "50%",
                        ...(ring
                          ? {
                              outline: "3px solid " + ring,
                              outlineOffset: 2,
                            }
                          : {}),
                      }}
                    >
                      <img
                        src={blankClock}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      />
                      <svg
                        ref={(element) => {
                          svgRefs.current[i] = element;
                        }}
                        role="group"
                        aria-label={"Hands of clock " + (i + 1)}
                        viewBox="0 0 200 200"
                        width="100%"
                        height="100%"
                        className="absolute inset-0 w-full h-full"
                        style={{
                          overflow: "visible",
                          touchAction: "none",
                          userSelect: "none",
                          WebkitTouchCallout: "none",
                        }}
                      >
                        {hands.map(({ name, angle, hitFrom }) => {
                          const spec = HANDS[name],
                            focused =
                              !locked &&
                              focusedHand?.index === i &&
                              focusedHand.hand === name;
                          const tipY = CLOCK_CENTER.y - spec.length;
                          return (
                            <g
                              key={name}
                              role="slider"
                              tabIndex={locked ? -1 : 0}
                              aria-label={
                                "Clock " + (i + 1) + ", " + name + " hand"
                              }
                              aria-valuemin={name === "hour" ? 1 : 0}
                              aria-valuemax={name === "hour" ? 12 : 59}
                              aria-valuenow={name === "hour" ? time.h : time.m}
                              aria-valuetext={
                                name === "hour"
                                  ? "Hour " + time.h
                                  : time.m + " minutes"
                              }
                              aria-disabled={locked}
                              aria-describedby="wb-unit6-p35-q2-help"
                              transform={
                                "rotate(" +
                                angle +
                                " " +
                                CLOCK_CENTER.x +
                                " " +
                                CLOCK_CENTER.y +
                                ")"
                              }
                              onFocus={() =>
                                setFocusedHand({
                                  index: i,
                                  hand: name,
                                })
                              }
                              onBlur={() =>
                                setFocusedHand((previous) =>
                                  previous?.index === i &&
                                  previous.hand === name
                                    ? null
                                    : previous,
                                )
                              }
                              onKeyDown={(event) =>
                                onHandKeyDown(event, i, name)
                              }
                              onKeyUp={onHandKeyUp}
                              onPointerDown={(event) =>
                                onHandPointerDown(event, i, name)
                              }
                              onPointerMove={(event) =>
                                onHandPointerMove(event, i, name)
                              }
                              onPointerUp={(event) =>
                                onHandPointerEnd(event, i, name, false)
                              }
                              onPointerCancel={(event) =>
                                onHandPointerEnd(event, i, name, true)
                              }
                              onLostPointerCapture={(event) =>
                                onHandPointerEnd(event, i, name, true)
                              }
                              style={{
                                outline: "none",
                                cursor: locked ? "default" : "grab",
                              }}
                            >
                              {focused && (
                                <g
                                  aria-hidden="true"
                                  style={{
                                    pointerEvents: "none",
                                  }}
                                >
                                  <line
                                    x1={CLOCK_CENTER.x}
                                    y1={CLOCK_CENTER.y}
                                    x2={CLOCK_CENTER.x}
                                    y2={tipY}
                                    stroke="#2563eb"
                                    strokeOpacity=".45"
                                    strokeWidth={spec.width + 10}
                                    strokeLinecap="round"
                                  />
                                  <circle
                                    cx={CLOCK_CENTER.x}
                                    cy={tipY}
                                    r={spec.knob + 5}
                                    fill="#2563eb"
                                    fillOpacity=".45"
                                  />
                                </g>
                              )}
                              <line
                                x1={CLOCK_CENTER.x}
                                y1={CLOCK_CENTER.y + 10}
                                x2={CLOCK_CENTER.x}
                                y2={tipY}
                                stroke={spec.color}
                                strokeWidth={spec.width}
                                strokeLinecap="round"
                              />
                              <circle
                                cx={CLOCK_CENTER.x}
                                cy={tipY}
                                r={spec.knob}
                                fill={spec.color}
                                stroke="#fff"
                                strokeWidth="2"
                              />
                              <line
                                x1={CLOCK_CENTER.x}
                                y1={CLOCK_CENTER.y - hitFrom}
                                x2={CLOCK_CENTER.x}
                                y2={tipY}
                                stroke="transparent"
                                strokeWidth={spec.hit}
                                strokeLinecap="round"
                                style={{
                                  pointerEvents: "stroke",
                                }}
                              />
                            </g>
                          );
                        })}
                        <circle
                          cx={CLOCK_CENTER.x}
                          cy={CLOCK_CENTER.y}
                          r="5"
                          fill="#333"
                          stroke="#fff"
                          strokeWidth="1.5"
                          style={{
                            pointerEvents: "none",
                          }}
                        />
                      </svg>
                      {status === "wrong" && (
                        <span
                          aria-hidden="true"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md border-2 border-white"
                          style={{
                            backgroundColor: ring,
                            pointerEvents: "none",
                          }}
                        >
                          {status === "correct" ? "" : "✕"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <output
                          aria-hidden="true"
                          className="flex items-center justify-center gap-2.5 border-2 rounded-[14px] w-[200px] h-20 bg-[#f4f4f4] text-[26px] font-semibold"
                          style={{
                            borderColor: ring || "#e7a98e",
                          }}
                        >
                          {time.touched ? digitalTime(time) : "--:--"}
                        </output>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="action-buttons-container">
          <button type="button" className="try-again-button" onClick={reset}>
            Start Again ↻
          </button>
          <button
            type="button"
            onClick={showAnswers}
            className="show-answer-btn"
          >
            Show Answer
          </button>
          <button
            type="button"
            className="check-button2"
            onClick={checkAnswers}
            disabled={checkDisabled}
            style={{
              cursor: checkDisabled ? "not-allowed" : undefined,
            }}
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};
export default WB_Unit6_Page35_Q2;
