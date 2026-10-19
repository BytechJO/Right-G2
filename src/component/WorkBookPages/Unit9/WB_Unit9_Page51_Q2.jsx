/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U9 Folder/Page 51/Ex B 4.svg";
import { useState, useRef, useEffect } from "react";
import ExerciseHeader from "../../ExerciseHeader";
import ValidationAlert from "../../Popup/ValidationAlert";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_001_are_they_soccer_playing.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_002_are.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_003_they.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_004_soccer.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_005_playing.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_006_are_we_chess_playing.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_007_we.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_008_chess.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_009_is_she_helping.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_010_is.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_011_she.mp3";
import clip11 from "../../../assets/audio/WorkBook/Unit 9/Page 51 - B/Item_012_helping.mp3";
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
const normalized = (text) =>
  String(text)
    .toLowerCase()
    .replaceAll("’", "'")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
function useAnswers(correct, options = {}) {
  const audio = useExerciseAudio();
  const [values, setValues] = useState({}),
    [results, setResults] = useState({}),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const ids = Object.keys(correct),
    complete = ids.every((id) => results[id] === "correct");
  const completionRef = useRef(false);
  completionRef.current = complete || revealed;
  useCheckButton(audio.rootRef, complete || revealed);
  const locked = (id) => revealed || results[id] === "correct";
  const chosen = (id, value) =>
    Array.isArray(correct[id])
      ? (values[id] || []).includes(value)
      : values[id] === value;
  const choose = (id, value) => {
    if (locked(id)) return;
    let next = value;
    if (Array.isArray(correct[id])) {
      const current = values[id] || [];
      if (current.includes(value)) next = current.filter((v) => v !== value);
      else {
        if (options.limit && current.length >= options.limit) return;
        next = [...current, value];
      }
    }
    setValues((prev) => ({
      ...prev,
      [id]: next,
    }));
    setResults((prev) => ({
      ...prev,
      [id]: null,
    }));
    setMessage("Answer " + id + " updated.");
  };
  const stop = () => {
    audio.stopAudio();
    audio.rootRef.current?.querySelectorAll("audio").forEach((a) => a.pause());
  };
  const check = () => {
    if (completionRef.current) return;
    stop();
    if (
      ids.some((id) =>
        Array.isArray(correct[id])
          ? !values[id]?.length
          : values[id] === undefined || values[id] === "",
      )
    ) {
      const text = options.missing || "Please complete all answers first.";
      setMessage(text);
      ValidationAlert.info(text);
      return;
    }
    const same = (actual, expected) =>
      Array.isArray(expected)
        ? actual.length === expected.length &&
          expected.every((v) => actual.includes(v))
        : options.normalize
          ? normalized(actual) === normalized(expected)
          : actual === expected;
    const next = Object.fromEntries(
      ids.map((id) => [
        id,
        results[id] === "correct" || same(values[id], correct[id])
          ? "correct"
          : "wrong",
      ]),
    );
    setResults(next);
    const score = Object.values(next).filter((v) => v === "correct").length;
    completionRef.current = score === ids.length;
    setMessage(
      "Score " +
        score +
        " out of " +
        ids.length +
        ". Correct answers are locked.",
    );
    showCheckFeedback(
      audio.rootRef.current,
      score === ids.length ? "success" : score ? "warning" : "error",
      "Score: " + score + " / " + ids.length,
    );
  };
  const show = () => {
    completionRef.current = true;
    stop();
    setValues(
      Object.fromEntries(
        ids.map((id) => [
          id,
          Array.isArray(correct[id]) ? [...correct[id]] : correct[id],
        ]),
      ),
    );
    setResults(Object.fromEntries(ids.map((id) => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct answers shown and locked.");
  };
  const reset = () => {
    completionRef.current = false;
    stop();
    setValues({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  const resultStyle = (id, value) =>
    chosen(id, value) && results[id]
      ? {
          borderColor: results[id] === "correct" ? "#16a34a" : "#ef4444",
          boxShadow:
            "inset 0 0 0 1px " +
            (results[id] === "correct" ? "#16a34a" : "#ef4444"),
        }
      : {};
  const props = (id, value, src, label = String(value)) => ({
    role: "button",
    tabIndex: 0,
    "aria-label":
      "Question " +
      id +
      ": " +
      label +
      (locked(id) ? ". Correct and locked." : ""),
    "aria-pressed": chosen(id, value),
    "aria-disabled": locked(id),
    onKeyDown: activate,
    onKeyUp: release,
    onClick: () => {
      options.beforeInteract?.();
      if (src) audio.playSound("choice-" + id + "-" + value, src);
      choose(id, value);
    },
    style: {
      position: "relative",
      ...(chosen(id, value) && !results[id]
        ? {
            backgroundColor: "#dbeafe",
          }
        : {}),
      ...resultStyle(id, value),
    },
  });
  const nativeProps = (id) => ({
    "aria-label": "Answer " + id + (locked(id) ? ". Correct and locked." : ""),
    disabled: locked(id),
    value: values[id] ?? "",
    onChange: (e) => {
      const value = options.numeric ? Number(e.target.value) : e.target.value;
      choose(id, value);
      const src = soundFor(value === "doesnt" ? "doesn't have" : value);
      if (src) audio.playSound("answer-" + id, src);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        if (e.repeat) e.preventDefault();
      }
    },
    onKeyUp: (e) => {
      if (e.key === "Enter" || e.key === " ") e.stopPropagation();
    },
    style: {
      position: "relative",
      borderRadius: 0,
      ...(results[id]
        ? {
            borderBottomColor:
              results[id] === "correct" ? "#16a34a" : "#ef4444",
          }
        : {}),
    },
  });
  return {
    ...audio,
    setResults,
    setMessage,
    completionRef,
    values,
    results,
    revealed,
    message,
    locked,
    chosen,
    choose,
    check,
    show,
    reset,
    resultStyle,
    props,
    nativeProps,
  };
}
// Percentages follow the inspected SVG artwork, so regions scale with each picture.
// The larger detail buttons below are alternatives to the compact picture regions.
const SOUNDS = {
  "are they soccer playing": clip0,
  are: clip1,
  they: clip2,
  soccer: clip3,
  playing: clip4,
  "are we chess playing": clip5,
  we: clip6,
  chess: clip7,
  "is she helping": clip8,
  is: clip9,
  she: clip10,
  helping: clip11,
};
const soundFor = (text) => SOUNDS[normalized(text)];
const IMAGE_DESCRIPTIONS = {
  [img1]: "Two children playing with a soccer ball.",
  [img2]: "Two children sitting beside a chessboard.",
  [img3]: "A man preparing food in a kitchen while a child watches.",
  [img4]: "A woman ironing a pink garment.",
};
function useWordOrder(questions) {
  const a = useAnswers(
    Object.fromEntries(questions.map((q) => [q.id, q.correct])),
    {
      normalize: true,
      missing: "Please complete all sentences first!",
    },
  );
  const [arrangements, setArrangements] = useState({});
  const bankRefs = useRef({}),
    answerRefs = useRef({}),
    frame = useRef(null);
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (get) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      get()?.focus();
    });
  };
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );
  const question = (id) => questions.find((q) => q.id === id);
  const indices = (id) => arrangements[id] || [];
  const update = (id, next) => {
    setArrangements((prev) => ({
      ...prev,
      [id]: next,
    }));
    const text = next.map((i) => question(id).words[i]).join(" ");
    a.choose(id, text);
    a.setMessage(`Sentence ${id}: ${text || "Empty"}.`);
  };
  const add = (id, index, keyboard = false) => {
    if (
      a.locked(id) ||
      !question(id) ||
      index < 0 ||
      index >= question(id).words.length ||
      indices(id).includes(index)
    )
      return;
    const next = [...indices(id), index];
    update(id, next);
    if (keyboard) {
      const available = question(id).words.findIndex(
        (_, i) => !next.includes(i),
      );
      focus(() =>
        available >= 0
          ? bankRefs.current[id + "-" + available]
          : answerRefs.current[id + "-0"],
      );
    }
  };
  const remove = (id, index, keyboard = false) => {
    if (a.locked(id) || !indices(id).includes(index)) return;
    update(
      id,
      indices(id).filter((i) => i !== index),
    );
    if (keyboard) focus(() => bankRefs.current[id + "-" + index]);
  };
  const wordProps = (id, index, placed = false) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": `Sentence ${id}, word ${index + 1}: ${question(id).words[index]}. ${a.locked(id) ? "Correct and locked. Hear this word." : placed ? "Return this word to this sentence's bank." : "Add this word to this sentence."}`,
    "aria-disabled": a.locked(id) || (!placed && indices(id).includes(index)),
    onClick: (event) => {
      a.playSound(
        (placed && a.locked(id) ? "answer-" : "bank-") + id + "-" + index,
        soundFor(question(id).words[index]),
      );
      if (placed) remove(id, index, event.detail === 0);
      else add(id, index, event.detail === 0);
    },
    onKeyDown: (event) => {
      if (["Delete", "Backspace"].includes(event.key) && placed) {
        event.preventDefault();
        event.stopPropagation();
        if (!event.repeat && a.results[id] === "wrong") remove(id, index, true);
        return;
      }
      activate(event);
    },
    onKeyUp: release,
  });
  const check = () => {
    if (a.completionRef.current) return;
    cancelFocus();
    a.stopAudio();
    if (questions.some((q) => indices(q.id).length !== q.words.length)) {
      a.setMessage("Please complete all sentences first!");
      ValidationAlert.info("Please complete all sentences first!");
      return;
    }
    a.check();
  };
  const show = () => {
    cancelFocus();
    const solved = {};
    for (const q of questions) {
      const used = new Set();
      solved[q.id] = q.correct.split(/\s+/).map((word) => {
        const index = q.words.findIndex(
          (candidate, i) =>
            !used.has(i) && normalized(candidate) === normalized(word),
        );
        used.add(index);
        return index;
      });
    }
    setArrangements(solved);
    a.show();
  };
  const reset = () => {
    cancelFocus();
    setArrangements({});
    a.reset();
  };
  return {
    ...a,
    arrangements,
    indices,
    add,
    remove,
    wordProps,
    bankRefs,
    answerRefs,
    check,
    show,
    reset,
  };
}
function SentenceBuilder({ id, scrambled, src, order }) {
  const availableWords = scrambled.split(" ").map((text, index) => ({
    id: id + "-word-" + index,
    text,
    index,
  }));
  const chosenWords = order.indices(id).map((index) => availableWords[index]);
  const usedWords = new Set(chosenWords.map((w) => w.id));
  const isWrong = order.results[id] === "wrong";
  const playingKey = order.playingKey,
    playSound = order.playSound,
    a = order;
  const getBoxClassName = () =>
    order.results[id] === "correct"
      ? "border-green-600 bg-blue-50"
      : isWrong
        ? "border-red-500"
        : "border-gray-300 bg-white";
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 border-2 border-gray-500 rounded-[20px] min-h-[50px] items-center">
        <img
          src={src}
          className="object-contain"
          style={{
            height: "150px",
          }}
          alt={IMAGE_DESCRIPTIONS[src] || "Illustration for this question"}
        />

        <div className="flex flex-col justify-center gap-4 w-80 p-3">
          <h5 className="text-lg">
            <AudioText
              audioKey={"scrambled-" + id}
              playSound={playSound}
              playingKey={playingKey}
              tabIndex={a.picked ? -1 : 0}
              src={soundFor(scrambled)}
            >
              {scrambled.split(" ").join("/")}
            </AudioText>
          </h5>

          <div className="flex gap-2 flex-wrap">
            {availableWords.map((word) => {
              const isUsed = usedWords.has(word.id);
              return (
                <button
                  key={word.id}
                  disabled={isUsed || order.locked(id)}
                  className={
                    `WB-word-bank 
                    ${isUsed ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50" : "bg-white text-gray-800 border-gray-400 hover:bg-blue-100 hover:border-blue-500"}
                  ` +
                    " focus-visible:rounded-md! " +
                    focusClass
                  }
                  type="button"
                  {...order.wordProps(id, word.index, false)}
                  ref={(el) => {
                    order.bankRefs.current[id + "-" + word.index] = el;
                  }}
                  style={{
                    position: "relative",
                  }}
                >
                  {word.text}
                  <>
                    {order.playingKey === "bank-" + id + "-" + word.index && (
                      <SpeakerBadge />
                    )}
                  </>
                </button>
              );
            })}
          </div>
          <div className="relative">
            <div
              className={`flex flex-wrap gap-2 px-3 border-2 border-dashed rounded-lg h-[40px] transition-colors duration-300 items-center ${getBoxClassName()}`}
            >
              {chosenWords.map((word) => (
                <button
                  key={word.id}
                  className={
                    "px-1 py-1 cursor-pointer hover:text-red-500" +
                    " focus-visible:rounded-md! " +
                    focusClass
                  }
                  type="button"
                  {...order.wordProps(id, word.index, true)}
                  ref={(el) => {
                    order.answerRefs.current[
                      id +
                        "-" +
                        chosenWords.findIndex((w) => w.index === word.index)
                    ] = el;
                  }}
                  style={{
                    position: "relative",
                  }}
                >
                  {word.text}
                  <>
                    {order.playingKey === "answer-" + id + "-" + word.index && (
                      <SpeakerBadge />
                    )}
                  </>
                </button>
              ))}
            </div>

            {isWrong && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-base font-bold shadow-lg border-2 border-white">
                ✕
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function WB_Unit9_Page51_Q2() {
  const exerciseSentences = [
    {
      id: "s1",
      scrambled: "are they soccer playing",
      correct: "they are playing soccer",
    },
    {
      id: "s2",
      scrambled: "are we chess playing",
      correct: "we are playing chess",
    },
    {
      id: "s3",
      scrambled: "is she helping",
      correct: "she is helping",
    },
    {
      id: "s4",
      scrambled: "is she clothes washing",
      correct: "she is washing clothes",
    },
  ];
  const images = [img1, img2, img3, img4];
  const order = useWordOrder(
    exerciseSentences.map((q) => ({
      ...q,
      words: q.scrambled.split(" "),
    })),
  );
  const { rootRef, message } = order;
  const checkAnswers = order.check,
    handleShowAnswer = order.show,
    handleStartAgain = order.reset;
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
          marginBottom: "10px",
          gap: "20px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="B"
          title={<>Look and write sentences.</>}
          subTitle={"Say the correct present activities word or sentence first, then rearrange the pieces into that order."}
        />

        <div className="space-y-4">
          {exerciseSentences.map((sentence, index) => (
            <div key={sentence.id} className="flex items-start gap-4">
              <span className="font-bold text-blue-900 text-xl pt-2">
                {index + 1}.
              </span>

              <div className="flex-1">
                <SentenceBuilder
                  key={sentence.id}
                  id={sentence.id}
                  scrambled={sentence.scrambled}
                  src={images[index]}
                  order={order}
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
}
export default WB_Unit9_Page51_Q2;
