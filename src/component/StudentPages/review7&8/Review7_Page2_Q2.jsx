import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

import sound0 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_001_boat.mp3";
import sound1 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_002_note.mp3";
import sound2 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_003_slow.mp3";
import sound3 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_004_green.mp3";
import sound4 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_005_name.mp3";
import sound5 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_006_window.mp3";
import sound6 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_007_home.mp3";
import sound7 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_008_coat.mp3";
import sound8 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_009_goat.mp3";
import sound9 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_010_snow.mp3";
import sound10 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_011_kite.mp3";
import sound11 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_012_yellow.mp3";
import sound12 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_013_nine.mp3";
import sound13 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_014_cop.mp3";
import sound14 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_015_shop.mp3";
import sound15 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_016_rope.mp3";
import sound16 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_017_slope.mp3";
import sound17 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_018_bot.mp3";
import sound18 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_019_clip.mp3";
import sound19 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_020_five.mp3";
import sound20 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_021_sleep.mp3";
import sound21 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_022_row.mp3";
import sound22 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_023_cone.mp3";
import sound23 from "../../../assets/audio/ClassBook/U 8/Page 71 - E/Item_024_How_many_long_o_words.mp3";
const wordAudio = {
  boat: sound0,
  note: sound1,
  slow: sound2,
  green: sound3,
  name: sound4,
  window: sound5,
  home: sound6,
  coat: sound7,
  goat: sound8,
  snow: sound9,
  kite: sound10,
  yellow: sound11,
  nine: sound12,
  cop: sound13,
  shop: sound14,
  rope: sound15,
  slope: sound16,
  bot: sound17,
  clip: sound18,
  five: sound19,
  sleep: sound20,
  row: sound21,
  cone: sound22,
};
const focusClass =
  " rounded-full focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";

const wordsData = [
  {
    word: "boat",
    correct: true,
    top: "5%",
    left: "6%",
    color: "text-blue-500",
    rotate: "-rotate-12",
  },
  {
    word: "note",
    correct: true,
    top: "5%",
    left: "24.6%",
    color: "text-green-500",
    rotate: "rotate-6",
  },
  {
    word: "slow",
    correct: true,
    top: "5%",
    left: "43%",
    color: "text-red-500",
    rotate: "rotate-3",
  },
  {
    word: "green",
    correct: false,
    top: "5%",
    left: "61.5%",
    color: "text-purple-500",
    rotate: "-rotate-6",
  },
  {
    word: "name",
    correct: false,
    top: "5%",
    left: "80%",
    color: "text-blue-500",
    rotate: "rotate-2",
  },

  {
    word: "window",
    correct: true,
    top: "25%",
    left: "9.2%",
    color: "text-yellow-500",
    rotate: "-rotate-12",
  },
  {
    word: "home",
    correct: true,
    top: "27.5%",
    left: "46%",
    color: "text-orange-500",
    rotate: "rotate-6",
  },
  {
    word: "coat",
    correct: true,
    top: "25%",
    left: "77%",
    color: "text-green-500",
    rotate: "rotate-2",
  },

  {
    word: "goat",
    correct: true,
    top: "45%",
    left: "6%",
    color: "text-red-500",
    rotate: "-rotate-12",
  },
  {
    word: "snow",
    correct: true,
    top: "45%",
    left: "30.7%",
    color: "text-purple-500",
    rotate: "rotate-2",
  },
  {
    word: "kite",
    correct: false,
    top: "45%",
    left: "50.7%",
    color: "text-green-500",
    rotate: "-rotate-6",
  },
  {
    word: "yellow",
    correct: true,
    top: "45%",
    left: "69.2%",
    color: "text-blue-500",
    rotate: "rotate-6",
  },
  {
    word: "nine",
    correct: false,
    top: "45%",
    left: "89.2%",
    color: "text-yellow-500",
    rotate: "-rotate-3",
  },

  {
    word: "cop",
    correct: false,
    top: "60%",
    left: "12.3%",
    color: "text-blue-500",
    rotate: "-rotate-6",
  },
  {
    word: "shop",
    correct: false,
    top: "65%",
    left: "36.9%",
    color: "text-red-500",
    rotate: "rotate-6",
  },
  {
    word: "rope",
    correct: true,
    top: "65%",
    left: "55.3%",
    color: "text-yellow-500",
    rotate: "-rotate-12",
  },
  {
    word: "slope",
    correct: true,
    top: "65%",
    left: "77%",
    color: "text-purple-500",
    rotate: "rotate-3",
  },

  {
    word: "bot",
    correct: false,
    top: "80%",
    left: "9.2%",
    color: "text-purple-500",
    rotate: "-rotate-12",
  },
  {
    word: "five",
    correct: false,
    top: "90%",
    left: "30.7%",
    color: "text-green-500",
    rotate: "rotate-6",
  },
  {
    word: "sleep",
    correct: false,
    top: "90%",
    left: "49.2%",
    color: "text-blue-500",
    rotate: "-rotate-6",
  },
  {
    word: "row",
    correct: true,
    top: "90%",
    left: "69.2%",
    color: "text-red-500",
    rotate: "rotate-6",
  },
  {
    word: "cone",
    correct: true,
    top: "85%",
    left: "84.6%",
    color: "text-yellow-500",
    rotate: "rotate-3",
  },

  {
    word: "clip",
    correct: false,
    top: "90%",
    left: "16%",
    color: "text-red-500",
    rotate: "-rotate-3",
  },
];

