/* eslint-disable react-refresh/only-export-components -- Phrase controls stay local to this exercise. */
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { toPng } from "html-to-image";
import { FaDownload } from "react-icons/fa6";
import { FaVolumeUp } from "react-icons/fa";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import clip0 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_001_brush_teeth.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_002_do_homework.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_003_get_up.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_004_have_lunch.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_005_go_home.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_006_eat_breakfast.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_007_class.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_008_What_time_does_he_brush_his_teeth.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_009_What_time_does_she.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_010_What_time_do_they.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 6/Page 36 - H/Item_011_What_time_does_he.mp3";
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
const PHRASES = [
  {
    id: "p1",
    text: "brush teeth",
  },
  {
    id: "p2",
    text: "do homework",
  },
  {
    id: "p3",
    text: "get up",
  },
  {
    id: "p4",
    text: "have lunch",
  },
  {
    id: "p5",
    text: "go home",
  },
  {
    id: "p6",
    text: "eat breakfast",
  },
  {
    id: "p7",
    text: "class",
  },
];
const CORRECT_ANSWERS = {
  h2: "p6",
  h3: "p3",
  h4: "p5",
  h5: "p4",
  h6: "p2",
};
const TARGETS = ["h2", "h3", "h4", "h5", "h6"];
const PHRASE_SOUNDS = {
  p1: clip0,
  p2: clip1,
  p3: clip2,
  p4: clip3,
  p5: clip4,
  p6: clip5,
  p7: clip6,
};
const PREFIX_SOUNDS = {
  "What time does she": clip8,
  "What time do they": clip9,
  "What time does he": clip10,
};
const initialPlaced = () => Object.fromEntries(TARGETS.map((id) => [id, null]));
function usePhraseDrop() {
  const audio = useExerciseAudio();
  const [placed, setPlaced] = useState(initialPlaced),
    [picked, setPicked] = useState(null),
    [finished, setFinished] = useState(false),
    [message, setMessage] = useState("");
  const answersRef = useRef(placed),
    finishedRef = useRef(false),
    frame = useRef(null),
    suppressFocus = useRef(false),
    bankRefs = useRef({}),
    slotRefs = useRef({});
  const used = (id) => Object.values(answersRef.current).includes(id);
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (get) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      suppressFocus.current = true;
      try {
        get()?.focus({
          preventScroll: true,
        });
      } finally {
        suppressFocus.current = false;
      }
    });
  };
  useEffect(() => {
    const pending = frame;
    return () => {
      if (pending.current !== null) cancelAnimationFrame(pending.current);
    };
  }, []);
  const clearSelection = () => {
    cancelFocus();
    setPicked(null);
  };
  const writePlaced = (next) => {
    answersRef.current = next;
    setPlaced(next);
    finishedRef.current = false;
    setFinished(false);
  };
  const play = (id) => audio.playSound("bank-" + id, PHRASE_SOUNDS[id]);
  const cancel = () => {
    const id = picked;
    clearSelection();
    if (id) focus(() => bankRefs.current[id]);
    setMessage("Choice cancelled.");
  };
  const place = (slot, id) => {
    const phrase = PHRASES.find((p) => p.id === id);
    if (!TARGETS.includes(slot) || !phrase || used(id)) return null;
    const next = {
      ...answersRef.current,
      [slot]: id,
    };
    writePlaced(next);
    setPicked(null);
    setMessage(phrase.text + " placed in question " + slot.slice(1) + ".");
    return next;
  };
  const remove = (slot, keyboard = false) => {
    const id = answersRef.current[slot];
    if (!id) return;
    writePlaced({
      ...answersRef.current,
      [slot]: null,
    });
    setPicked(null);
    play(id);
    setMessage(
      PHRASES.find((p) => p.id === id).text + " returned to the bank.",
    );
    if (keyboard) focus(() => bankRefs.current[id]);
  };
  const bankProps = (id) => ({
    role: "button",
    tabIndex: picked ? -1 : 0,
    "aria-label": PHRASES.find((p) => p.id === id).text + ". Choose to place.",
    "aria-pressed": picked === id,
    "aria-disabled": used(id),
    onClick: () => play(id),
    onFocus: (event) => {
      if (
        !suppressFocus.current &&
        event.currentTarget.matches(":focus-visible")
      )
        play(id);
    },
    onKeyDown: (event) => {
      if (event.key === "Escape" && picked) {
        event.preventDefault();
        event.stopPropagation();
        cancel();
        return;
      }
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.repeat) return;
      play(id);
      if (used(id)) {
        setMessage(
          "This phrase is already used. Activate its answer field to return it to the bank.",
        );
        return;
      }
      setPicked(id);
      setMessage(
        PHRASES.find((p) => p.id === id).text +
          " selected. Choose an answer field and press Enter or Space.",
      );
      const target =
        TARGETS.find((slot) => !answersRef.current[slot]) || TARGETS[0];
      focus(() => slotRefs.current[target]);
    },
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: 8,
      ...(picked === id
        ? {
            outline: "3px solid #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const slotProps = (slot, isOver) => ({
    role: "button",
    tabIndex: 0,
    "aria-label":
      "Question " +
      slot.slice(1) +
      " answer field. " +
      (placed[slot]
        ? PHRASES.find((p) => p.id === placed[slot]).text
        : "Empty.") +
      " Press Enter or Space to place a selected phrase or return the current phrase to its bank.",
    "aria-describedby": "wb-unit6-p36-q2-help",
    onClick: (event) => {
      event.stopPropagation();
      remove(slot);
    },
    onKeyDown: (event) => {
      if (event.key === "Escape" && picked) {
        event.preventDefault();
        event.stopPropagation();
        cancel();
        return;
      }
      if (["Delete", "Backspace"].includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.repeat) return;
      if (!picked) {
        if (placed[slot]) remove(slot, true);
        else setMessage("Choose a phrase from the bank first.");
        return;
      }
      const id = picked,
        next = place(slot, id);
      if (!next) return;
      const available = PHRASES.find(
        (phrase) => !Object.values(next).includes(phrase.id),
      );
      focus(() => bankRefs.current[available?.id || id]);
    },
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: 0,
      ...(finished
        ? {
            borderBottomColor: "#16a34a",
          }
        : {}),
      ...(isOver
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            borderRadius: 4,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const finish = () => {
    if (finishedRef.current) return;
    clearSelection();
    audio.stopAudio();
    if (TARGETS.some((slot) => !answersRef.current[slot])) {
      const text = "Please complete all answers first.";
      setMessage(text);
      ValidationAlert.info(text);
      return;
    }
    // This creative question keeps its original completeness-only Finish behavior.
    finishedRef.current = true;
    setFinished(true);
    setMessage(
      "All questions are completed. You can download your activity or change a phrase.",
    );
    showCheckFeedback(audio.rootRef.current, "success", "Good Job!!");
  };
  const reset = () => {
    clearSelection();
    audio.stopAudio();
    writePlaced(initialPlaced());
    setMessage(
      "Activity reset. All answers and completion feedback are cleared.",
    );
  };
  return {
    ...audio,
    placed,
    picked,
    finished,
    message,
    used,
    play,
    bankProps,
    slotProps,
    bankRefs,
    slotRefs,
    place,
    clearSelection,
    finish,
    reset,
  };
}
function DraggablePhrase({ phrase, interaction, dragActive }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: phrase.id,
    disabled: interaction.used(phrase.id),
  });
  const props = interaction.bankProps(phrase.id),
    isUsed = interaction.used(phrase.id);
  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        interaction.bankRefs.current[phrase.id] = element;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        ...props.style,
        opacity: isDragging && dragActive ? 0 : isUsed ? 0.5 : 1,
        touchAction: "none",
      }}
      className={
        focusClass +
        " WB-word-bank " +
        (isUsed
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "hover:border-blue-400")
      }
    >
      {phrase.text}
      {interaction.playingKey === "bank-" + phrase.id && <SpeakerBadge />}
    </div>
  );
}
function QuestionSlot({
  id,
  prefix,
  suffix,
  content,
  interaction,
  dragActive,
}) {
  const { setNodeRef, isOver: over } = useDroppable({
    id,
  });
  const isOver = dragActive && over;
  const props = interaction.slotProps(id, isOver);
  return (
    <div className="flex items-center flex-wrap gap-2 text-lg py-2 border-b border-gray-100">
      <span className="font-bold text-blue-600">{id.replace("h", "")}</span>
      <span className="text-gray-700">
        <AudioText
          audioKey={"prefix-" + id}
          src={PREFIX_SOUNDS[prefix]}
          tabIndex={interaction.picked ? -1 : 0}
          playSound={interaction.playSound}
          playingKey={interaction.playingKey}
        >
          {prefix}
        </AudioText>
      </span>
      <div
        ref={(element) => {
          setNodeRef(element);
          interaction.slotRefs.current[id] = element;
        }}
        {...props}
        className={
          focusClass +
          " focus-visible:rounded-sm! min-w-[120px] h-9 border-b-2 px-2 flex items-center justify-center transition-all " +
          (isOver ? "border-blue-400 bg-blue-50" : "border-gray-300")
        }
      >
        {content ? (
          <span className="text-blue-800 font-bold">
            {PHRASES.find((p) => p.id === content).text}
          </span>
        ) : (
          <span className="text-gray-200 italic text-sm">drop activity...</span>
        )}
      </div>
      <span className="text-gray-700">{suffix}</span>
    </div>
  );
}
const WB_Unit6_Page36_Q2 = () => {
  const interaction = usePhraseDrop();
  const { rootRef, placed, playingKey, playSound } = interaction;
  const [activeId, setActiveId] = useState(null),
    [dragSize, setDragSize] = useState(null),
    [downloading, setDownloading] = useState(false);
  const activeDragRef = useRef(null);
  const downloadRef = useRef(false),
    mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const handleDragStart = (event) => {
    interaction.clearSelection();
    activeDragRef.current = event.active.id;
    setActiveId(event.active.id);
    const rect = event.active.rect?.current?.initial;
    setDragSize(
      rect
        ? {
            width: rect.width,
            height: rect.height,
          }
        : null,
    );
  };
  const handleDragEnd = (event) => {
    const active = activeDragRef.current;
    activeDragRef.current = null;
    setActiveId(null);
    if (active === event.active.id && event.over)
      interaction.place(event.over.id, event.active.id);
  };
  const stopDrag = () => {
    activeDragRef.current = null;
    setActiveId(null);
  };
  const handleFinish = () => {
    stopDrag();
    interaction.finish();
  };
  const handleStartAgain = () => {
    stopDrag();
    interaction.reset();
  };
  const handledownload = async () => {
    if (downloadRef.current || !rootRef.current) return;
    downloadRef.current = true;
    setDownloading(true);
    try {
      const dataUrl = await toPng(rootRef.current);
      if (!mountedRef.current) return;
      const link = document.createElement("a");
      link.download = "activity.png";
      link.href = dataUrl;
      link.click();
    } catch {
      if (mountedRef.current)
        ValidationAlert.error(
          "The activity image could not be downloaded. Please try again.",
        );
    } finally {
      downloadRef.current = false;
      if (mountedRef.current) setDownloading(false);
    }
  };
  const exampleKey = "example-1",
    examplePlaying = playingKey === exampleKey;
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        stopDrag();
        interaction.clearSelection();
      }}
    >
      <div className="main-container-component" ref={rootRef}>
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {interaction.message}
        </div>
        <div
          className="div-forall mb-10"
          style={{
            gap: "15px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="H"
            title="Write questions. Use the phrases in the boxes."
            subTitle={
              "Use the activity phrase and clock clue to build each What time...? question."
            }
          />
          <p id="wb-unit6-p36-q2-help" className="sr-only">
            Drag a phrase to an answer field, or Tab to a phrase and press Enter
            or Space to select it. Focus moves to the fields. Enter or Space
            places it and returns focus to the bank. With no selected phrase,
            activate a filled field to return its phrase to the bank. Escape
            cancels selection. Finish checks that every field is filled.
            Download saves your activity as an image.
          </p>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap justify-center gap-3 mb-4 p-5">
              {PHRASES.map((phrase) => (
                <DraggablePhrase
                  dragActive={activeId !== null}
                  key={phrase.id}
                  phrase={phrase}
                  interaction={interaction}
                />
              ))}
            </div>
            <div className="space-y-4">
              <div
                role="button"
                tabIndex={interaction.picked ? -1 : 0}
                aria-label="Example 1. What time does he brush his teeth? Hear it."
                onClick={() => playSound(exampleKey, clip7)}
                onKeyDown={activate}
                onKeyUp={release}
                className={
                  focusClass +
                  " flex items-center gap-2 text-lg py-2 border-b border-gray-100 opacity-60"
                }
                style={{
                  position: "relative",
                  borderRadius: 4,
                  ...(examplePlaying
                    ? {
                        outline: "3px solid #2563eb",
                        outlineOffset: 2,
                        backgroundColor: "#dbeafe",
                      }
                    : {}),
                }}
              >
                <span className="font-bold text-blue-600">1</span>
                <span>What time does he</span>
                <span className="px-2 border-b-2 border-gray-300 font-bold text-blue-800">
                  brush his teeth
                </span>
                <span>?</span>
                {examplePlaying && <SpeakerBadge />}
              </div>
              <QuestionSlot
                dragActive={activeId !== null}
                id="h2"
                prefix="What time does she"
                suffix="?"
                content={placed.h2}
                interaction={interaction}
              />
              <QuestionSlot
                dragActive={activeId !== null}
                id="h3"
                prefix="What time do they"
                suffix="?"
                content={placed.h3}
                interaction={interaction}
              />
              <QuestionSlot
                dragActive={activeId !== null}
                id="h4"
                prefix="What time does he"
                suffix="?"
                content={placed.h4}
                interaction={interaction}
              />
              <QuestionSlot
                dragActive={activeId !== null}
                id="h5"
                prefix="What time does she"
                suffix="?"
                content={placed.h5}
                interaction={interaction}
              />
              <QuestionSlot
                dragActive={activeId !== null}
                id="h6"
                prefix="What time do they"
                suffix="?"
                content={placed.h6}
                interaction={interaction}
              />
            </div>
          </div>
          <div className="action-buttons-container">
            <button
              type="button"
              onClick={handleStartAgain}
              className="try-again-button"
            >
              Start Again ↻
            </button>
            <button
              type="button"
              aria-label="Download your activity as an image"
              aria-busy={downloading}
              onClick={handledownload}
              className="flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 shadow-md px-10"
            >
              <FaDownload />
            </button>
            <button
              type="button"
              onClick={handleFinish}
              disabled={interaction.finished}
              style={{
                cursor: interaction.finished ? "not-allowed" : undefined,
              }}
              className="check-button2"
            >
              Finish ✓
            </button>
          </div>
        </div>
      </div>
      {createPortal(
        <DragOverlay
          style={{
            zIndex: 2147483647,
          }}
        >
          {activeId ? (
            <div
              style={{
                ...dragSize,
                boxSizing: "border-box",
                pointerEvents: "none",
              }}
              className="WB-word-bank bg-white shadow-xl"
            >
              {PHRASES.find((p) => p.id === activeId)?.text}
            </div>
          ) : null}
        </DragOverlay>,
        document.fullscreenElement || document.body,
      )}
    </DndContext>
  );
};
export default WB_Unit6_Page36_Q2;
