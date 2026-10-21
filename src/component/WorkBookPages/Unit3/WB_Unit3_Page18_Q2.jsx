import ExerciseHeader from "../../ExerciseHeader";
import { stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 18 - H/Item_001_Can_he_play_the_drum.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 18 - H/Item_002_Can_she_swim.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 18 - H/Item_003_Can_she_drive_the_car.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 3/Page 18 - H/Item_004_Can_she_make_sandwiches.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 3/Page 18 - H/Item_005_Yes,_he_can.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 3/Page 18 - H/Item_006_Yes,_she_can.mp3";
import sound6 from "../../../assets/audio/WorkBook/Unit 3/Page 18 - H/Item_007_No,_she_can't.mp3";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex H 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex H 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex H 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 18/Ex H 4.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit3_Page18_Q2.css";

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
const release = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
  }
};

const SOUNDS = {
  "can he play the drum": sound0,
  "can she swim": sound1,
  "can she drive the car": sound2,
  "can she make sandwiches": sound3,
  "yes, he can": sound4,
  "yes, she can": sound5,
  "no, she can't": sound6,
};
const IMAGE_DESCRIPTIONS = {
  [img1]: "A girl swimming.",
  [img2]: "Children at a picnic table with food.",
  [img3]: "A boy and a girl beside a red car.",
  [img4]: "A boy playing a drum.",
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
function useQueueAudio() {
  const rootRef = useRef(null),
    audioRef = useRef(null),
    tokenRef = useRef(0);
  const [playingKey, setPlayingKey] = useState(null);
  const halt = () => {
    tokenRef.current++;
    const audio = audioRef.current;
    audioRef.current = null;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const stopAudio = () => {
    halt();
    setPlayingKey(null);
  };
  const playSound = (key, sources) => {
    const clips = (Array.isArray(sources) ? sources : [sources]).filter(
      Boolean,
    );
    if (!clips.length) return;
    stopAudio();
    stopGlobalAudio();
    rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
    const token = tokenRef.current;
    setPlayingKey(key);
    const next = (index) => {
      if (token !== tokenRef.current) return;
      if (index === clips.length) {
        audioRef.current = null;
        setPlayingKey(null);
        return;
      }
      const a = new Audio(clips[index]);
      audioRef.current = a;
      const current = () =>
        token === tokenRef.current && audioRef.current === a;
      const fail = () => {
        if (current()) stopAudio();
      };
      a.onerror = fail;
      a.onended = () => {
        if (!current()) return;
        a.onended = null;
        a.onerror = null;
        next(index + 1);
      };
      try {
        a.play().catch(fail);
      } catch {
        fail();
      }
    };
    next(0);
  };
  useEffect(() => {
    const state = audioRef,
      tokens = tokenRef;
    const onPlay = (e) => {
      if (e.target?.tagName !== "AUDIO") return;
      tokens.current++;
      const a = state.current;
      state.current = null;
      if (a) {
        a.onended = null;
        a.onerror = null;
        a.pause();
      }
      setPlayingKey(null);
    };
    document.addEventListener("play", onPlay, true);
    return () => {
      document.removeEventListener("play", onPlay, true);
      tokens.current++;
      const a = state.current;
      state.current = null;
      if (a) {
        a.onended = null;
        a.onerror = null;
        a.pause();
      }
    };
  }, []);
  return {
    rootRef,
    playingKey,
    playSound,
    stopAudio,
  };
}
function useMatching(correct, imageOrder) {
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
      const nextId = ids.find((id) => !locked("left", id));
      if (nextId) focus("left", nextId);
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
            boxShadow: "inset 0 0 0 2px #16a34a",
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
        (r.left + r.width / 2 - c.left) /
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
const WB_Unit3_Page18_Q2 = () => {
  const correctMatches = [
    {
      word: "Can he play the drum? \nYes, he can.",
      image: "img4",
    },
    {
      word: "Can she swim?\n Yes, she can.",
      image: "img1",
    },
    {
      word: "Can she drive the car?\n No, she can't.",
      image: "img3",
    },
    {
      word: "Can she make sandwiches? \n Yes, she can.",
      image: "img2",
    },
  ];
  const words = correctMatches.map((item, index) => ({
    id: `word-${index}`,
    text: item.word,
  }));
  const images = [
    {
      id: "img1",
      src: img1,
    },
    {
      id: "img2",
      src: img2,
    },
    {
      id: "img3",
      src: img3,
    },
    {
      id: "img4",
      src: img4,
    },
  ];
  const correct = Object.fromEntries(
    correctMatches.map((p, i) => ["word-" + i, p.image]),
  );
  const match = useMatching(
    correct,
    images.map((img) => img.id),
  );
  const { rootRef, playingKey, playSound, stopAudio } = useQueueAudio();
  const message = match.message,
    containerRef = match.containerRef;
  const selectedWord = match.source?.side === "left" ? match.source.id : null,
    selectedImage = match.source?.side === "right" ? match.source.id : null;
  const locked = Object.keys(correct).every(
      (id) => match.results[id] === "correct",
    ),
    showAnswer = match.revealed;
  const wrongImages = Object.keys(match.results).filter(
    (id) => match.results[id] === "wrong",
  );
  const lines = match.lines.map((l) => ({
    ...l,
    wordId: l.left,
  }));
  const checkAnswers2 = () => {
    if (showAnswer || locked) return;
    stopAudio();
    match.cancel();
    if (Object.keys(match.matches).length < correctMatches.length) {
      ValidationAlert.info("Please connect all the pairs before checking.");
      match.setMessage("Please connect all the pairs before checking.");
      return;
    }
    const next = match.evaluate(),
      score = Object.values(next).filter((v) => v === "correct").length,
      color =
        score === correctMatches.length ? "green" : score ? "orange" : "red",
      msg = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${score} / ${correctMatches.length}</span></div>`;
    match.setMessage(
      "Score: " +
        score +
        " / " +
        correctMatches.length +
        ". Correct pairs locked.",
    );
    showCheckFeedback(rootRef.current, score === correctMatches.length ? "success" : score ? "warning" : "error", msg);
  };
  useCheckButton(rootRef, locked || showAnswer);
  const endpoint = (side, id, label) => {
    const sound = () => {
      if (side !== "left") return;
      const word = words.find((w) => w.id === id);
      playSound(
        "text-" + id,
        word.text
          .split("\n")
          .map((part) => SOUNDS[part.trim().slice(0, -1).toLowerCase()]),
      );
    };
    return {
      ...match.endpointProps(side, id, label),
      onClick: () => {
        sound();
        match.choose(side, id);
      },
      onKeyDown: (e) => {
        if ((e.key === "Enter" || e.key === " ") && !e.repeat) sound();
        match.endpointProps(side, id, label).onKeyDown(e);
      },
      style: {
        ...match.endpointProps(side, id, label).style,
        ...(playingKey === "text-" + id
          ? {
              boxShadow: "0 0 0 3px #2563eb",
              backgroundColor: "#dbeafe",
            }
          : {}),
      },
    };
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
        className="div-forall"
        style={{
          gap: "40px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="H"
          title={"Read, look, and match."}
          subTitle={
            "Start with one picture or phrase, then connect it to the matching picnic and ability partner."
          }
        />

        <div className="CB-review3-p1-q2-wrapper" ref={containerRef}>
          {/* الجمل */}
          <div
            className="CB-review3-p1-q2-words-row"
            style={{
              gap: "0px",
            }}
          >
            {words.map((wordObj, index) => (
              <div
                key={wordObj.id}
                className="CB-review3-p1-q2-word-box"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <div className="flex gap-1">
                  <span
                    style={{
                      color: "darkblue",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    {index + 1}
                  </span>
                  <div
                    style={{
                      position: "relative",
                    }}
                    className={` ${selectedWord === wordObj.id ? "scale-95" : ""} `}
                  >
                    <h5
                      className={
                        `WB-unit3-page18-q2-word ${selectedWord === wordObj.id ? "text-red-600 underline" : ""} ${locked || showAnswer ? "WB-unit3-page18-q2-disabled-hover" : ""}` +
                        " " +
                        focusClass
                      }
                      {...endpoint("left", wordObj.id, wordObj.text)}
                      ref={(el) => {
                        match.leftRefs.current[wordObj.id] = el;
                      }}
                    >
                      {wordObj.text.split("\n").map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                      {playingKey === "text-" + wordObj.id && <SpeakerBadge />}
                    </h5>

                    {wrongImages.includes(wordObj.id) && (
                      <span className="CB-review3-p1-q2-error-mark">✕</span>
                    )}
                  </div>

                  <div
                    className={`CB-review3-p1-q2-dot CB-review3-p1-q2-start-dot ${selectedWord === wordObj.id ? "bg-red-600 scale-125 shadow-lg" : ""}`}
                    style={{
                      top: "100%",
                      left: "45%",
                    }}
                    data-word-id={wordObj.id}
                    id={`${wordObj.id}-dot`}
                    ref={(el) => {
                      match.leftDots.current[wordObj.id] = el;
                    }}
                    onClick={() => endpoint("left", wordObj.id, "").onClick()}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* الصور */}
          <div
            className="CB-review3-p1-q2-images-row"
            style={{
              justifyContent: "space-around",
            }}
          >
            {images.map((img) => (
              <div
                key={img.id}
                className={"CB-review3-p1-q2-img-box" + " " + focusClass}
                {...endpoint("right", img.id, IMAGE_DESCRIPTIONS[img.src])}
                ref={(el) => {
                  match.rightRefs.current[img.id] = el;
                }}
              >
                <img
                  src={img.src}
                  className={`CB-review3-p1-q2-image ${selectedImage === img.id ? "border-2 border-red-600 scale-95 shadow-lg" : ""} ${locked || showAnswer ? "WB-unit3-page18-q2-disabled-hover" : ""}`}
                  alt={IMAGE_DESCRIPTIONS[img.src]}
                  style={{ borderRadius: "10px" }}
                  onLoad={match.refresh}
                />

                <div
                  className={`CB-review3-p1-q2-dot CB-review3-p1-q2-end-dot ${selectedImage === img.id ? "bg-red-600 scale-125 shadow-lg" : ""}`}
                  // style={{left:"92px"}}
                  data-image={img.id}
                  id={`${img.id}-dot`}
                  ref={(el) => {
                    match.rightDots.current[img.id] = el;
                  }}
                  onClick={() => endpoint("right", img.id, "").onClick()}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>

          {/* الخطوط */}
          <svg
            className="lines-layer"
            style={{
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            {lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke={
                  match.results[l.wordId] === "correct"
                    ? "#16a34a"
                    : match.results[l.wordId] === "wrong"
                      ? "#ef4444"
                      : "red"
                }
                strokeWidth="3"
              />
            ))}
            {match.previewLine && (
              <line
                {...match.previewLine}
                stroke="#2563eb"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
            )}
          </svg>
        </div>
      </div>

      <div className="action-buttons-container">
        <button
          onClick={() => {
            stopAudio();
            match.reset();
          }}
          className="try-again-button"
        >
          Start Again ↻
        </button>
        {/* Show Answer */}
        <button
          onClick={() => {
            stopAudio();
            match.show();
          }}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>
        <button onClick={checkAnswers2} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};
export default WB_Unit3_Page18_Q2;
