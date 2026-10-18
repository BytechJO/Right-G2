/* eslint-disable react-refresh/only-export-components -- Exercise-local controls preserve the shared components. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - I/Item_001_I_want_a_skateboard.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - I/Item_002_I_want_a_chocolate_bar.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - I/Item_003_I_want_a_ball.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - I/Item_004_I_want_a_camera.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 4/Page 25 - I/Item_005_I_want_a_car.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex I 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex I 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex I 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex I 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex I 5.svg";
const exerciseData = {
  right: [
    {
      id: 1,
      img: img1,
    },
    {
      id: 2,
      img: img2,
    },
    {
      id: 3,
      img: img3,
    },
    {
      id: 4,
      img: img4,
    },
    {
      id: 5,
      img: img5,
    },
  ],
  left: [
    {
      id: 1,
      text: "I want a skateboard.",
    },
    {
      id: 2,
      text: "I want a chocolate bar.",
    },
    {
      id: 3,
      text: "I want a ball.",
    },
    {
      id: 4,
      text: "I want a camera.",
    },
    {
      id: 5,
      text: "I want a car.",
    },
  ],
  correctMatches: {
    1: 5,
    2: 4,
    3: 1,
    4: 2,
    5: 3,
  }, // leftId -> rightId
};
const IMAGE_DESCRIPTIONS = {
  [img1]: "A boy in a purple shirt pointing.",
  [img2]: "A girl in a pink jacket pointing.",
  [img3]: "A boy in a green shirt pointing.",
  [img4]: "A girl wearing a blue shirt.",
  [img5]: "A girl wearing a green shirt.",
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
//...
const SOUNDS = {
  "i want a skateboard": sound0,
  "i want a chocolate bar": sound1,
  "i want a ball": sound2,
  "i want a camera": sound3,
  "i want a car": sound4,
};
const soundFor = (text) =>
  SOUNDS[
    String(text)
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .trim()
  ];
function useMatching(correct, imageOrder, textSide = "left") {
  const [matches, setMatches] = useState({}),
    [results, setResults] = useState({}),
    [source, setSource] = useState(null),
    [preview, setPreview] = useState(null),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const containerRef = useRef(null),
    leftDots = useRef({}),
    rightDots = useRef({}),
    leftRefs = useRef({}),
    rightRefs = useRef({}),
    frame = useRef(null);
  const [, setGeometry] = useState(0),
    refresh = () => setGeometry((v) => v + 1),
    ids = Object.keys(correct),
    rightIds = imageOrder.map(String);
  const locked = (side, id) =>
    revealed ||
    (side === "left"
      ? results[id] === "correct"
      : Object.entries(matches).some(
          ([left, right]) =>
            String(right) === String(id) && results[left] === "correct",
        ));
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (side, id) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      (side === "left" ? leftRefs : rightRefs).current[id]?.focus();
    });
  };
  useEffect(() => {
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(refresh);
    if (containerRef.current) observer?.observe(containerRef.current);
    window.addEventListener("resize", refresh);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", refresh);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);
  useEffect(() => {
    const id = requestAnimationFrame(refresh);
    return () => cancelAnimationFrame(id);
  }, [matches, source, preview]);
  const cancel = () => {
    cancelFocus();
    setSource(null);
    setPreview(null);
    setMessage("Connection cancelled.");
  };
  const choose = (side, id, keyboard = false) => {
    id = String(id);
    if (locked(side, id)) return;
    if (!source || source.side === side) {
      if (source?.side === side && source.id === id) {
        cancel();
        return;
      }
      setSource({
        side,
        id,
      });
      setPreview(null);
      setMessage("Selected. Choose an endpoint on the opposite side.");
      if (keyboard) {
        const other = side === "left" ? "right" : "left",
          next = (other === "left" ? ids : rightIds).find(
            (id) => !locked(other, id),
          );
        if (next !== undefined) focus(other, next);
      }
      return;
    }
    const left = side === "left" ? id : source.id,
      right = side === "right" ? id : source.id;
    if (locked("left", left) || locked("right", right)) return;
    const next = {
        ...matches,
      },
      affected = [left];
    for (const [previous, value] of Object.entries(next))
      if (String(value) === right && previous !== left) {
        if (locked("left", previous)) return;
        delete next[previous];
        affected.push(previous);
      }
    next[left] = right;
    setMatches(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([id]) => !affected.includes(id)),
      ),
    );
    setSource(null);
    setPreview(null);
    setMessage("Pair connected.");
    if (keyboard) {
      const nextId = (textSide === "left" ? ids : rightIds).find(
        (id) => !locked(textSide, id),
      );
      if (nextId) focus(textSide, nextId);
    }
  };
  const endpointProps = (side, id, label) => ({
    role: "button",
    tabIndex: source && (source.side === side || locked(side, id)) ? -1 : 0,
    "aria-label":
      label +
      (locked(side, id) ? ". Correct and locked." : ". Matching endpoint."),
    "aria-disabled": locked(side, id),
    "aria-pressed": source?.side === side && source.id === String(id),
    onKeyDown: (e) => {
      if (e.key === "Escape" && source) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        const list = side === "left" ? ids : rightIds,
          step = e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 1;
        for (let n = 1; n <= list.length; n++) {
          const next =
            list[
              (list.indexOf(String(id)) + step * n + list.length) % list.length
            ];
          if (!locked(side, next)) {
            focus(side, next);
            break;
          }
        }
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) choose(side, id, true);
    },
    onKeyUp: release,
    onFocus: () => {
      if (source && source.side !== side && !locked(side, id))
        setPreview({
          side,
          id: String(id),
        });
    },
    onMouseEnter: () => {
      if (source && source.side !== side && !locked(side, id))
        setPreview({
          side,
          id: String(id),
        });
    },
    onMouseLeave: () => setPreview(null),
    style: {
      position: "relative",
      borderRadius: "8px",
      ...(source?.side === side && source.id === String(id)
        ? {
            outline: "3px solid #2563eb",
            backgroundColor: "#dbeafe",
            outlineOffset: 2,
          }
        : {}),
      ...(locked(side, id)
        ? {
            // boxShadow: "inset 0 0 0 2px #16a34a",
            border :"2px solid #16a34a",
            padding :"2px"
          }
        : {}),
    },
  });
  const point = (side, id) => {
    const el = (side === "left" ? leftDots : rightDots).current[id],
      root = containerRef.current;
    if (!el || !root) return null;
    const r = el.getBoundingClientRect(),
      c = root.getBoundingClientRect();
    return {
      x:
        ((side === "left" ? r.right : r.left) - c.left) /
        (root.clientWidth ? c.width / root.clientWidth : 1),
      y:
        (r.top + r.height / 2 - c.top) /
        (root.clientHeight ? c.height / root.clientHeight : 1),
    };
  };
  const line = (left, right) => {
    const a = point("left", left),
      b = point("right", right);
    return a && b
      ? {
          left,
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
        }
      : null;
  };
  const lines = Object.entries(matches)
    .map(([left, right]) => line(left, right))
    .filter(Boolean);
  const previewLine =
    source && preview && source.side !== preview.side
      ? line(
          source.side === "left" ? source.id : preview.id,
          source.side === "right" ? source.id : preview.id,
        )
      : null;
  const evaluate = () => {
    cancel();
    const next = Object.fromEntries(
      ids.map((id) => [
        id,
        results[id] === "correct" || String(matches[id]) === String(correct[id])
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    return next;
  };
  const show = () => {
    cancel();
    setMatches(
      Object.fromEntries(
        Object.entries(correct).map(([left, right]) => [left, String(right)]),
      ),
    );
    setResults(Object.fromEntries(ids.map((id) => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct connections shown and locked.");
  };
  const reset = () => {
    cancel();
    setMatches({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  return {
    matches,
    results,
    source,
    preview,
    revealed,
    message,
    setMessage,
    containerRef,
    leftDots,
    rightDots,
    leftRefs,
    rightRefs,
    choose,
    endpointProps,
    lines,
    previewLine,
    evaluate,
    show,
    reset,
    cancel,
    cancelFocus,
    locked,
    refresh,
  };
}
const WB_Unit4_Page25_Q1 = () => {
  const match = useMatching(
    exerciseData.correctMatches,
    exerciseData.right.map((item) => item.id),
  );
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();
  const message = match.message,
    containerRef = match.containerRef;
  const matches = match.matches,
    lines = match.lines.map((l) => ({
      ...l,
      id: l.left + "-" + matches[l.left],
    }));
  const selectedLeft =
      match.source?.side === "left" ? Number(match.source.id) : null,
    selectedRight =
      match.source?.side === "right" ? Number(match.source.id) : null;
  const complete = Object.keys(exerciseData.correctMatches).every(
    (id) => match.results[id] === "correct",
  );
  useCheckButton(rootRef, complete || match.revealed);
  const isWrongMatch = (id) => match.results[id] === "wrong";
  const getLineColor = (id) =>
    match.results[id.split("-")[0]] === "correct" ? "#16a34a" : "#ef4444";
  const getDotColor = (side, id) =>
    match.locked(side, id) ? "bg-green-600" : "bg-[#eb533c]";
  const handleLeftClick = (id) => {
    const item = exerciseData.left.find((item) => item.id === id);
    playSound("text-" + id, soundFor(item.text));
    match.choose("left", id);
  };
  const handleRightClick = (id) => match.choose("right", id);
  const endpoint = (side, item) => {
    const props = match.endpointProps(
      side,
      item.id,
      side === "left" ? item.text : IMAGE_DESCRIPTIONS[item.img],
    );
    return {
      ...props,
      onClick: () =>
        side === "left" ? handleLeftClick(item.id) : handleRightClick(item.id),
      onKeyDown: (e) => {
        if (side === "left" && ["Enter", " "].includes(e.key) && !e.repeat)
          playSound("text-" + item.id, soundFor(item.text));
        props.onKeyDown(e);
      },
      style: {
        ...props.style,
        ...(side === "left" && playingKey === "text-" + item.id
          ? {
              outline: "3px solid #2563eb",
              outlineOffset: 2,
              backgroundColor: "#dbeafe",
            }
          : {}),
      },
    };
  };
  const checkAnswers = () => {
    if (complete || match.revealed) return;
    stopAudio();
    match.cancel();
    if (exerciseData.left.some((item) => !matches[item.id])) {
      match.setMessage("Please connect all items first.");
      ValidationAlert.info("Please connect all items first.");
      return;
    }
    const next = match.evaluate(),
      score = Object.values(next).filter((v) => v === "correct").length,
      total = exerciseData.left.length;
    match.setMessage(
      "Score " + score + " out of " + total + ". Correct pairs are locked.",
    );
    showCheckFeedback(
      rootRef.current,
      score === total ? "success" : score ? "warning" : "error",
      "Score: " + score + " / " + total,
    );
  };
  const handleShowAnswer = () => {
      stopAudio();
      match.show();
    },
    handleStartAgain = () => {
      stopAudio();
      match.reset();
    };
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
        className="div-forall mb-5"
        style={{
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="I"
          title={<>Look, read, and match.</>}
          subTitle={"Start with one picture or phrase, then connect it to the matching jobs and wants partner."}
        />

        <div
          ref={containerRef}
          className="flex justify-between items-center gap-20 relative"
        >
          {/* Right Side (Text) */}
          <div className="space-y-24">
            {exerciseData.left.map((item) => (
              <div
                key={item.id}
                className="relative flex items-center gap-6 justify-start"
              >
                <div className="w-50">
                  <p
                    {...endpoint("left", item)}
                    ref={(el) => {
                      match.leftRefs.current[item.id] = el;
                    }}
                    className={`${focusClass} text-xl cursor-pointer transition transform active:scale-95
    ${selectedLeft === item.id ? "text-red-600 underline scale-105" : "text-gray-700 hover:scale-105 hover:text-blue-600"}
  `}
                  >
                    {item.text}
                    {playingKey === "text-" + item.id && <SpeakerBadge />}
                  </p>
                </div>
                <div
                  ref={(el) => (match.leftDots.current[item.id] = el)}
                  onClick={() => handleLeftClick(item.id)}
                  onMouseEnter={endpoint("left", item).onMouseEnter}
                  onMouseLeave={endpoint("left", item).onMouseLeave}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("left", item.id)}`}
                />
                {isWrongMatch(item.id) && (
                  <div className="absolute -top-2 right-8 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                    ✕
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {exerciseData.right.map((item) => (
              <div key={item.id} className="flex items-center gap-6">
                <div
                  ref={(el) => (match.rightDots.current[item.id] = el)}
                  onClick={() => handleRightClick(item.id)}
                  onMouseEnter={endpoint("right", item).onMouseEnter}
                  onMouseLeave={endpoint("right", item).onMouseLeave}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("right", item.id)}`}
                />
                <img
                  src={item.img}
                  alt={IMAGE_DESCRIPTIONS[item.img]}
                  {...endpoint("right", item)}
                  ref={(el) => {
                    match.rightRefs.current[item.id] = el;
                  }}
                  onLoad={match.refresh}
                  className={`${focusClass} object-contain cursor-pointer transition transform active:scale-95
    ${selectedRight === item.id ? "border-2 border-red-600 scale-95 shadow-lg" : "hover:scale-105"}
  `}
                  style={{
                    ...endpoint("right", item).style,
                    height: "100px",
                    width: "215px",
                  }}
                />
              </div>
            ))}
          </div>

          {/* SVG Container for Lines */}
          <svg
            aria-hidden="true"
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            {match.previewLine && (
              <line
                {...match.previewLine}
                stroke="#2563eb"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
            )}
            {lines.map((line) => (
              <line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={getLineColor(line.id)}
                strokeWidth="3"
                strokeLinecap="round"
              />
            ))}
          </svg>
        </div>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};
export default WB_Unit4_Page25_Q1;
