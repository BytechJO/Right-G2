import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import sound0 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - B/Item_001_rabbit.mp3";
import sound1 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - B/Item_002_flower.mp3";
import sound2 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - B/Item_003_duck.mp3";
import sound3 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - B/Item_004_horse.mp3";
import sound4 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - B/Item_005_tree.mp3";
import sound5 from "../../../assets/audio/WorkBook/Unit 2/Page 9 - B/Item_006_cloud.mp3";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 8.svg";
import img9 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 9.svg";
import img10 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 10.svg";
import img11 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 11.svg";
import img12 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 9/Ex B 12.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
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



const leftParts = [
  { id: 1, text: "rabbit" },
  { id: 2, text: "flower" },
  { id: 3, text: "duck" },
  { id: 4, text: "horse" },
  { id: 5, text: "tree" },
  { id: 6, text: "cloud" },
];

const images = [
  { id: "img1", src: img1 },
  { id: "img2", src: img2 },
  { id: "img3", src: img3 },
  { id: "img4", src: img4 },
  { id: "img5", src: img5 },
  { id: "img6", src: img6 },
];

const rightParts = [
  { id: "r1", src: img7 },
  { id: "r2", src: img8 },
  { id: "r3", src: img9 },
  { id: "r4", src: img10 },
  { id: "r5", src: img11 },
  { id: "r6", src: img12 },
];

const correctMatches = [
  { leftId: 2, centerId: "img1", rightId: "r3" },
  { leftId: 5, centerId: "img2", rightId: "r5" },
  { leftId: 1, centerId: "img3", rightId: "r1" },
  { leftId: 6, centerId: "img4", rightId: "r2" },
  { leftId: 4, centerId: "img5", rightId: "r6" },
  { leftId: 3, centerId: "img6", rightId: "r4" },
];

