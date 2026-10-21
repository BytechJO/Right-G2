/* eslint-disable react-refresh/only-export-components -- Exercise-local controls. */
import ExerciseHeader from "../../ExerciseHeader";
import { playGlobalAudio, stopGlobalAudio } from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 7/Page 40 - C/Item_001_what_day_is_it_today.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 7/Page 40 - C/Item_002_It_is.mp3";
import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Asset 46.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Asset 47.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Asset 48.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U7 Folder/Page 40/Asset 45.svg";
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
  "what day is it today": clip0,
  "it is": clip1,
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
const WB_Unit7_Page40_Q1 = () => {
  const a = useAnswers(
    {
      sentence1: "Wednesday",
      sentence2: "Monday",
      sentence3: "Friday",
    },
    {},
  );
  const { rootRef, message, playingKey, playSound } = a;
  const checkAnswers = a.check,
    handleShowAnswer = a.show,
    handleStartAgain = a.reset;
  const isWrongAnswer = (id) => a.results[id] === "wrong";
  const getSelectClass = () =>
    "mx-3 p-2 w-100 text-center text-lg border-b-2 border-gray-400 cursor-pointer";
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
          sectionLetter="C"
          title="Look, read and write."
          subTitle={"Look at the picture or sentence clue, say the days, months, travel, and time answer first, then write or select it carefully."}
        />

        <div className="max-w-4xl mx-auto" dir="ltr">
          <div className="flex w-full">
            <div className="sentences">
              <div className="flex items-center gap-4 p-2">
                <span className="font-semibold text-blue-900 text-xl mr-2">
                  1.
                </span>
                <img src={img1} className="max-w-40 max-h-30 object-contain" />
                <div className="flex-1">
                  <p className="text-xl text-black curesor-pointer">
                    <AudioText
                      audioKey={"question-1"}
                      src={soundFor("what day is it today")}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      {"what day is it today?"}
                    </AudioText>
                  </p>
                  <p className="text-xl text-gray-800 curesor-pointer">
                    <AudioText
                      audioKey={"prefix-1"}
                      src={soundFor("it is")}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      {"it is"}
                    </AudioText>
                    <span className="relative inline-block">
                      <select
                        className={
                          getSelectClass("sentence1") +
                          " " +
                          focusClass +
                          " focus-visible:rounded-sm!"
                        }
                        {...a.nativeProps("sentence1")}
                      >
                        <option value="" disabled></option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Monday">Monday</option>
                      </select>

                      {isWrongAnswer("sentence1") && (
                        <div className="absolute -top-2 right-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                          <span className="text-white text-xs font-bold leading-none">
                            ✕
                          </span>
                        </div>
                      )}
                      {playingKey === "answer-" + "sentence1" && (
                        <SpeakerBadge />
                      )}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-xl">
                <span className="font-semibold text-blue-900 text-xl mr-2">
                  2.
                </span>
                <img src={img2} className="max-w-40 max-h-30 object-contain" />
                <div className="flex-1">
                  <p className="text-xl text-black curesor-pointer">
                    <AudioText
                      audioKey={"question-2"}
                      src={soundFor("what day is it today")}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      {"what day is it today?"}
                    </AudioText>
                  </p>
                  <p className="text-xl text-gray-800">
                    <AudioText
                      audioKey={"prefix-2"}
                      src={soundFor("It is")}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      {"It is"}
                    </AudioText>
                    <span className="relative inline-block">
                      <select
                        className={
                          getSelectClass("sentence2") +
                          " " +
                          focusClass +
                          " focus-visible:rounded-sm!"
                        }
                        {...a.nativeProps("sentence2")}
                      >
                        <option value="" disabled></option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Monday">Monday</option>
                      </select>

                      {isWrongAnswer("sentence2") && (
                        <div className="absolute -top-2 right-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                          <span className="text-white text-xs font-bold leading-none">
                            ✕
                          </span>
                        </div>
                      )}
                      {playingKey === "answer-" + "sentence2" && (
                        <SpeakerBadge />
                      )}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 rounded-xl">
                <span className="font-semibold text-blue-900 text-xl mr-2">
                  3.
                </span>
                <img src={img3} className="max-w-40 max-h-30 object-contain" />
                <div className="flex-1">
                  <p className="text-xl text-black curesor-pointer">
                    <AudioText
                      audioKey={"question-3"}
                      src={soundFor("what day is it today")}
                      playSound={playSound}
                      playingKey={playingKey}
                    >
                      {"what day is it today?"}
                    </AudioText>
                  </p>
                  <div className="text-xl text-gray-800 text-nowrap flex items-center">
                    <span className="text-xl text-gray-800 text-nowrap">
                      {" "}
                      <AudioText
                        audioKey={"prefix-3"}
                        src={soundFor("It is")}
                        playSound={playSound}
                        playingKey={playingKey}
                      >
                        {"It is"}
                      </AudioText>
                    </span>
                    <span className="relative inline-block">
                      <select
                        className={
                          getSelectClass("sentence3") +
                          " " +
                          focusClass +
                          " focus-visible:rounded-sm!"
                        }
                        {...a.nativeProps("sentence3")}
                      >
                        <option value="" disabled></option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Monday">Monday</option>
                      </select>

                      {isWrongAnswer("sentence3") && (
                        <div className="absolute -top-2 right-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                          <span className="text-white text-xs font-bold leading-none">
                            ✕
                          </span>
                        </div>
                      )}
                      {playingKey === "answer-" + "sentence3" && (
                        <SpeakerBadge />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <img
              src={img4}
              className="object-contain"
              style={{
                height: "450px",
                width: "auto",
              }}
            />
          </div>
          <div className="mt-10">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={handleStartAgain}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default WB_Unit7_Page40_Q1;
