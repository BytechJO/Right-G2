/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_001_eat_breakfast.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_002_go_to_school.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_003_English_class.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_004_go_to_bed.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_005_Molly.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_006_Sandra.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_007_Wesley.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_008_Albert.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_009_6_30_a.m.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_010_7_00_a.m.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_011_1_00_p.m.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_012_8_00_p.m.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_013_7_30_a.m.mp3";
import clip13 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_014_11_00_a.m.mp3";
import clip14 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_015_10_00_p.m.mp3";
import clip15 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_016_8_10_a.m.mp3";
import clip16 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_017_12_30_p.m.mp3";
import clip17 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_018_9_00_p.m.mp3";
import clip18 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_019_10_00_a.m.mp3";
import clip19 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_020_9_30_p.m.mp3";
import clip20 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_021_Sandra_goes_to_school.mp3";
import clip21 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_022_Molly_eats_breakfast.mp3";
import clip22 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_023_Wesley_has_English_class.mp3";
import clip23 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_024_Albert_goes_to_bed.mp3";
import clip24 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_025_Molly_has_English_class.mp3";
import clip25 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_026_at_12_30_p.m.mp3";
import clip26 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_027_at_1_00_p.m.mp3";
import clip27 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_028_at_7_30_a.m.mp3";
import clip28 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_029_at_7_00_a.m.mp3";
import clip29 from "../../../assets/audio/WorkBook/Unit 6/Page 37 - I/Item_030_at_8_00_a.m.mp3";
import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
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
  "eat breakfast": clip0,
  "go to school": clip1,
  "english class": clip2,
  "go to bed": clip3,
  molly: clip4,
  sandra: clip5,
  wesley: clip6,
  albert: clip7,
  "6 30 am": clip8,
  "7 00 am": clip9,
  "1 00 pm": clip10,
  "8 00 pm": clip11,
  "7 30 am": clip12,
  "11 00 am": clip13,
  "10 00 pm": clip14,
  "8 10 am": clip15,
  "12 30 pm": clip16,
  "9 00 pm": clip17,
  "10 00 am": clip18,
  "9 30 pm": clip19,
  "sandra goes to school": clip20,
  "molly eats breakfast": clip21,
  "wesley has english class": clip22,
  "albert goes to bed": clip23,
  "molly has english class": clip24,
  "at 12 30 pm": clip25,
  "at 1 00 pm": clip26,
  "at 7 30 am": clip27,
  "at 7 00 am": clip28,
  "at 8 00 am": clip29,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replaceAll("â€™", "'")
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
      text: "at 12:30 p.m.",
    },
    {
      id: 2,
      text: "at 1:00 p.m.",
    },
    {
      id: 3,
      text: "at 7:30 a.m.",
    },
    {
      id: 4,
      text: "at 7:00 a.m.",
    },
    {
      id: 5,
      text: "at 8:00 a.m.",
    },
    {
      id: 6,
      text: "at 6:30 a.m.",
    },
    {
      id: 7,
      text: "at 9:30 p.m.",
    },
    {
      id: 8,
      text: "at 9:00 p.m.",
    },
  ],
  left: [
    {
      id: 1,
      text: "Sandra goes to school",
    },
    {
      id: 2,
      text: "Molly eats breakfast",
    },
    {
      id: 3,
      text: "Wesley has English class",
    },
    {
      id: 4,
      text: "Albert goes to bed",
    },
    {
      id: 5,
      text: "Molly has English class",
    },
    {
      id: 6,
      text: "Wesley goes to bed",
    },
    {
      id: 7,
      text: "Sandra eats breakfast",
    },
    {
      id: 8,
      text: "Albert goes to school",
    },
  ],
  correctMatches: {
    1: 3,
    2: 6,
    3: 1,
    4: 7,
    5: 2,
    6: 8,
    7: 4,
    8: 5,
  },
};
const WB_Unit6_Page37_Q1 = () => {
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
  useCheckButton(rootRef, complete || match.revealed);
  const getLineColor = (id) =>
      match.results[id.split("-")[0]] === "correct" ? "#16a34a" : "#ef4444",
    getDotColor = (side, id) =>
      match.locked(side, id) ? "bg-green-600" : "bg-[#eb533c]",
    isLeftMatchWrong = (id) => match.results[id] === "wrong";
  const endpoint = (side, item) => {
    const label = item.text || "Clock picture " + item.id;
    const p = match.endpointProps(side, item.id, label);
    const listen = () => {
      if (item.text)
        playSound(
          side + "-" + item.id,
          soundFor(item.text) || soundFor(item.text.replace(/^at /, "")),
        );
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
  const handleLeftClick = (id) => {
      const item = exerciseData.left.find((item) => item.id === id);
      playSound(
        "left-" + id,
        soundFor(item.text) || soundFor(item.text.replace(/^at /, "")),
      );
      match.choose("left", id);
    },
    handleRightClick = (id) => {
      const item = exerciseData.right.find((item) => item.id === id);
      if (item.text)
        playSound(
          "right-" + id,
          soundFor(item.text) || soundFor(item.text.replace(/^at /, "")),
        );
      match.choose("right", id);
    };
  const checkAnswers = () => {
    if (complete || match.revealed) return;
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
    <div ref={rootRef} className="main-container-component">
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
          gap: "35px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="I"
          title={<>Read, look, and match.</>}
          subTitle={
            "Follow one person across the chart, then connect the sentence to the correct time."
          }
        />

        <div className="border rounded-xl overflow-hidden text-[18px]">
          <table className="w-full text-center">
            <thead>
              <tr>
                <th className="p-1 border"></th>
                <th className="p-1 border">
                  <AudioText
                    audioKey={"table-eat breakfast"}
                    src={soundFor("eat breakfast")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"eat breakfast"}
                  </AudioText>
                </th>
                <th className="p-1 border">
                  <AudioText
                    audioKey={"table-go to school"}
                    src={soundFor("go to school")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"go to school"}
                  </AudioText>
                </th>
                <th className="p-1 border">
                  <AudioText
                    audioKey={"table-English class"}
                    src={soundFor("English class")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"English class"}
                  </AudioText>
                </th>
                <th className="p-1 border">
                  <AudioText
                    audioKey={"table-go to bed"}
                    src={soundFor("go to bed")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"go to bed"}
                  </AudioText>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table-Molly"}
                    src={soundFor("Molly")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"Molly"}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 6:30 a.m. "}
                    src={soundFor("6:30 a.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"6:30 a.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 7:00 a.m. "}
                    src={soundFor("7:00 a.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"7:00 a.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 1:00 p.m. "}
                    src={soundFor("1:00 p.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"1:00 p.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 8:00 p.m. "}
                    src={soundFor("8:00 p.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"8:00 p.m."}
                  </AudioText>
                </td>
              </tr>
              <tr>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table-Sandra"}
                    src={soundFor("Sandra")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"Sandra"}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 7:00 a.m. "}
                    src={soundFor("7:00 a.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"7:00 a.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 7:30 a.m. "}
                    src={soundFor("7:30 a.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"7:30 a.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 11:00 a.m. "}
                    src={soundFor("11:00 a.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"11:00 a.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 10:00 p.m. "}
                    src={soundFor("10:00 p.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"10:00 p.m."}
                  </AudioText>
                </td>
              </tr>
              <tr>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table-Wesley"}
                    src={soundFor("Wesley")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"Wesley"}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 8:00 a.m. "}
                    src={soundFor("8:00 a.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"8:00 a.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 8:10 a.m. "}
                    src={soundFor("8:10 a.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"8:10 a.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 12:30 p.m. "}
                    src={soundFor("12:30 p.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"12:30 p.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 9:00 p.m. "}
                    src={soundFor("9:00 p.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"9:00 p.m."}
                  </AudioText>
                </td>
              </tr>
              <tr>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table-Albert"}
                    src={soundFor("Albert")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"Albert"}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 7:30 a.m. "}
                    src={soundFor("7:30 a.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"7:30 a.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 8:00 a.m. "}
                    src={soundFor("8:00 a.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"8:00 a.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 10:00 a.m. "}
                    src={soundFor("10:00 a.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"10:00 a.m."}
                  </AudioText>
                </td>
                <td className="p-1 border">
                  <AudioText
                    audioKey={"table- 9:30 p.m. "}
                    src={soundFor("9:30 p.m.")}
                    playSound={playSound}
                    playingKey={playingKey}
                  >
                    {"9:30 p.m."}
                  </AudioText>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          ref={containerRef}
          className="flex justify-between items-center gap-20 relative mb-20"
        >
          <div className="space-y-10">
            {exerciseData.left.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 justify-start"
              >
                <div className="relative">
                  <p
                    className={`${focusClass} text-xl w-55 cursor-pointer transition transform active:scale-95
  ${selectedLeft === item.id ? "text-red-600 underline scale-110" : "text-gray-700 hover:scale-105"}
`}
                    {...endpoint("left", item)}
                    ref={(el) => {
                      match.leftRefs.current[item.id] = el;
                    }}
                  >
                    {item.text}
                    {playingKey === "left-" + item.id && <SpeakerBadge />}
                  </p>

                  {isLeftMatchWrong(item.id) && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                      <span className="text-white text-sm font-bold leading-none">
                        ✕
                      </span>
                    </div>
                  )}
                </div>

                <div
                  ref={(el) => (match.leftDots.current[item.id] = el)}
                  onClick={() => handleLeftClick(item.id)}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("left", item.id)}`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-10">
            {exerciseData.right.map((item) => (
              <div key={item.id} className="flex items-center gap-6">
                <div
                  ref={(el) => (match.rightDots.current[item.id] = el)}
                  onClick={() => handleRightClick(item.id)}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${getDotColor("right", item.id)}`}
                />
                <div
                  className={`${focusClass} text-left cursor-pointer transition transform active:scale-125
  ${selectedRight === item.id ? "text-red-600 underline scale-125" : "hover:scale-105"}
`}
                  {...endpoint("right", item)}
                  ref={(el) => {
                    match.rightRefs.current[item.id] = el;
                  }}
                >
                  <p className="text-xl text-gray-700">
                    {item.text}
                    {playingKey === "right-" + item.id && <SpeakerBadge />}
                  </p>
                </div>
              </div>
            ))}
          </div>

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
export default WB_Unit6_Page37_Q1;
