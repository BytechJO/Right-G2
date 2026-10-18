import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - A/Item_001_burgers.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - A/Item_002_cake.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - A/Item_003_bread.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - A/Item_004_meat.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - A/Item_005_fish.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 5/Page 27 - A/Item_006_fruit.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_001_She.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_003_doesn't_like_rice.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_005_She_doesn't_like.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_007_He.mp3";
import clip12 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_008_likes.mp3";
import clip13 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_009_likes_fish.mp3";
import clip14 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_010_doesn't.mp3";
import clip15 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_011_like_fish.mp3";
import clip16 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_012_loves.mp3";
import clip17 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_013_rice.mp3";
import clip18 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - G/Item_014_chicken.mp3";
import clip19 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_001_Megan_likes_fruit,_vegetables,_and_milk._She_doesn't_like_bread_or_fish.mp3";
import clip20 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_002_Megan's_brother,_Jimmy,_likes_vegetables,_nuts,_and_soup._He_doesn't_lik.mp3";
import clip21 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_003_Megan's_dad_likes.mp3";
import clip22 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_004_candy.mp3";
import clip23 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_005_pasta.mp3";
import clip24 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_006_Megan_doesn't_like.mp3";
import clip25 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_007_vegetables.mp3";
import clip28 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_010_Megan's_mom_likes.mp3";
import clip30 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_012_soda.mp3";
import clip31 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_013_Megan's_brother_doesn't_like.mp3";
import clip32 from "../../../assets/audio/WorkBook/Unit 5/Page 30 - H/Item_014_nuts.mp3";
import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import falseIcon from "../../../assets/imgs/false.svg";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
// صور الجمل (استبدل المسارات بالمسارات الفعلية)
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 30/Ex G 5.svg";

// بيانات التمرين
const sentencesData = [
  {
    id: 1,
    incorrectSentence: "She doesn't like rice.",
    correctSentence: "She doesn't like fruit.",
    incorrectWordIndex: 3,
    // "rice" هي الكلمة الخاطئة (الفهرس 3)
    correctWord: "fruit",
    image: img1,
    wordBank: ["fruit", "meat", "fish"],
  },
  {
    id: 2,
    incorrectSentence: "He likes fish.",
    correctSentence: "He doesn't like fish.",
    incorrectWordIndex: 1,
    // "likes" هي الكلمة الخاطئة
    correctWord: "doesn't",
    image: img2,
    wordBank: ["likes", "doesn't", "loves"],
  },
  {
    id: 3,
    incorrectSentence: "He doesn't like chicken.",
    correctSentence: "He doesn't like meat.",
    incorrectWordIndex: 3,
    // "chicken" هي الكلمة الخاطئة
    correctWord: "meat",
    image: img3,
    wordBank: ["meat", "rice", "chicken"],
  },
  {
    id: 4,
    incorrectSentence: "I like meat.",
    correctSentence: "I like stew.",
    incorrectWordIndex: 2,
    // "meat" هي الكلمة الخاطئة
    correctWord: "stew",
    image: img4,
    wordBank: ["stew", "meat", "fish"],
  },
  {
    id: 5,
    incorrectSentence: "He likes rice.",
    correctSentence: "He doesn't like rice.",
    incorrectWordIndex: 1,
    // "likes" هي الكلمة الخاطئة
    correctWord: "doesn't",
    image: img5,
    wordBank: ["likes", "doesn't", "loves"],
  },
];
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
  burgers: clip0,
  cake: clip1,
  bread: clip2,
  meat: clip3,
  fish: clip4,
  fruit: clip5,
  she: clip6,
  "doesn't like rice": clip8,
  "she doesn't like": clip9,
  he: clip11,
  likes: clip12,
  "likes fish": clip13,
  "doesn't": clip14,
  "like fish": clip15,
  loves: clip16,
  rice: clip17,
  chicken: clip18,
  "megan likes fruit vegetables and milk she doesn't like bread or fish":
    clip19,
  "megan's brother jimmy likes vegetables nuts and soup he doesn't lik": clip20,
  "megan's dad likes": clip21,
  candy: clip22,
  pasta: clip23,
  "megan doesn't like": clip24,
  vegetables: clip25,
  "megan's mom likes": clip28,
  soda: clip30,
  "megan's brother doesn't like": clip31,
  nuts: clip32,
};
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .trim()
    .replace(/\s+/g, " ");
