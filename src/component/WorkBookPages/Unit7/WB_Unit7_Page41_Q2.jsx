/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - F/Item_001_What_time_is_it_Tina_asked_her_mom_one_day._It_is_eleven_o'clock_in_the.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - F/Item_002_Tina_and_her_mom_will_get_home_at_7_00_p.m.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - F/Item_003_Tina_and_her_mom_will_go_to_the_store_at_12_30_p.m.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - F/Item_004_They_are_going_to_pick_up_pizza_at_6_15_p.m.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - F/Item_005_Tina's_mom_told_her_it_was_11_00_a.m.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - F/Item_006_They_will_have_dinner_at_7_45_p.m.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 7/Page 41 - F/Item_007_They_will_visit_Grandma_at_2_00_p.m.mp3";
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
  "what time is it tina asked her mom one day it is eleven o'clock in the":
    clip0,
  "tina and her mom will get home at 7 00 pm": clip1,
  "tina and her mom will go to the store at 12 30 pm": clip2,
  "they are going to pick up pizza at 6 15 pm": clip3,
  "tina's mom told her it was 11 00 am": clip4,
  "they will have dinner at 7 45 pm": clip5,
  "they will visit grandma at 2 00 pm": clip6,
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
      const src = soundFor(value);
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
const exerciseDataN = {
  story: `"What time is it?" Tina asked her mom one day. "It is eleven o'clock in the morning," replied Mom. "We are going to the store at twelve thirty. When we are finished shopping, we will go to your grandmother's house. I told your grandfather that we would be there at two o'clock. We should get home by seven o'clock in the evening," said her mom while looking at a checklist of things to do. "When will we have dinner?" asked Tina. Her mom replied, "We will have dinner at a quarter to eight. We'll stop by the pizza place at a quarter past six and pick up some pizza on the way home." "Yummy, I can't wait!"`,
  events: [
    {
      id: "n1",
      text: "Tina and her mom will get home at 7:00 p.m.",
      correctNumber: 4,
    },
    {
      id: "n2",
      text: "Tina and her mom will go to the store at 12:30 p.m.",
      correctNumber: 2,
    },
    {
      id: "n3",
      text: "They are going to pick up pizza at 6:15 p.m.",
      correctNumber: 6,
    },
    {
      id: "n4",
      text: "Tina's mom told her it was 11:00 a.m.",
      correctNumber: 1,
    },
    {
      id: "n5",
      text: "They will have dinner at 7:45 p.m.",
      correctNumber: 5,
    },
    {
      id: "n6",
      text: "They will visit Grandma at 2:00 p.m.",
      correctNumber: 3,
    },
  ],
};
const WB_Unit7_Page41_Q2 = () => {
  const a = useAnswers(
    Object.fromEntries(
      exerciseDataN.events.map((q) => [q.id, q.correctNumber]),
    ),
    {
      numeric: true,
    },
  );
  const { rootRef, message, playingKey, playSound } = a;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleStartAgain = a.reset;
  const getSelectClass = () =>
    "border-2 border-gray-300 focus:border-blue-500 focus:outline-none px-3 py-2 rounded-lg font-semibold w-16 text-center";
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
          gap: "25px",
        }}
      >
        <ExerciseHeader
          isWorkbook
          sectionLetter="F"
          title="Look, read, and number the events in the story."
          subTitle={"Underline each time in the story, then number the events in chronological order."}
        />
        <div className="flex flex-col gap-5">
          {/* Story */}
          <div className="rounded-lg">
            <p className="text-black text-[18px]">
              <AudioText
                audioKey={"story"}
                src={clip0}
                playSound={playSound}
                playingKey={playingKey}
              >
                {exerciseDataN.story}
              </AudioText>
            </p>
          </div>

          {/* Events */}
          <div className="space-y-2 mb-8">
            {exerciseDataN.events.map((event, idx) => {
              const isWrong = a.results[event.id] === "wrong";
              return (
                <div key={event.id} className="flex items-center gap-4">
                  <span className="font-bold text-lg text-gray-900 w-6">
                    {String.fromCharCode(97 + idx)}.
                  </span>

                  <p className="text-[20px] text-gray-900 flex-1">
                    <AudioText
                      audioKey={"event-" + event.id}
                      src={soundFor(event.text)}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      {event.text}
                    </AudioText>
                  </p>

                  <div className="relative">
                    <select
                      className={
                        getSelectClass(event.id) +
                        " " +
                        focusClass +
                        " focus-visible:rounded-sm!"
                      }
                      {...a.nativeProps(event.id)}
                      style={{
                        ...a.nativeProps(event.id).style,
                        ...(a.results[event.id]
                          ? {
                              borderColor:
                                a.results[event.id] === "correct"
                                  ? "#16a34a"
                                  : "#ef4444",
                            }
                          : {}),
                      }}
                    >
                      <option value="">-</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>

                    {/* ❌ Wrong Icon */}
                    {isWrong && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white">
                        ✕
                      </div>
                    )}
                    {playingKey === "answer-" + event.id && <SpeakerBadge />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Buttons */}
        <Button
          handleStartAgain={handleStartAgain}
          handleShowAnswer={handleShowAnswer}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};
export default WB_Unit7_Page41_Q2;