const IMAGE_DESCRIPTIONS = {
  [img1]: "A single green leaf.",
  [img2]: "Part of a tree with its trunk and green leaves.",
  [img3]: "Part of a rabbit ear.",
  [img4]: "Part of a grey cloud.",
  [img5]: "Two horse legs with hooves.",
  [img6]: "A duck bill.",
  [img7]: "A brown rabbit.",
  [img8]: "Three grey clouds.",
  [img9]: "A blue flower.",
  [img10]: "A duck swimming in water.",
  [img11]: "A green tree.",
  [img12]: "A brown horse.",
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

const SOUNDS = {
  rabbit: sound0,
  flower: sound1,
  duck: sound2,
  horse: sound3,
  tree: sound4,
  cloud: sound5,
};
const WB_Unit2_Page9_Q2 = () => {
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

  const containerRef = useRef(null),
    endpointRefs = useRef({}),
    frame = useRef(null);
  const [lines, setLines] = useState([]),
    [firstPoint, setFirstPoint] = useState(null),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [preview, setPreview] = useState(null),
    [message, setMessage] = useState(""),
    [, setGeometry] = useState(0);
  const { rootRef, playingKey, playSound, stopAudio } = useExerciseAudio();
  const checked = true,
    locked = false;
  const key = (id, image) => id + "-" + image;
  const group = (image) => (String(image).startsWith("img") ? "top" : "bottom");
  const expected = (id, g) => {
    const c = correctMatches.find((c) => c.leftId === Number(id));
    return g === "top" ? c.centerId : c.rightId;
  };
  const imageLocked = (image) =>
    revealed ||
    lines.some(
      (l) => l.image === image && results[key(l.leftId, l.image)] === "correct",
    );
  const textLocked = (id) =>
    revealed ||
    ["top", "bottom"].every((g) =>
      lines.some(
        (l) =>
          l.leftId === Number(id) &&
          group(l.image) === g &&
          results[key(l.leftId, l.image)] === "correct",
      ),
    );
  const pointLocked = (p) =>
    p.type === "centerText" ? textLocked(p.id) : imageLocked(p.id);
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (p) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      endpointRefs.current[p.type + "-" + p.id]?.focus();
    });
  };
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  useEffect(() => {
    const refresh = () => setGeometry((n) => n + 1);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(refresh)
        : null;
    if (containerRef.current) observer?.observe(containerRef.current);
    window.addEventListener("resize", refresh);
    refresh();
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, []);
  const textPoints = leftParts.map((p) => ({
      type: "centerText",
      id: p.id,
    })),
    topPoints = images.map((p) => ({
      type: "leftImg",
      id: p.id,
    })),
    bottomPoints = rightParts.map((p) => ({
      type: "rightImg",
      id: p.id,
    }));
  const targets = (p) =>
    p.type === "centerText"
      ? [...topPoints, ...bottomPoints].filter(
          (v) =>
            !imageLocked(v.id) &&
            !lines.some(
              (l) =>
                l.leftId === p.id &&
                group(l.image) === group(v.id) &&
                results[key(l.leftId, l.image)] === "correct",
            ),
        )
      : textPoints.filter(
          (v) =>
            !textLocked(v.id) &&
            !lines.some(
              (l) =>
                l.leftId === v.id &&
                group(l.image) === group(p.id) &&
                results[key(l.leftId, l.image)] === "correct",
            ),
        );
  const cancel = () => {
    cancelFocus();
    if (firstPoint) focus(firstPoint);
    setFirstPoint(null);
    setPreview(null);
    setMessage("Connection cancelled.");
  };
  const activatePoint = (p, keyboard = false) => {
    if (p.type === "centerText")
      playSound(
        "text-" + p.id,
        SOUNDS[leftParts.find((v) => v.id === p.id).text],
      );
    if (pointLocked(p)) {
      setMessage("This answer is correct and locked.");
      return;
    }
    if (!firstPoint) {
      setFirstPoint(p);
      setPreview(null);
      setMessage("Choose an available opposite endpoint.");
      if (keyboard) {
        const target = targets(p)[0];
        if (target) focus(target);
      }
      return;
    }
    if (firstPoint.type === p.type && firstPoint.id === p.id) {
      cancel();
      return;
    }
    if ((firstPoint.type === "centerText") === (p.type === "centerText")) {
      setFirstPoint(p);
      setPreview(null);
      if (keyboard && targets(p)[0]) focus(targets(p)[0]);
      return;
    }
    const text = firstPoint.type === "centerText" ? firstPoint : p,
      image = firstPoint.type === "centerText" ? p : firstPoint,
      g = group(image.id);
    if (!targets(firstPoint).some((t) => t.id === p.id && t.type === p.type))
      return;
    const affected = lines.filter(
      (l) =>
        group(l.image) === g && (l.leftId === text.id || l.image === image.id),
    );
    if (affected.some((l) => results[key(l.leftId, l.image)] === "correct"))
      return;
    const next = lines.filter((l) => !affected.includes(l));
    next.push({
      leftId: text.id,
      image: image.id,
    });
    setLines(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(
          ([id]) => !affected.some((l) => key(l.leftId, l.image) === id),
        ),
      ),
    );
    setFirstPoint(null);
    setPreview(null);
    setMessage("Connection made.");
    if (keyboard) {
      const nextText = textPoints.find(
        (v) =>
          !["top", "bottom"].every((g) =>
            next.some(
              (l) =>
                l.leftId === v.id &&
                group(l.image) === g &&
                results[key(l.leftId, l.image)] === "correct",
            ),
          ),
      );
      if (nextText) focus(nextText);
    }
  };
  const endpointProps = (p) => ({
    role: "button",
    tabIndex:
      firstPoint &&
      !targets(firstPoint).some((t) => t.type === p.type && t.id === p.id)
        ? -1
        : 0,
    "aria-pressed": firstPoint?.type === p.type && firstPoint?.id === p.id,
    "aria-disabled": pointLocked(p),
    "aria-label":
      p.type === "centerText"
        ? leftParts.find((t) => t.id === p.id).text +
          (textLocked(p.id) ? ". Correct and locked." : ". Match this word.")
        : (p.type === "leftImg" ? "Upper" : "Lower") +
          " picture " +
          Number(String(p.id).replace(/\D/g, "")) +
          ". " +
          IMAGE_DESCRIPTIONS[
            (p.type === "leftImg" ? images : rightParts).find(
              (item) => item.id === p.id,
            ).src
          ] +
          (imageLocked(p.id) ? " Correct and locked." : " Match this picture."),
    onClick: () => activatePoint(p),
    onFocus: () => {
      if (
        firstPoint &&
        targets(firstPoint).some((t) => t.type === p.type && t.id === p.id)
      )
        setPreview(p);
    },
    onMouseEnter: () => {
      if (
        firstPoint &&
        targets(firstPoint).some((t) => t.type === p.type && t.id === p.id)
      )
        setPreview(p);
    },
    onMouseLeave: () => setPreview(null),
    onKeyDown: (e) => {
      if (e.key === "Escape" && firstPoint) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) return;
        const list = (
          p.type === "centerText"
            ? textPoints
            : p.type === "leftImg"
              ? topPoints
              : bottomPoints
        ).filter(
          (v) =>
            !pointLocked(v) &&
            (!firstPoint ||
              targets(firstPoint).some(
                (target) => target.type === v.type && target.id === v.id,
              )),
        );
        const i = list.findIndex((v) => v.id === p.id),
          d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
        const next = list[(i + d + list.length) % list.length];
        if (next) focus(next);
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) activatePoint(p, true);
    },
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: 8,
      ...(firstPoint?.type === p.type && firstPoint?.id === p.id
        ? {
            outline: "3px solid #2563eb",
            backgroundColor: "#dbeafe",
          }
        : {}),
      ...(pointLocked(p)
        ? {
            boxShadow: "0 0 0 2px #16a34a",
          }
        : {}),
      ...(playingKey === "text-" + p.id && p.type === "centerText"
        ? {
            outline: "3px solid #2563eb",
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const getDotCenter = (p, selector) => {
    const el = endpointRefs.current[p.type + "-" + p.id],
      container = containerRef.current;
    if (!el || !container) return null;
    const dot = el.querySelector(selector);
    if (!dot) return null;
    const r = dot.getBoundingClientRect(),
      c = container.getBoundingClientRect(),
      sx = container.clientWidth ? c.width / container.clientWidth : 1,
      sy = container.clientHeight ? c.height / container.clientHeight : 1;
    return {
      x: (r.left - c.left + r.width / 2) / sx,
      y: (r.top - c.top + r.height / 2) / sy,
    };
  };
  const geometry = (l) => {
    const g = group(l.image),
      text = {
        type: "centerText",
        id: l.leftId,
      },
      image = {
        type: g === "top" ? "leftImg" : "rightImg",
        id: l.image,
      };
    const p = getDotCenter(text, g === "top" ? ".dot-top" : ".dot-bottom"),
      q = getDotCenter(image, ".dot");
    return p && q
      ? {
          ...l,
          x1: p.x,
          y1: p.y,
          x2: q.x,
          y2: q.y,
        }
      : null;
  };
  const drawnLines = lines.map(geometry).filter(Boolean),
    previewLine =
      firstPoint && preview
        ? geometry({
            leftId:
              firstPoint.type === "centerText" ? firstPoint.id : preview.id,
            image:
              firstPoint.type === "centerText" ? preview.id : firstPoint.id,
          })
        : null;
  const wrongLineIndexes = drawnLines.map((l, i) =>
    results[key(l.leftId, l.image)] === "wrong" ? i : -1,
  );
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (revealed) return;
    cancelFocus();
    stopAudio();
    setFirstPoint(null);
    setPreview(null);
    if (!lines.length) {
      ValidationAlert.warning("Please connect the items first.");
      setMessage("Please connect the items first.");
      return;
    }
    const next = Object.fromEntries(
      lines.map((l) => [
        key(l.leftId, l.image),
        l.image === expected(l.leftId, group(l.image)) ? "correct" : "wrong",
      ]),
    );
    setResults(next);
    const score = correctMatches.filter(
        (c) =>
          next[key(c.leftId, c.centerId)] === "correct" &&
          next[key(c.leftId, c.rightId)] === "correct",
      ).length,
      msg = "Score: " + score + " / " + correctMatches.length;
    setMessage(
      msg +
        ". Correct connections are locked. Other connections can be changed.",
    );
    (((score === correctMatches.length ? "success" : "warning") === "success") && completeCheck(checkEvent), showCheckFeedback(rootRef.current, score === correctMatches.length ? "success" : "warning", msg));
  };
  const handleShowAnswer = () => {
    cancelFocus();
    stopAudio();
    const next = correctMatches.flatMap((c) => [
      {
        leftId: c.leftId,
        image: c.centerId,
      },
      {
        leftId: c.leftId,
        image: c.rightId,
      },
    ]);
    setLines(next);
    setResults(
      Object.fromEntries(next.map((l) => [key(l.leftId, l.image), "correct"])),
    );
    setRevealed(true);
    setFirstPoint(null);
    setPreview(null);
    setMessage("Correct connections shown and locked.");
  };
  const handleTryAgain = () => {
    cancelFocus();
    stopAudio();
    setLines([]);
    setResults({});
    setRevealed(false);
    setFirstPoint(null);
    setPreview(null);
    setMessage("Exercise reset.");
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
      <div className="div-forall" style={{ gap: "40px" }}>
        <ExerciseHeader
          isWorkbook
          sectionLetter="B"
          title={"Look, read, and match."}
          subTitle={"Start with one picture or phrase, then connect it to the matching park partner."}
        />

        <div className="flex flex-col items-center">
          <div
            className="flex flex-col items-center w-full relative"
            style={{
              justifyContent: "space-between",
              width: "85%",
              gap: "90px",
            }}
            ref={containerRef}
          >
            {/* Left Column (Images) */}
            <div className="flex flex-row gap-5 w-full justify-between">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`${focusClass} relative cursor-pointer ${locked ? "opacity-50" : ""} ${firstPoint?.id === img.id ? "ring-2 ring-red-600 rounded" : ""}`}
                  data-image={img.id}
                  {...endpointProps({ type: "leftImg", id: img.id })}
                  ref={(el) => {
                    endpointRefs.current["leftImg-" + img.id] = el;
                  }}
                >
                  <div className="dot w-3 h-3 bg-red-500 rounded-full absolute -bottom-3 right-10" />
                  <img
                    src={img.src}
                    alt={IMAGE_DESCRIPTIONS[img.src] || ""}
                    className="object-cover"
                    style={{ height: "90px", width: "100px" }}
                  />
                </div>
              ))}
            </div>

            {/* Center Column (Texts) */}
            <div className="flex flex-row gap-0 w-full justify-between">
              {leftParts.map((l, i) => (
                <div
                  key={i}
                  className={`${focusClass} w-[100px] flex flex-col items-center gap-5 p-2 cursor-pointer border rounded ${locked ? "opacity-50" : ""} ${firstPoint?.id === l.id && firstPoint?.type === "centerText" ? "bg-red-100 border-red-600" : "border-transparent"}`}
                  data-left-id={l.id}
                  {...endpointProps({ type: "centerText", id: l.id })}
                  ref={(el) => {
                    endpointRefs.current["centerText-" + l.id] = el;
                  }}
                >
                  <div className="dot dot-top w-3 h-3 bg-red-500 rounded-full" />
                  <span>{l.text}</span>
                  {playingKey === "text-" + l.id && <SpeakerBadge />}

                  <div className="dot dot-bottom w-3 h-3 bg-red-500 rounded-full" />
                </div>
              ))}
            </div>

            {/* Right Column (Images) */}
            <div className="flex flex-row gap-5 w-full justify-between">
              {rightParts.map((r) => (
                <div
                  key={r.id}
                  className={`${focusClass} relative cursor-pointer ${locked ? "opacity-50" : ""} ${firstPoint?.id === r.id ? "ring-2 ring-blue-400 rounded" : ""}`}
                  data-image={r.id}
                  {...endpointProps({ type: "rightImg", id: r.id })}
                  ref={(el) => {
                    endpointRefs.current["rightImg-" + r.id] = el;
                  }}
                >
                  <div className="dot w-3 h-3 bg-red-500 rounded-full absolute -top-3 right-11" />
                  <img
                    src={r.src}
                    alt={IMAGE_DESCRIPTIONS[r.src] || ""}
                    style={{ height: "90px", width: "100px" }}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* SVG Layer for Lines */}
            <svg
              aria-hidden="true"
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            >
              {drawnLines.map((l, i) => {
                const midX = (l.x1 + l.x2) / 2;
                const midY = (l.y1 + l.y2) / 2;

                return (
                  <g key={i}>
                    <line
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      stroke={
                        results[key(l.leftId, l.image)] === "correct"
                          ? "#16a34a"
                          : "red"
                      }
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {checked && wrongLineIndexes.includes(i) && (
                      <>
                        <circle
                          cx={midX + 12}
                          cy={midY - 12}
                          r="9"
                          fill="red"
                        />
                        <text
                          x={midX + 12}
                          y={midY - 12}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="white"
                          fontSize="14"
                          fontWeight="bold"
                        >
                          ✕
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
              {previewLine && (
                <line
                  x1={previewLine.x1}
                  y1={previewLine.y1}
                  x2={previewLine.x2}
                  y2={previewLine.y2}
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeDasharray="6,5"
                />
              )}
            </svg>
          </div>

          <div className="mt-16">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={(checkEvent) => { resetCompletedCheck(); (handleTryAgain)(checkEvent); }}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit2_Page9_Q2;
