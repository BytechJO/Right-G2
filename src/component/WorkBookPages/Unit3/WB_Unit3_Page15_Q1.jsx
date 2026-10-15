import ExerciseHeader from "../../ExerciseHeader";
import { stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 3/Page 15 - A/Item_001_It_can't_swim.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 3/Page 15 - A/Item_002_He_can_play_the_drum.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 3/Page 15 - A/Item_003_He_can't_ride_a_bike.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 3/Page 15 - A/Item_004_It_can_climb_the_tree.mp3";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 15/Asset 13.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 15/Asset 14.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 15/Asset 15.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 15/Asset 16.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit3_Page15_Q1.css";
import Button from "../Button";

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


const rows = [
  {
    id: 1,
    number: 1,
    text: "It can’t swim.",
    wordKey: "swim",
    imageKey: "img1",
    img: img1,
    imgHeight: "100px",
  },
  {
    id: 2,
    number: 2,
    text: "He can play the drum.",
    wordKey: "drum",
    imageKey: "img2",
    img: img2,
    imgHeight: "100px",
  },
  {
    id: 3,
    number: 3,
    text: "He can’t ride a bike.",
    wordKey: "bike",
    imageKey: "img3",
    img: img3,
    imgHeight: "100px",
  },
  {
    id: 4,
    number: 4,
    text: "It can climb the tree.",
    wordKey: "tree",
    imageKey: "img4",
    img: img4,
    imgHeight: "100px",
  },
];
const correctMatches = [
  {
    word: "swim",
    image: "img4",
  },
  {
    word: "drum",
    image: "img3",
  },
  {
    word: "bike",
    image: "img1",
  },
  {
    word: "tree",
    image: "img2",
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
const release = (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
  }
};

const SOUNDS = {
  "it can't swim": sound0,
  "he can play the drum": sound1,
  "he can't ride a bike": sound2,
  "it can climb the tree": sound3,
};
const IMAGE_DESCRIPTIONS = {
  [img1]: "A boy on a bicycle with his arms raised.",
  [img2]: "A white cat climbing a tree.",
  [img3]: "A boy playing a drum.",
  [img4]: "An orange cat in a pool.",
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
const WB_Unit3_Page15_Q1 = () => {
  const correct = Object.fromEntries(
    correctMatches.map((p) => [p.word, p.image]),
  );
  const match = useMatching(
    correct,
    rows.map((r) => r.imageKey),
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
  const isWordWrong = (id) => match.results[id] === "wrong";
  const lines = match.lines.map((l) => ({
    ...l,
    word: l.left,
    image: match.matches[l.left],
  }));
  const handleShowAnswer = () => {
      stopAudio();
      match.show();
    },
    resetState = () => {
      stopAudio();
      match.reset();
    };
  const handleCheckAnswers = () => {
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
      msg = "Score: " + score + " / " + correctMatches.length;
    match.setMessage(msg + ". Correct pairs are locked.");
    showCheckFeedback(rootRef.current, score === correctMatches.length ? "success" : score ? "warning" : "error", msg);
  };
  useCheckButton(rootRef, locked || showAnswer);
  const endpoint = (side, id, label) => ({
    ...match.endpointProps(side, id, label),
    onClick: () => {
      if (side === "left") {
        const row = rows.find((r) => r.wordKey === id);
        playSound(
          "text-" + id,
          SOUNDS[row.text.slice(0, -1).replaceAll("’", "'").toLowerCase()],
        );
      }
      match.choose(side, id);
    },
    onKeyDown: (e) => {
      if (
        side === "left" &&
        (e.key === "Enter" || e.key === " ") &&
        !e.repeat
      ) {
        const row = rows.find((r) => r.wordKey === id);
        playSound(
          "text-" + id,
          SOUNDS[row.text.slice(0, -1).replaceAll("’", "'").toLowerCase()],
        );
      }
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
  });
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
          sectionLetter="A"
          title={<>Read, look, and match.</>}
          subTitle={"Start with one picture or phrase, then connect it to the matching picnic and ability partner."}
        />

        <div className="WB-unit2-page15-q1-matching-area" ref={containerRef}>
          {rows.map((row) => (
            <div key={row.id} className="WB-unit2-page15-q1-row">
              <div className="WB-unit2-page15-q1-word-side">
                <span className="WB-unit2-page15-q1-number">{row.number}</span>

                <span
                  className={
                    `WB-unit2-page15-q1-word-text ${selectedWord === row.wordKey ? "text-red-600 underline" : ""} ${locked || showAnswer ? "WB-unit2-page15-q1-disabled-hover" : ""}` +
                    " " +
                    focusClass
                  }
                  {...endpoint("left", row.wordKey, row.text)}
                  ref={(el) => {
                    match.leftRefs.current[row.wordKey] = el;
                  }}
                >
                  {row.text}
                  {playingKey === "text-" + row.wordKey && <SpeakerBadge />}
                </span>

                {isWordWrong(row.wordKey) && (
                  <span className="WB-unit2-page15-q1-error-mark">✕</span>
                )}

                <div className="WB-unit2-page15-q1-dot-wrapper">
                  <div
                    className={`WB-unit2-page15-q1-dot WB-unit2-page15-q1-start-dot ${selectedWord === row.wordKey ? "bg-red-600 scale-125 shadow-lg" : ""}`}
                    data-word={row.wordKey}
                    ref={(el) => {
                      match.leftDots.current[row.wordKey] = el;
                    }}
                    onClick={() => endpoint("left", row.wordKey, "").onClick()}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="WB-unit2-page15-q1-image-side">
                <div className="WB-unit2-page15-q1-dot-wrapper">
                  <div
                    className={`WB-unit2-page15-q1-dot WB-unit2-page15-q1-end-dot ${selectedImage === row.imageKey ? "bg-red-600 scale-125 shadow-lg" : ""}`}
                    data-image={row.imageKey}
                    ref={(el) => {
                      match.rightDots.current[row.imageKey] = el;
                    }}
                    onClick={() =>
                      endpoint("right", row.imageKey, "").onClick()
                    }
                    aria-hidden="true"
                  />
                </div>

                <div
                  className={focusClass}
                  {...endpoint(
                    "right",
                    row.imageKey,
                    IMAGE_DESCRIPTIONS[row.img],
                  )}
                  ref={(el) => {
                    match.rightRefs.current[row.imageKey] = el;
                  }}
                >
                  <img
                    src={row.img}
                    className={`${selectedImage === row.imageKey ? "border-2 border-red-600 scale-95 shadow-lg" : ""} ${locked || showAnswer ? "WB-unit2-page15-q1-disabled-hover" : ""}`}
                    style={{
                      height: "100px",
                      width: "auto",
                    }}
                    alt={IMAGE_DESCRIPTIONS[row.img]}
                    onLoad={match.refresh}
                  />
                </div>
              </div>
            </div>
          ))}

          <svg
            className="WB-unit2-page15-q1-lines-layer"
            style={{
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            {lines.map((line, index) => (
              <line
                key={`${line.word}-${line.image}-${index}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={
                  match.results[line.word] === "correct"
                    ? "#16a34a"
                    : match.results[line.word] === "wrong"
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

      <div className="flex justify-center">
        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={resetState}
          checkAnswers={handleCheckAnswers}
        />
      </div>
    </div>
  );
};
export default WB_Unit3_Page15_Q1;
