import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";
import wordSound0 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_001_nest.mp3";
import wordSound1 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_002_feet.mp3";
import wordSound2 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_003_rest.mp3";
import wordSound3 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_004_eat.mp3";
import wordSound4 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_005_desk.mp3";
import wordSound5 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_006_egg.mp3";
import wordSound6 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_007_beg.mp3";
import wordSound7 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_008_meat.mp3";
import wordSound8 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_009_vet.mp3";
import wordSound9 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_010_seal.mp3";
import wordSound10 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_011_net.mp3";
import wordSound11 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_012_tea.mp3";
import wordSound12 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_013_pen.mp3";
import wordSound13 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_014_pet.mp3";
import wordSound14 from "../../../assets/audio/ClassBook/U 10/Page 86 - A2/Item_015_ten.mp3";
const wordSounds = {
  nest: wordSound0,
  feet: wordSound1,
  rest: wordSound2,
  eat: wordSound3,
  desk: wordSound4,
  egg: wordSound5,
  beg: wordSound6,
  meat: wordSound7,
  vet: wordSound8,
  seal: wordSound9,
  net: wordSound10,
  tea: wordSound11,
  pen: wordSound12,
  pet: wordSound13,
  ten: wordSound14,
};
const Unit10_Page5_Q2 = () => {
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

  const questions = [
    {
      id: 1,
      base: "nest",
      words: ["feet", "rest", "eat", "desk"],
      correct: ["rest", "desk"],
    },
    {
      id: 2,
      base: "egg",
      words: ["beg", "meat", "vet", "seal"],
      correct: ["beg", "vet"],
    },
    {
      id: 3,
      base: "net",
      words: ["tea", "pen", "pet", "ten"],
      correct: ["pen", "pet", "ten"],
    },
  ];

  const [selected, setSelected] = useState({});
  const [results, setResults] = useState({});
  const [locked, setLocked] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null);
  const stopAudio = () => {
    const audio = audioRef.current;
    audioRef.current = null;
    setPlayingKey(null);
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    }
  };
  const playSound = (key, src) => {
    if (!src) return;
    stopAudio();
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      audio.onended = null;
      audio.onerror = null;
      setPlayingKey(null);
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      audio.pause();
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    try {
      audio.play().catch(fail);
    } catch {
      fail();
    }
  };
  useEffect(() => {
    const otherPlay = (event) => {
      const audio = audioRef.current;
      if (!audio || event.target === audio) return;
      stopAudio();
    };
    document.addEventListener("play", otherPlay, true);
    return () => {
      document.removeEventListener("play", otherPlay, true);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  const toggleWord = (qId, word) => {
    playSound("choice-" + qId + "-" + word, wordSounds[word]);
    if (locked || results[qId]?.[word] === "correct") return;
    const q = questions.find((q) => q.id === qId),
      current = selected[qId] || [];
    if (!current.includes(word) && current.length >= q.correct.length) {
      setAnnouncement(
        "Remove an incorrect selection before choosing another word.",
      );
      return;
    }
    setSelected((prev) => ({
      ...prev,
      [qId]: current.includes(word)
        ? current.filter((w) => w !== word)
        : [...current, word],
    }));
    setResults((prev) => ({ ...prev, [qId]: { ...prev[qId], [word]: null } }));
    setAnnouncement(
      word + " " + (current.includes(word) ? "removed." : "selected."),
    );
  };
  const reset = () => {
    stopAudio();
    setSelected({});
    setResults({});
    setLocked(false);
    setAnnouncement("Activity reset. All selections cleared.");
  };
  const showAnswers = () => {
    stopAudio();
    setSelected(Object.fromEntries(questions.map((q) => [q.id, q.correct])));
    setResults(
      Object.fromEntries(
        questions.map((q) => [
          q.id,
          Object.fromEntries(q.correct.map((w) => [w, "correct"])),
        ]),
      ),
    );
    setLocked(true);
    setAnnouncement("All correct words shown and locked.");
  };
  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    stopAudio();
    if (questions.some((q) => !selected[q.id]?.length)) {
      ValidationAlert.info(
        "Please select at least one word for each question.",
      );
      setAnnouncement("Please select at least one word for each question.");
      return;
    }
    const next = Object.fromEntries(
      questions.map((q) => [
        q.id,
        Object.fromEntries(
          (selected[q.id] || []).map((w) => [
            w,
            q.correct.includes(w) ? "correct" : "wrong",
          ]),
        ),
      ]),
    );
    const score = questions.reduce(
        (n, q) =>
          n +
          (selected[q.id] || []).filter((w) => q.correct.includes(w)).length,
        0,
      ),
      total = questions.reduce((n, q) => n + q.correct.length, 0);
    setResults(next);
    setLocked(score === total);
    setAnnouncement(
      "Score " +
        score +
        " out of " +
        total +
        ". Incorrect words can be changed.",
    );
    const color = score === total ? "green" : score === 0 ? "red" : "orange";
    const msg =
      '<div style="font-size:20px;text-align:center;"><span style="color:' +
      color +
      ';font-weight:bold">Score: ' +
      score +
      " / " +
      total +
      "</span></div>";
    if (score === total) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (score === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };
  const isWrongWord = (q, word) => results[q.id]?.[word] === "wrong";
  const keyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) action();
    }
  };
  const keyUp = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  return (
    <div className="main-container-component">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <div className="div-forall" style={{ gap: "30px" }}>
        <ExerciseHeader
          questionNumber="2"
          title="Read and circle the words with the same vowel sound."
          subTitle={
            "Listen to both sounds carefully, then choose Yes/No only after comparing them."
          }
        />

        {questions.map((q) => (
          <div
            key={q.id}
            className="flex items-center gap-10 mb-4 px-4 py-3 rounded-xl bg-[#f5eee8]"
          >
            {/* رقم */}
            <span className="font-bold text-[22px] w-5">{q.id}</span>

            {/* الكلمات */}
            <div className="flex gap-10 flex-wrap items-center">
              {/* الكلمة الأساسية */}
              <div
                role="button"
                tabIndex={0}
                aria-label={`Hear ${q.base}`}
                onClick={() => playSound(`base-${q.id}`, wordSounds[q.base])}
                onKeyDown={(e) =>
                  keyDown(e, () =>
                    playSound(`base-${q.id}`, wordSounds[q.base]),
                  )
                }
                onKeyUp={keyUp}
                className="relative bg-[#e8ddd5] px-3 py-1 rounded-full font-medium text-[22px] focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
              >
                {q.base}
                {playingKey === `base-${q.id}` && <SpeakerBadge />}
              </div>

              {/* باقي الكلمات */}
              {q.words.map((word, i) => {
                const isSelected = (selected[q.id] || []).includes(word);
                const result = results[q.id]?.[word];

                return (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-disabled={locked || result === "correct"}
                    aria-label={`${word}${locked || result === "correct" ? ". Answer locked." : ""}`}
                    onKeyDown={(e) => keyDown(e, () => toggleWord(q.id, word))}
                    onKeyUp={keyUp}
                    style={{
                      backgroundColor:
                        playingKey === `choice-${q.id}-${word}`
                          ? "#dbeafe"
                          : undefined,
                      boxShadow:
                        result === "correct" ? "0 3px 0 #16a34a" : undefined,
                    }}
                    onClick={() => toggleWord(q.id, word)}
                    className={`
                      relative px-3 py-1 rounded-full cursor-pointer transition text-[22px] focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!
                      ${
                        isSelected
                          ? result
                            ? result === "correct"
                              ? "border-2 border-green-600 text-black"
                              : "border-2 border-red-500"
                            : "border-2 border-blue-800"
                          : "border-2 border-transparent hover:bg-gray-100"
                      }
                    `}
                  >
                    {word}
                    {playingKey === `choice-${q.id}-${word}` && (
                      <SpeakerBadge />
                    )}
                    {isWrongWord(q, word) && (
                      <div
                        className="
      absolute -top-2 -right-2
      w-5 h-5
      bg-red-500 text-white
      rounded-full
      flex items-center justify-center
      text-xs font-bold
      border-2 border-white
      z-10
    "
                      >
                        ✕
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* buttons */}
      <div className="action-buttons-container">
        <button onClick={(checkEvent) => { resetCompletedCheck(); (reset)(checkEvent); }} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit10_Page5_Q2;