const soundFor = (text) => SOUNDS[normalized(text)];
function useDropAnswers(tokens, targets, isCorrect, multiple = false) {
  const audio = useExerciseAudio(),
    [answers, setAnswers] = useState(
      Object.fromEntries(targets.map((id) => [id, []])),
    ),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [picked, setPicked] = useState(null),
    [message, setMessage] = useState("");
  const bankRefs = useRef({}),
    slotRefs = useRef({}),
    frame = useRef(null),
    suppress = useRef(false);
  const token = (id) => tokens.find((t) => t.id === id),
    resultKey = (target, id) => (multiple ? id : String(target)),
    targetLocked = (id) => revealed || (!multiple && results[id] === "correct");
  const itemLocked = (id) =>
    revealed ||
    Object.entries(answers).some(
      ([target, ids]) =>
        ids.includes(id) && results[resultKey(target, id)] === "correct",
    );
  const used = (id) =>
    Object.entries(answers).some(
      ([target, ids]) =>
        ids.includes(id) && results[resultKey(target, id)] !== "wrong",
    );
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (get) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      suppress.current = true;
      try {
        get()?.focus({
          preventScroll: true,
        });
      } finally {
        suppress.current = false;
      }
    });
  };
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  const clearSelection = () => {
    cancelFocus();
    setPicked(null);
  };
  const cancel = () => {
    const source = picked;
    clearSelection();
    if (source) focus(() => bankRefs.current[source]);
    setMessage("Choice cancelled.");
  };
  const place = (target, id) => {
    target = String(target);
    if (
      !targets.map(String).includes(target) ||
      !token(id) ||
      token(id).target !== target ||
      targetLocked(target) ||
      itemLocked(id)
    )
      return;
    const next = Object.fromEntries(
      Object.entries(answers).map(([key, ids]) => [
        key,
        ids.filter((t) => t !== id),
      ]),
    );
    next[target] = multiple ? [...next[target], id] : [id];
    setAnswers(next);
    setResults((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) =>
          multiple ? key !== id : key !== target && !answers[key]?.includes(id),
        ),
      ),
    );
    setPicked(null);
    setMessage(token(id).value + " placed.");
    return next;
  };
  const remove = (target, id) => {
    if (targetLocked(target) || itemLocked(id)) return;
    setAnswers((prev) => ({
      ...prev,
      [target]: prev[target].filter((v) => v !== id),
    }));
    setResults((prev) => ({
      ...prev,
      [resultKey(target, id)]: null,
    }));
    setMessage(token(id).value + " returned to the bank.");
  };
  const play = (id, where = "bank") =>
    audio.playSound(where + "-" + id, soundFor(token(id).value));
  const bankProps = (id, source = "bank") => ({
    role: "button",
    tabIndex: picked ? -1 : 0,
    "aria-label": token(id).value + ". Choose to place.",
    "aria-pressed": picked === id,
    "aria-disabled": itemLocked(id) || (source === "bank" && used(id)),
    onClick: (e) => {
      e.stopPropagation();
      play(id, source);
      if (source !== "bank") remove(source, id);
    },
    onFocus: (e) => {
      if (!suppress.current && e.currentTarget.matches(":focus-visible"))
        play(id, source);
    },
    onKeyDown: (e) => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        if (
          !e.repeat &&
          source !== "bank" &&
          results[resultKey(source, id)] === "wrong"
        )
          remove(source, id);
        return;
      }
      if (!["Enter", " "].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      play(id, source);
      if (itemLocked(id)) return;
      if (source !== "bank") {
        remove(source, id);
        return;
      }
      if (used(id)) return;
      setPicked(id);
      setMessage(token(id).value + " selected. Choose an answer field.");
      const target =
        targets.find((t) => String(t) === token(id).target && !targetLocked(t));
      if (target !== undefined) focus(() => slotRefs.current[target]);
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
      ...(source !== "bank" && results[resultKey(source, id)] === "correct"
        ? {
            borderBottomColor: "#16a34a",
          }
        : {}),
    },
  });
  const slotProps = (target, over = false) => ({
    role: "button",
    tabIndex:
      picked && (targetLocked(target) || token(picked).target !== String(target))
        ? -1
        : 0,
    "aria-label":
      "Answer field " +
      target +
      ": " +
      (answers[target].map((id) => token(id).value).join(" ") || "Empty") +
      (targetLocked(target) ? ". Correct and locked." : ""),
    "aria-disabled": targetLocked(target),
    onClick: (e) => {
      if (e.target !== e.currentTarget) return;
      const id = answers[target].findLast((id) => !itemLocked(id));
      if (id) remove(target, id);
    },
    onKeyDown: (e) => {
      if (e.key === "Escape" && picked) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        const id = answers[target].findLast(
          (id) => results[resultKey(target, id)] === "wrong",
        );
        if (!e.repeat && id) remove(target, id);
        return;
      }
      if (!["Enter", " "].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat || targetLocked(target)) return;
      if (picked) {
        const id = picked,
          next = place(target, id);
        if (next) {
          const rowTokens = tokens.filter((t) => t.target === String(target));
            const available = rowTokens.find(
            (t) => !Object.values(next).some((ids) => ids.includes(t.id)),
          );
          focus(() => bankRefs.current[available?.id || rowTokens[0]?.id || id]);
        }
      } else {
        const id = answers[target].findLast((id) => !itemLocked(id));
        if (id) remove(target, id);
      }
    },
    onKeyUp: release,
    style: {
      position: "relative",
      ...(!multiple && results[target]
        ? {
            borderBottomColor:
              results[target] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
      ...(over && !targetLocked(target)
        ? {
            outline: "3px dashed #2563eb",
            outlineOffset: 2,
            backgroundColor: "#dbeafe",
          }
        : {}),
    },
  });
  const evaluate = () => {
    clearSelection();
    audio.stopAudio();
    const next = multiple
      ? Object.fromEntries(
          Object.entries(answers).flatMap(([target, ids]) =>
            ids.map((id) => [
              id,
              isCorrect(target, token(id)) ? "correct" : "wrong",
            ]),
          ),
        )
      : Object.fromEntries(
          targets.map((target) => [
            target,
            results[target] === "correct" ||
            (answers[target].length &&
              isCorrect(String(target), token(answers[target][0])))
              ? "correct"
              : "wrong",
          ]),
        );
    setResults(next);
    return next;
  };
  const show = (solved) => {
    clearSelection();
    audio.stopAudio();
    setAnswers(solved);
    setResults(
      multiple
        ? Object.fromEntries(tokens.map((t) => [t.id, "correct"]))
        : Object.fromEntries(targets.map((t) => [t, "correct"])),
    );
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    clearSelection();
    audio.stopAudio();
    setAnswers(Object.fromEntries(targets.map((id) => [id, []])));
    setResults({});
    setRevealed(false);
    setMessage("Activity reset.");
  };
  return {
    ...audio,
    answers,
    results,
    revealed,
    picked,
    message,
    setMessage,
    token,
    itemLocked,
    targetLocked,
    used,
    place,
    remove,
    bankProps,
    slotProps,
    evaluate,
    show,
    reset,
    clearSelection,
    cancel,
    bankRefs,
    slotRefs,
  };
}
const DraggableWord = ({
  id,
  word,
  source = "bank",
  disabled,
  className,
  interaction,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: source + ":" + id,
    data: {
      tokenId: id,
      source,
    },
    disabled: disabled || (source === "bank" && interaction.used(id)),
  });
  const props = interaction.bankProps(id, source);
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        if (source === "bank") interaction.bankRefs.current[id] = el;
      }}
      {...attributes}
      {...listeners}
      {...props}
      style={{
        ...props.style,
        touchAction: "none",
        opacity: isDragging ? 0 : undefined,
      }}
      className={className + " " + focusClass}
    >
      {word}
      {interaction.playingKey === source + "-" + id && <SpeakerBadge />}
    </div>
  );
};
const DropZone = ({ id, children, className, interaction }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    disabled:
      id === "bank" ? interaction.revealed : interaction.targetLocked(id),
  });
  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        if (id !== "bank") interaction.slotRefs.current[id] = el;
      }}
      {...(id === "bank" ? {} : interaction.slotProps(
            id,
            isOver &&
              interaction.token(active?.data.current?.tokenId)?.target === String(id),
          ))}
      className={className + (id === "bank" ? "" : " " + focusClass)}
    >
      {children}
    </div>
  );
};
const IMAGE_DESCRIPTIONS = {
  [img1]: "A woman seated at a table with a bowl of fruit.",
  [img2]: "A boy seated at a table with a plate of fish.",
  [img3]: "A boy seated at a table with a plate of meat.",
  [img4]: "A woman seated at a table with a bowl of soup.",
  [img5]: "A boy seated at a table with a plate of rice.",
};
const CorrectSentenceExercise = () => {
  const tokens = sentencesData.flatMap((s) =>
      s.wordBank.map((value, i) => ({
        id: s.id + "-" + i + "-" + value,
        value,
        target: String(s.id),
      })),
    ),
    targets = sentencesData.map((s) => String(s.id));
  const interaction = useDropAnswers(
    tokens,
    targets,
    (target, t) =>
      t.value ===
      sentencesData.find((s) => String(s.id) === target).correctWord,
  );
  const { rootRef, playingKey, playSound } = interaction;
  const [markedWords, setMarkedWords] = useState({}),
    [markResults, setMarkResults] = useState({});
  const message = interaction.message;
  const [activeItem, setActiveItem] = useState(null),
    [dragSize, setDragSize] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );
  const handleDndStart = (e) => {
    interaction.clearSelection();
    const t = interaction.token(e.active.data.current.tokenId);
    setActiveItem(t?.value || null);
    const r = e.active.rect?.current?.initial;
    setDragSize(
      r
        ? {
            width: r.width,
            height: r.height,
          }
        : null,
    );
  };
  const handleDndEnd = (e) => {
    setActiveItem(null);
    if (e.over) interaction.place(e.over.id, e.active.data.current.tokenId);
  };
  const userAnswers = Object.fromEntries(
      targets.map((id) => [id, interaction.answers[id][0]]),
    ),
    showResults = Object.keys(interaction.results).length > 0;
  const markLocked = (id) =>
      interaction.revealed || markResults[id] === "correct",
    complete = targets.every(
      (id) =>
        interaction.results[id] === "correct" && markResults[id] === "correct",
    );
  useCheckButton(rootRef, complete || interaction.revealed);
  const getSentenceParts = (s) => s.split(" "),
    extractWord = (id) => interaction.token(id)?.value || "";
  const isAnswerCorrect = (id) => interaction.results[id] === "correct";
  const handleWordClick = (id, index) => {
    playSound(
      "mark-" + id + "-" + index,
      soundFor(
        sentencesData.find((s) => s.id === id).incorrectSentence.split(" ")[
          index
        ],
      ),
    );
    if (markLocked(id)) return;
    setMarkedWords((prev) => ({
      ...prev,
      [id]: prev[id] === index ? undefined : index,
    }));
    setMarkResults((prev) => ({
      ...prev,
      [id]: null,
    }));
  };
  const markProps = (id, index) => ({
    type: "button",
    tabIndex: interaction.picked ? -1 : 0,
    "aria-pressed": markedWords[id] === index,
    "aria-disabled": markLocked(id),
    "aria-label":
      sentencesData.find((s) => s.id === id).incorrectSentence.split(" ")[
        index
      ] +
      ". Sentence " +
      id +
      ", word " +
      (index + 1) +
      ". Mark the mistake.",
    onKeyDown: activate,
    onKeyUp: release,
    style: {
      position: "relative",
      borderRadius: 4,
      ...(markResults[id] && markedWords[id] === index
        ? {
            boxShadow:
              "inset 0 -2px " +
              (markResults[id] === "correct" ? "#16a34a" : "#ef4444"),
          }
        : {}),
    },
  });
  const handleRemoveWord = (id) => {
    const t = interaction.answers[id][0];
    if (t) interaction.remove(id, t);
  };
  const checkAnswers = () => {
    if (complete || interaction.revealed) return;
    interaction.clearSelection();
    interaction.stopAudio();
    if (
      targets.some(
        (id) =>
          !interaction.answers[id].length || markedWords[id] === undefined,
      )
    ) {
      interaction.setMessage(
        "Please complete the mistake selection and answer for all sentences first.",
      );
      ValidationAlert.info(
        "Please complete the mistake selection and answer for all sentences first.",
      );
      return;
    }
    const next = interaction.evaluate(),
      marks = Object.fromEntries(
        sentencesData.map((s) => [
          s.id,
          markResults[s.id] === "correct" ||
          markedWords[s.id] === s.incorrectWordIndex
            ? "correct"
            : "wrong",
        ]),
      );
    setMarkResults(marks);
    const score = targets.filter(
      (id) => next[id] === "correct" && marks[id] === "correct",
    ).length;
    interaction.setMessage(
      "Score " + score + " out of 5. Correct parts are locked.",
    );
    showCheckFeedback(
      rootRef.current,
      score === 5 ? "success" : score ? "warning" : "error",
      "Score: " + score + " / 5",
    );
  };
  const handleShowAnswer = () => {
      setActiveItem(null);
      interaction.show(
        Object.fromEntries(
          sentencesData.map((s) => [
            s.id,
            [
              tokens.find(
                (t) => t.id.startsWith(s.id + "-") && t.value === s.correctWord,
              ).id,
            ],
          ]),
        ),
      );
      setMarkedWords(
        Object.fromEntries(
          sentencesData.map((s) => [s.id, s.incorrectWordIndex]),
        ),
      );
      setMarkResults(Object.fromEntries(targets.map((id) => [id, "correct"])));
    },
    handleStartAgain = () => {
      setActiveItem(null);
      interaction.reset();
      setMarkedWords({});
      setMarkResults({});
    };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDndStart}
      onDragCancel={() => {
        setActiveItem(null);
        interaction.clearSelection();
      }}
      onDragEnd={handleDndEnd}
    >
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
            marginBottom: "30px",
            gap: "30px",
          }}
        >
          <ExerciseHeader
            isWorkbook
            sectionLetter="G"
            title={
              <>
                {" "}
                Look, read, and write <span className="text-blue-900">
                  ✕
                </span>{" "}
                over the mistake. Rewrite the sentence.
              </>
            }
            subTitle={
              "Find just one wrong word in each sentence, correct it, then read the full sentence again."
            }
          />

          {/* الجمل التفاعلية */}
          <div className="space-y-8">
            {sentencesData.map((sentence) => {
              const correctWords = getSentenceParts(sentence.correctSentence);
              const incorrectWords = getSentenceParts(
                sentence.incorrectSentence,
              );
              return (
                <div
                  key={sentence.id}
                  className="border-2 border-blue-900 rounded-[23px] flex justify-between gap-5"
                >
                  {/* رقم الجملة والجملة الخاطئة مع إمكانية النقر على الكلمات */}
                  <div className="flex items-start gap-2 w-full p-[20px]">
                    <span className="text-xl font-semibold text-blue-900 mt-1">
                      {sentence.id}
                    </span>
                    <div className="flex-1 space-y-3">
                      {/* الجملة الخاطئة - الكلمات قابلة للنقر */}
                      <div className="flex flex-wrap items-center gap-2 text-[18px]">
                        {incorrectWords.map((word, wordIndex) => (
                          <button
                            key={wordIndex}
                            {...markProps(sentence.id, wordIndex)}
                            onClick={() =>
                              handleWordClick(sentence.id, wordIndex)
                            }
                            aria-disabled={markLocked(sentence.id)}
                            className={`${focusClass} relative px-2 py-1 rounded transition-all ${markedWords[sentence.id] === wordIndex ? "text-red-600 font-bold" : "text-gray-800 hover:bg-gray-100"} ${showResults ? "cursor-default" : "cursor-pointer"}`}
                          >
                            {word}
                            {playingKey ===
                              "mark-" + sentence.id + "-" + wordIndex && (
                              <SpeakerBadge />
                            )}
                            {markedWords[sentence.id] === wordIndex && (
                              <span className="absolute -top-2 -right-2 text-2xl text-red-600 font-bold">
                                <img
                                  src={falseIcon}
                                  style={{
                                    height: "25px",
                                  }}
                                  alt=""
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Word Bank لهذه الجملة */}
                      <div className="rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {sentence.wordBank.map((word, index) => {
                            const wordId = `${sentence.id}-${index}-${word}`;
                            const used = interaction.used(wordId);
                            return (
                              <DraggableWord
                                key={wordId}
                                id={wordId}
                                interaction={interaction}
                                className={`WB-word-bank ${used ? "bg-gray-200 opacity-40 cursor-not-allowed border border-gray-400" : "border-2 border-blue-900 hover:bg-blue-50 cursor-grab"}`}
                                word={word}
                                used={used}
                                disabled={interaction.itemLocked(wordId)}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* منطقة الإجابة - السحب والإفلات */}
                      <DropZone
                        id={sentence.id}
                        interaction={interaction}
                        className={`relative p-2 rounded-lg transition-all`}
                      >
                        {showResults &&
                          userAnswers[sentence.id] &&
                          !isAnswerCorrect(sentence.id) && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow border-2 border-white">
                              ✕
                            </div>
                          )}
                        <div className="flex flex-wrap items-center gap-2 text-lg">
                          {/* عرض الجملة مع الفراغ */}
                          {correctWords.map((word, wordIndex) => {
                            if (wordIndex === sentence.incorrectWordIndex) {
                              // هذا هو مكان الفراغ - منطقة السحب والإفلات
                              return (
                                <div
                                  key={wordIndex}
                                  style={{
                                    borderBottomColor:
                                      interaction.results[sentence.id] ===
                                      "correct"
                                        ? "#16a34a"
                                        : interaction.results[sentence.id] ===
                                            "wrong"
                                          ? "#ef4444"
                                          : undefined,
                                  }}
                                  className={`px-3 py-2 border-b-2 transition-all ${userAnswers[sentence.id] ? (showResults ? (isAnswerCorrect(sentence.id) ? "border-blue-500" : "border-red-500") : "border-blue-900 bg-blue-50") : "border-blue-900"}`}
                                >
                                  {userAnswers[sentence.id] ? (
                                    <button
                                      onClick={() =>
                                        handleRemoveWord(sentence.id)
                                      }
                                      type="button"
                                      tabIndex={interaction.picked ? -1 : 0}
                                      aria-label="Return the replacement word to its bank"
                                      aria-disabled={interaction.targetLocked(
                                        sentence.id,
                                      )}
                                      onKeyDown={activate}
                                      onKeyUp={release}
                                      style={{
                                        borderRadius: 4,
                                      }}
                                      className={`${focusClass} font-bold transition-all ${showResults ? (isAnswerCorrect(sentence.id) ? "text-blue-700 cursor-default" : "text-blue-700 cursor-default") : "text-blue-700 hover:text-blue-900 cursor-pointer"}`}
                                    >
                                      {extractWord(userAnswers[sentence.id])}
                                    </button>
                                  ) : (
                                    <span className="text-gray-500 italic text-sm">
                                      [Drop here]
                                    </span>
                                  )}
                                </div>
                              );
                            } else {
                              // الكلمات الأخرى
                              return (
                                <span key={wordIndex} className="text-gray-800">
                                  {word}
                                </span>
                              );
                            }
                          })}
                        </div>
                      </DropZone>
                    </div>
                  </div>

                  {/* الصورة */}

                  <img
                    src={sentence.image}
                    className="rounded-lg object-contain"
                    style={{
                      height: "200px",
                      width: "auto",
                    }}
                    alt={IMAGE_DESCRIPTIONS[sentence.image]}
                  />
                </div>
              );
            })}
          </div>

          {/* أزرار التحكم */}
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
      {createPortal(
        <DragOverlay
          style={{
            zIndex: 2147483647,
          }}
        >
          {activeItem ? (
            <div
              style={{
                ...dragSize,
                boxSizing: "border-box",
                pointerEvents: "none",
              }}
              className="WB-word-bank bg-white shadow-lg"
            >
              {activeItem}
            </div>
          ) : null}
        </DragOverlay>,
        document.fullscreenElement || document.body,
      )}
    </DndContext>
  );
};
export default CorrectSentenceExercise;
