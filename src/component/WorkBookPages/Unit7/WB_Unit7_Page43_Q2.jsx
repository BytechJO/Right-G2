/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 43 - J/Item_001_She_talks_at_the_reception_desk.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 43 - J/Item_002_She_rolls_her_suitcase_in_the_airport.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 7/Page 43 - J/Item_003_I_carry_the_suitcase_in_my_hand.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 7/Page 43 - J/Item_004_The_flight_attendant_smiles.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 43/Ex J 4.svg";
const IMAGE_DESCRIPTIONS = {
  [img1]: "A man carrying a suitcase.",
  [img2]: "A woman in uniform speaking on a telephone.",
  [img3]: "A woman pulling a wheeled suitcase.",
  [img4]: "A woman in uniform sitting at a computer at a desk.",
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
  "she talks at the reception desk": clip0,
  "she rolls her suitcase in the airport": clip1,
  "i carry the suitcase in my hand": clip2,
  "the flight attendant smiles": clip3,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/:/g, " ")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const soundFor = (text) => SOUNDS[normalized(text)];
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
            border: "2px solid #16a34a",
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
  ],
  left: [
    {
      id: 1,
      text: "She talks at the reception desk.",
    },
    {
      id: 2,
      text: " She rolls her suitcase in the airport.",
    },
    {
      id: 3,
      text: "I carry the suitcase in my hand.",
    },
    {
      id: 4,
      text: "The flight attendant smiles.",
    },
  ],
  correctMatches: {
    1: 4,
    2: 3,
    3: 1,
    4: 2,
  },
};
const WB_Unit7_Page43_Q2 = () => {
  const match = useMatching(
    exerciseData.correctMatches,
    exerciseData.right.map((item) => item.id),
  );
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();
  const message = match.message,
    containerRef = match.containerRef,
    matches = match.matches,
    lines = match.lines.map((l) => ({
      ...l,
      id: l.left + "-" + matches[l.left],
    }));
  const selectedLeft =
      match.source?.side === "left" ? Number(match.source.id) : null,
    selectedRight =
      match.source?.side === "right" ? Number(match.source.id) : null;
  const complete = exerciseData.left.every(
    (item) => match.results[item.id] === "correct",
  );
  const completionRef = useRef(false);
  completionRef.current = complete || match.revealed;
  useCheckButton(rootRef, complete || match.revealed);
  const getLineColor = (id) =>
      match.results[id.split("-")[0]] === "correct" ? "#16a34a" : "#ef4444",
    getDotColor = (side, id) =>
      match.locked(side, id) ? "bg-green-600" : "bg-[#ef4444]";
  const endpoint = (side, item) => {
    const p = match.endpointProps(
      side,
      item.id,
      item.text || "Picture " + item.id,
    );
    const listen = () => {
      if (item.text) playSound(side + "-" + item.id, soundFor(item.text));
    };
    return {
      ...p,
      onClick: () => {
        listen();
        match.choose(side, item.id);
      },
      onKeyDown: (e) => {
        if (["Enter", " "].includes(e.key) && !e.repeat) listen();
        p.onKeyDown(e);
      },
      style: {
        ...p.style,
        ...(playingKey === side + "-" + item.id
          ? {
              outline: "3px solid #2563eb",
              outlineOffset: 2,
              backgroundColor: "#dbeafe",
            }
          : {}),
      },
    };
  };
  const handleLeftClick = (id) =>
      endpoint(
        "left",
        exerciseData.left.find((item) => item.id === id),
      ).onClick(),
    handleRightClick = (id) => match.choose("right", id);
  const checkAnswers = () => {
    if (completionRef.current) return;
    stopAudio();
    match.cancel();
    if (exerciseData.left.some((item) => !matches[item.id])) {
      match.setMessage("You have unanswered questions.");
      ValidationAlert.info("You have unanswered questions.");
      return;
    }
    const next = match.evaluate(),
      score = Object.values(next).filter((v) => v === "correct").length,
      total = exerciseData.left.length;
    completionRef.current = score === total;
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
    //.
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
          gap: "10px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="J"
          title="Look, read, and match."
          subTitle={"Start with one picture or phrase, then connect it to the matching days, months, travel, and time partner."}
        />

        <div
          ref={containerRef}
          className="flex justify-between items-center gap-20 relative mb-10"
        >
          <div className="space-y-20">
            {exerciseData.left.map((item) => {
              const isWrong = match.results[item.id] === "wrong";
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-6 justify-end relative"
                >
                  {/* ❌ Wrong Icon */}
                  {isWrong && (
                    <div className="absolute -top-2 right-22 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                      ✕
                    </div>
                  )}
                  <span className="text-2xl text-blue-900 font-bold">
                    {item.id}
                  </span>
                  <div
                    className={
                      focusClass +
                      " " +
                      `flex items-center gap-3 w-[315px] justify-start cursor-pointer transition transform active:scale-95
  ${selectedLeft === item.id ? "text-red-600 underline scale-110" : "hover:scale-105"}
`
                    }
                    {...endpoint("left", item)}
                    ref={(el) => {
                      match.leftRefs.current[item.id] = el;
                    }}
                  >
                    <p
                      className={`text-xl text-right ${selectedLeft === item.id ? "text-red-600" : "text-gray-700"}`}
                    >
                      {item.text}
                    </p>
                    {playingKey === "left-" + item.id && <SpeakerBadge />}
                  </div>
                  <div
                    ref={(el) => (match.leftDots.current[item.id] = el)}
                    onClick={() => handleLeftClick(item.id)}
                    className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("left", item.id)}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {exerciseData.right.map((item) => (
              <div key={item.id} className="flex items-center gap-6">
                <div
                  ref={(el) => (match.rightDots.current[item.id] = el)}
                  onClick={() => handleRightClick(item.id)}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("right", item.id)}`}
                />
                <img
                  src={item.img}
                  className={
                    focusClass +
                    " " +
                    `object-contain cursor-pointer transition transform active:scale-95
  ${selectedRight === item.id ? "scale-110 ring-2 ring-red-600 rounded-lg" : "hover:scale-105"}
`
                  }
                  {...endpoint("right", item)}
                  ref={(el) => {
                    match.rightRefs.current[item.id] = el;
                  }}
                  onLoad={match.refresh}
                  style={{
                    ...endpoint("right", item).style,
                    height: "110px",
                    width: "110px",
                  }}
                  alt={
                    IMAGE_DESCRIPTIONS[item.img] ||
                    "Illustration for this exercise"
                  }
                />
              </div>
            ))}
          </div>

          {/* SVG Container for Lines */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <>
              {match.previewLine && (
                <line
                  {...match.previewLine}
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              )}
            </>
            {lines.map((line) => (
              <path
                key={line.id}
                d={`
    M ${line.x1} ${line.y1}
    C ${(line.x1 + line.x2) / 2} ${line.y1},
      ${(line.x1 + line.x2) / 2} ${line.y2},
      ${line.x2} ${line.y2}
  `}
                stroke={getLineColor(line.id)}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="6 6"
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
export default WB_Unit7_Page43_Q2;
