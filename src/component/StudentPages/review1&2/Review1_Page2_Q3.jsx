import React, { useState, useRef, useEffect } from "react";
import "./Review1_Page2_Q3.css";
import ExerciseHeader from "../../ExerciseHeader";

import lap from "../../../assets/audio/ClassBook/U 2/Page 17 - E/lap.mp3";
import rap from "../../../assets/audio/ClassBook/U 2/Page 17 - E/rap.mp3";
import led from "../../../assets/audio/ClassBook/U 2/Page 17 - E/led.mp3";
import red from "../../../assets/audio/ClassBook/U 2/Page 17 - E/red.mp3";
import lip from "../../../assets/audio/ClassBook/U 2/Page 17 - E/lip.mp3";
import rip from "../../../assets/audio/ClassBook/U 2/Page 17 - E/rip.mp3";
import lot from "../../../assets/audio/ClassBook/U 2/Page 17 - E/lot.mp3";
import rot from "../../../assets/audio/ClassBook/U 2/Page 17 - E/rot.mp3";
import lug from "../../../assets/audio/ClassBook/U 2/Page 17 - E/lug.mp3";
import rug from "../../../assets/audio/ClassBook/U 2/Page 17 - E/rug.mp3";

/* ================= DATA ================= */

const PAIRS = [
  {
    id: 1,
    words: [
      { text: "lap", audio: lap },
      { text: "rap", audio: rap },
    ],
  },
  {
    id: 2,
    words: [
      { text: "led", audio: led },
      { text: "red", audio: red },
    ],
  },
  {
    id: 3,
    words: [
      { text: "lip", audio: lip },
      { text: "rip", audio: rip },
    ],
  },
  {
    id: 4,
    words: [
      { text: "lot", audio: lot },
      { text: "rot", audio: rot },
    ],
  },
  {
    id: 5,
    words: [
      { text: "lug", audio: lug },
      { text: "rug", audio: rug },
    ],
  },
];

/* ================= HELPERS (خارج الكومبوننت) ================= */

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

const Review1_Page2_Q3 = () => {
  const [playingKey, setPlayingKey] = useState(null); // مثل "1-lap"
  const [activeId, setActiveId] = useState(null); // آخر كرت تعاملت معه
  const [message, setMessage] = useState("");

  const audioRef = useRef(null);
  const tokenRef = useRef(0); // بيلغي أي تشغيل معلّق

  /* ================= AUDIO ================= */

  const stopSound = () => {
    tokenRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingKey(null);
  };

  // تشغيل (أو إعادة تشغيل من الأول) بدون تداخل مع أي صوت ثاني
  const playWord = (pairId, word) => {
    stopSound();
    pauseOtherAudio();

    const token = tokenRef.current;
    const audio = new Audio(word.audio);
    audioRef.current = audio;

    const key = `${pairId}-${word.text}`;
    setPlayingKey(key);
    setMessage(`Playing ${word.text}.`);

    audio.onended = () => {
      if (token === tokenRef.current) setPlayingKey(null);
    };
    audio.onerror = () => {
      if (token === tokenRef.current) setPlayingKey(null);
    };
    audio.play().catch(() => {
      if (token === tokenRef.current) setPlayingKey(null);
    });
  };

  // لو اشتغل أي صوت ثاني بالصفحة نوقف صوتنا، وعند الخروج من الصفحة نوقف كل شي
  useEffect(() => {
    const onOtherPlay = (e) => {
      if (e.target !== audioRef.current) {
        tokenRef.current += 1;
        audioRef.current?.pause();
        setPlayingKey(null);
      }
    };

    document.addEventListener("play", onOtherPlay, true);

    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      tokenRef.current += 1;
      audioRef.current?.pause();
    };
  }, []);

  /* ================= INTERACTIONS ================= */

  // فوكس بالتاب = شغّل الصوت (الماوس/اللمس بيروحوا على onClick)
  const onWordFocus = (e, pairId, word) => {
    setActiveId(pairId);
    if (e.currentTarget.matches(":focus-visible")) playWord(pairId, word);
  };

  const onWordClick = (pairId, word) => {
    setActiveId(pairId);
    playWord(pairId, word);
  };

  /* ================= RENDER ================= */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      {/* 📢 رسائل لقارئ الشاشة */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>

      <div className="div-forall" style={{ marginBottom: "35px",gap:"130px" }}>
        <ExerciseHeader
          sectionLetter="E"
          title="Read and say the words."
          subTitle="Tap a word to listen, then say it out loud."
          isReview="true"
        />

        <p id="r1p2q3-help" className="sr-only">
          There are five pairs of words. Press Tab to move between the words.
          When a word is focused, its sound plays. Press Enter or Space to hear
          it again.
        </p>

        <div
          className="CB-r1p2q3-list"
          role="group"
          aria-label="Words to read and say"
          aria-describedby="r1p2q3-help"
        >
          {PAIRS.map((pair) => (
            <div
              key={pair.id}
              role="group"
              aria-label={`Pair ${pair.id}: ${pair.words[0].text} and ${pair.words[1].text}`}
              className={`CB-r1p2q3-card ${
                activeId === pair.id ? "is-active" : ""
              }`}
            >
              <span className="CB-r1p2q3-num" aria-hidden="true">
                {pair.id}
              </span>

              {pair.words.map((word) => {
                const isPlaying = playingKey === `${pair.id}-${word.text}`;

                return (
                  <button
                    key={word.text}
                    type="button"
                    className={`CB-r1p2q3-word ${isPlaying ? "is-playing" : ""}`}
                    aria-label={`Listen to ${word.text}`}
                    onClick={() => onWordClick(pair.id, word)}
                    onFocus={(e) => onWordFocus(e, pair.id, word)}
                  >
                    <span className="CB-r1p2q3-text" aria-hidden="true">
                      {word.text}
                    </span>

                    <span
                      className={`CB-r1p2q3-speaker ${
                        isPlaying ? "playing" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="currentColor"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3z" />
                        <path
                          d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review1_Page2_Q3;