const Review7_Page2_Q2 = () => {
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

  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);

  const [results, setResults] = useState({});
  const [announcement, setAnnouncement] = useState("");
  const [playingKey, setPlayingKey] = useState(null);
  const audioRef = useRef(null);
  const MAX_SELECTION = 13;
  const isLocked = (word) => locked || results[word] === "correct";
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
  const playAudio = (src, key) => {
    if (!src) return;
    stopAudio();
    document.querySelectorAll("audio").forEach((audio) => audio.pause());
    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingKey(key);
    const finish = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      setPlayingKey(null);
      audio.onended = null;
      audio.onerror = null;
    };
    const fail = () => {
      if (audioRef.current !== audio) return;
      finish();
      setAnnouncement("Audio could not be played. Please try again.");
    };
    audio.onended = finish;
    audio.onerror = fail;
    audio.play().catch(fail);
  };
  useEffect(() => {
    const onOtherPlay = (event) => {
      if (event.target === audioRef.current) return;
      const audio = audioRef.current;
      audioRef.current = null;
      setPlayingKey(null);
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
    document.addEventListener("play", onOtherPlay, true);
    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.onended = null;
        audio.onerror = null;
        audio.pause();
      }
    };
  }, []);
  const onActivateKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    if (!e.repeat) e.currentTarget.click();
  };
  const onActivateKeyUp = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
  };
  const speakerBadge = (key) =>
    playingKey === key && (
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -10,
          left: -10,
          width: 22,
          height: 22,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 3,
          lineHeight: 1,
          background: "#fff",
          color: "#000",
          boxShadow: "0 1px 3px rgba(0,0,0,.25)",
        }}
      >
        <FaVolumeUp size={12} />
      </span>
    );

  const toggleWord = (word) => {
    playAudio(wordAudio[word], "word-" + word);
    if (isLocked(word)) {
      setAnnouncement(word + " is locked. Press Start Again to try again.");
      return;
    }
    if (!selected.includes(word) && selected.length >= MAX_SELECTION) {
      setAnnouncement(
        "You can select up to 13 words. Remove an incorrect choice before selecting another.",
      );
      return;
    }
    const updated = selected.includes(word)
      ? selected.filter((item) => item !== word)
      : [...selected, word];
    setSelected(updated);
    setResults((previous) => {
      const next = { ...previous };
      delete next[word];
      return next;
    });
    setAnnouncement(
      word +
        (updated.includes(word) ? " selected. " : " unselected. ") +
        updated.length +
        " words selected.",
    );
  };

  const checkAnswers = (checkEvent) => {
    if (completedCheckRef.current) { completeCheck(checkEvent); return; }

    if (locked) return;
    stopAudio();
    if (selected.length === 0) {
      ValidationAlert.info("Please select at least one word.");
      setAnnouncement("Please select at least one word.");
      return;
    }
    let correctCount = wordsData.filter((w) => w.correct).length;
    let userCorrect = selected.filter((w) =>
      wordsData.find((item) => item.word === w && item.correct),
    ).length;

    const color =
      userCorrect === correctCount
        ? "green"
        : userCorrect === 0
          ? "red"
          : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
        Score: ${userCorrect} / ${correctCount}
        </span>
      </div>
    `;

    if (userCorrect === correctCount) (completeCheck(checkEvent), ValidationAlert.success(msg));
    else if (userCorrect === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);

    setResults(
      Object.fromEntries(
        selected.map((word) => [
          word,
          wordsData.find((item) => item.word === word).correct
            ? "correct"
            : "wrong",
        ]),
      ),
    );
    setLocked(userCorrect === correctCount);
    setAnnouncement(
      `Score ${userCorrect} out of ${correctCount}. Correct selected words are locked. Remove incorrect choices and select missing words.`,
    );
  };

  const showAnswers = () => {
    stopAudio();
    const correctWords = wordsData.filter((w) => w.correct).map((w) => w.word);

    setSelected(correctWords);
    setResults(
      Object.fromEntries(correctWords.map((word) => [word, "correct"])),
    );
    setAnnouncement("All 13 correct words are shown and locked.");
    setLocked(true);
  };

  const resetAll = () => {
    stopAudio();
    setResults({});
    setAnnouncement(
      "Exercise reset. All selections, results and locks are cleared.",
    );
    setSelected([]);
    setLocked(false);
  };

  return (
    <div
      className="main-container-component"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") e.stopPropagation();
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") e.stopPropagation();
      }}
    >
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      <p id="r7p2q2-help" className="sr-only">
        Use Tab and Shift+Tab to move between words. Enter or Space listens to
        and toggles a word. Select up to 13 words. After checking, correct
        selections are locked and incorrect selections can be removed.
      </p>
      <div className="div-forall">
        {/* Title */}
        <ExerciseHeader
          sectionLetter="E"
          title={
           "Circle and count the long o words."
          }
          subTitle={"Circle each target word once, then count your circles before entering the total."}
          isReview={true}
        />
        <div className="flex justify-center items-center gap-10 mb-10 flex-wrap">
          {/* LEFT BOX */}
          <div className="bg-[#F9E5DC] rounded-3xl w-[600px] h-[400px] relative p-6">
            {wordsData.map((item, i) => {
              const isWrong =
                selected.includes(item.word) && results[item.word] === "wrong";
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: item.top,
                    left: item.left,
                  }}
                >
                  <span
                    role="button"
                    tabIndex={0}
                    data-word={item.word}
                    aria-pressed={selected.includes(item.word)}
                    aria-disabled={isLocked(item.word)}
                    aria-describedby="r7p2q2-help"
                    aria-label={
                      item.word +
                      (results[item.word] === "correct"
                        ? ", correct and locked"
                        : results[item.word] === "wrong"
                          ? ", incorrect, you can unselect it"
                          : "")
                    }
                    onClick={() => toggleWord(item.word)}
                    // onFocus={(e) => {
                    //   if (e.currentTarget.matches(":focus-visible"))
                    //     playAudio(wordAudio[item.word], "word-" + item.word);
                    // }}
                    onKeyDown={onActivateKeyDown}
                    onKeyUp={onActivateKeyUp}
                    style={{
                      borderColor:
                        selected.includes(item.word) && results[item.word]
                          ? results[item.word] === "correct"
                            ? "#16a34a"
                            : "#ef4444"
                          : undefined,
                      backgroundColor:
                        playingKey === "word-" + item.word
                          ? "#dbeafe"
                          : undefined,
                      outline:
                        playingKey === "word-" + item.word
                          ? "3px solid #2563eb"
                          : undefined,
                      outlineOffset:
                        playingKey === "word-" + item.word ? "2px" : undefined,
                    }}
                    className={`
      relative cursor-pointer text-lg font-medium ${focusClass}
      ${item.color}
      ${item.rotate}
      ${
        selected.includes(item.word)
          ? "border-2 border-red-500 rounded-full px-2 py-1"
          : ""
      }
    `}
                  >
                    {item.word}
                    {speakerBadge("word-" + item.word)}

                    {/* ❌ WRONG ICON */}
                    {isWrong && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow border-2 border-white"
                      >
                        ✕
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col justify-center gap-6">
            <p
              role="button"
              tabIndex={0}
              aria-label="How many long o words? Press Enter or Space to listen."
              onClick={() => playAudio(sound23, "count-question")}
              onKeyDown={onActivateKeyDown}
              onKeyUp={onActivateKeyUp}
              className={"relative text-lg" + focusClass}
              style={{
                boxShadow:
                  playingKey === "count-question"
                    ? "0 0 0 3px #2563eb"
                    : undefined,
                backgroundColor:
                  playingKey === "count-question" ? "#dbeafe" : undefined,
              }}
            >
              How many <span className="text-blue-700">long o</span> words?
              {speakerBadge("count-question")}
            </p>

            <div
              className={`w-[200px] border-b-2 text-center text-2xl ${locked ? "border-green-600" : "border-gray-400"}`}
              aria-label={`${selected.length} words selected`}
            >
              <span
                className={`font-bold ${locked ? "text-green-600" : "text-red-500"}`}
              >
                {selected.length}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="action-buttons-container">
          <button type="button" onClick={(checkEvent) => { resetCompletedCheck(); (resetAll)(checkEvent); }} className="try-again-button">
            Start Again ↻
          </button>

          <button
            type="button"
            onClick={showAnswers}
            className="show-answer-btn"
          >
            Show Answer
          </button>

          <button
            type="button"
            aria-disabled={locked}
            onClick={checkAnswers}
            className="check-button2"
          >
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review7_Page2_Q2;
