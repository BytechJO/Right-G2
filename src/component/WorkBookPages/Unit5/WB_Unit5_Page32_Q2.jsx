// ExerciseB.jsx

import { useState, useEffect, useRef } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img from "../../../assets/imgs/test6.png";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import sound from "../../../assets/audio/WorkBook/p32q2.mp3";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 6.svg";
import img7 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 7.svg";
import img8 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 8.svg";
import img9 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 9.svg";
import img10 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 10.svg";
import img11 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 11.svg";
import img12 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page 32/Ex B 12.svg";

const questions = [
  {
    id: 1,
    word: "bee",
    sound: "ee",
    options: [
      { src: img1, label: "sleep" },
      { src: img2, label: "meat" },
      { src: img3, label: "sleep" },
    ],
    correct: [0, 2],
  },
  {
    id: 2,
    word: "tree",
    sound: "ee",
    options: [
      { src: img4, label: "bread" },
      { src: img5, label: "green" },
      { src: img6, label: "feet" },
    ],
    correct: [1, 2],
  },
  {
    id: 3,
    word: "bread",
    sound: "ea",
    options: [
      { src: img7, label: "sleep" },
      { src: img8, label: "bee" },
      { src: img9, label: "green" },
    ],
    correct: [], // هذا السؤال لا يوجد له إجابة صحيحة
  },
  {
    id: 4,
    word: "meat",
    sound: "ea",
    options: [
      { src: img10, label: "feet" },
      { src: img11, label: "sheep" },
      { src: img12, label: "bread" },
    ],
    correct: [2],
  },
];

export default function WB_Unit5_Page32_Q2() {
  const [selected, setSelected] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const clickAudioRef = useRef(null);
  const audioRef = useRef(null);
  const stopAtSecond = 9;
  const [paused, setPaused] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const captions = [
    {
      start: 0.58,
      end: 3.26,
      text: "Page 32, Phonics Exercise B. ",
    },
    {
      start: 4.46,
      end: 8.26,
      text: "Listen and circle the pictures that have the same vowel sound.",
    },
    { start: 9.44, end: 10.88, text: "1.bee" },

    { start: 12.14, end: 16.8, text: "bed, meat, sleep." },

    { start: 16.9, end: 18.22, text: "2.tree" },

    { start: 18.14, end: 20.22, text: "bread, thread, feet." },

    { start: 21.34, end: 23.28, text: "3.bread" },

    { start: 24.42, end: 30.06, text: "sleep, bee, thread." },

    { start: 30, end: 31.34, text: "4.meat" },

    { start: 31.28, end: 33.34, text: "feet, sheep, bread." },
  ];

  const updateCaption = (time) => {
    const index = captions.findIndex(
      (cap) => time >= cap.start && time <= cap.end,
    );
    setActiveIndex(index);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play();

    const interval = setInterval(() => {
      if (audio.currentTime >= stopAtSecond) {
        audio.pause();
        setPaused(true);
        setIsPlaying(false);
        setShowContinue(true);
        clearInterval(interval);
      }
    }, 100);

    const handleEnded = () => {
      const audio = audioRef.current;
      audio.currentTime = 0;
      setIsPlaying(false);
      setPaused(false);
      setActiveIndex(null);
      setShowContinue(true);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(interval);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 1000);

    if (activeIndex === -1 || activeIndex === null) return;

    const el = document.getElementById(`caption-${activeIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return () => clearInterval(timer);
  }, [activeIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setPaused(false);
      setIsPlaying(true);
    } else {
      audio.pause();
      setPaused(true);
      setIsPlaying(false);
    }
  };

  const toggle = (qId, idx) => {
    if (showResult) return;

    const q = questions.find((item) => item.id === qId);
    const requiredSelections = q?.correct?.length ?? 0;

    setSelected((prev) => {
      const cur = prev[qId] || [];

      // إذا الصورة مختارة مسبقًا، احذفها
      if (cur.includes(idx)) {
        return {
          ...prev,
          [qId]: cur.filter((i) => i !== idx),
        };
      }

      // إذا السؤال ما إله إجابة صحيحة، لا تسمح بأي اختيار
      if (requiredSelections === 0) {
        ValidationAlert.info("This row has no matching picture.");
        return prev;
      }

      // منع اختيار أكثر من العدد المطلوب لهذا السطر
      if (cur.length >= requiredSelections) {
        ValidationAlert.info(
          `You can select only ${requiredSelections} picture${requiredSelections > 1 ? "s" : ""} in this row.`,
        );
        return prev;
      }

      return {
        ...prev,
        [qId]: [...cur, idx],
      };
    });
  };

  const checkAnswers = () => {
    const unanswered = questions.filter(
      (q) => (selected[q.id] || []).length !== q.correct.length,
    );

    if (unanswered.length > 0) {
      ValidationAlert.info(
        "Please select the correct number of pictures for each row.",
      );
      return;
    }

    let correct = 0;

    questions.forEach((q) => {
      const userSel = [...(selected[q.id] || [])].sort().join(",");
      const rightSel = [...q.correct].sort().join(",");

      if (userSel === rightSel) correct++;
    });

    setScore(correct);
    setShowResult(true);

    if (correct === questions.length) {
      return ValidationAlert.success(`Score: ${correct}/${questions.length}`);
    } else if (correct === 0) {
      return ValidationAlert.error(`Score: ${correct}/${questions.length}`);
    } else {
      return ValidationAlert.warning(`Score: ${correct}/${questions.length}`);
    }
  };

  const handleShowAnswer = () => {
    const all = {};
    questions.forEach((q) => {
      all[q.id] = [...q.correct];
    });
    setSelected(all);
    setShowResult(true);
    setScore(questions.length);
  };

  const handleStartAgain = () => {
    setSelected({});
    setShowResult(false);
    setScore(null);
    setResetKey((k) => k + 1);
  };

  const getCellClass = (qId, idx) => {
    const isSelected = (selected[qId] || []).includes(idx);
    const q = questions.find((x) => x.id === qId);
    const isCorrectOption = q.correct.includes(idx);

    if (!isSelected) {
      return "cursor-pointer rounded-xl p-2 border-2 border-transparent hover:border-blue-300 transition-all";
    }

    if (!showResult) {
      return "cursor-pointer rounded-xl p-2 border-2 border-blue-500 bg-blue-50";
    }

    return isCorrectOption
      ? "cursor-pointer rounded-xl p-2 border-2 border-blue-500 bg-blue-50"
      : "cursor-pointer rounded-xl p-2 border-2 border-blue-500 bg-blue-50";
  };

  const isRowIncorrect = (q) => {
    if (!showResult) return false;

    const userSel = [...(selected[q.id] || [])].sort().join(",");
    const rightSel = [...q.correct].sort().join(",");

    return userSel !== rightSel;
  };

  return (
    <div key={resetKey} className="main-container-component">
      <div className="div-forall" style={{ marginBottom: "50px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span> Listen and circle the pictures that
          have the same
          <span className="text-blue-900 font-bold"> vowel sound</span>.
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "30px 0px",
            width: "100%",
          }}
        >
          <div
            className="audio-popup-read"
            style={{
              width: "50%",
            }}
          >
            <div className="audio-inner player-ui">
              <audio
                ref={audioRef}
                src={sound}
                onTimeUpdate={(e) => {
                  const time = e.target.currentTime;
                  setCurrent(time);
                  updateCaption(time);
                }}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
              ></audio>

              <div className="top-row">
                <span className="audio-time">
                  {new Date(current * 1000).toISOString().substring(14, 19)}
                </span>

                <input
                  type="range"
                  className="audio-slider"
                  min="0"
                  max={duration}
                  value={current}
                  onChange={(e) => {
                    audioRef.current.currentTime = e.target.value;
                    updateCaption(Number(e.target.value));
                  }}
                  style={{
                    background: `linear-gradient(to right, #430f68 ${
                      duration ? (current / duration) * 100 : 0
                    }%, #d9d9d9ff ${
                      duration ? (current / duration) * 100 : 0
                    }%)`,
                  }}
                />

                <span className="audio-time">
                  {new Date(duration * 1000).toISOString().substring(14, 19)}
                </span>
              </div>

              <div className="bottom-row">
                <div
                  className={`round-btn ${showCaption ? "active" : ""}`}
                  style={{ position: "relative" }}
                  onClick={() => setShowCaption(!showCaption)}
                >
                  <TbMessageCircle size={36} />
                  <div
                    className={`caption-inPopup ${showCaption ? "show" : ""}`}
                    style={{ top: "100%", left: "10%" }}
                  >
                    {captions.map((cap, i) => (
                      <p
                        key={i}
                        id={`caption-${i}`}
                        className={`caption-inPopup-line2 ${
                          activeIndex === i ? "active" : ""
                        }`}
                      >
                        {cap.text}
                      </p>
                    ))}
                  </div>
                </div>

                <button className="play-btn2" onClick={togglePlay}>
                  {isPlaying ? <FaPause size={26} /> : <FaPlay size={26} />}
                </button>

                <div className="settings-wrapper" ref={settingsRef}>
                  <button
                    className={`round-btn ${showSettings ? "active" : ""}`}
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <IoMdSettings size={36} />
                  </button>

                  {showSettings && (
                    <div className="settings-popup">
                      <label>Volume</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => {
                          const newVolume = Number(e.target.value);
                          setVolume(newVolume);
                          if (audioRef.current) {
                            audioRef.current.volume = newVolume;
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <audio ref={clickAudioRef} style={{ display: "none" }} />

        <div className="rounded-xl overflow-hidden border border-gray-200 mb-6">
          {questions.map((q, qi) => (
            <div
              key={q.id}
              className={`relative flex items-center gap-2 px-4 py-3 ${
                qi % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {isRowIncorrect(q) && (
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md z-10 border-2 border-white">
                  <span className="text-white text-lg font-bold">✕</span>
                </div>
              )}

              <div className="w-20 shrink-0">
                <span className="text-blue-600 font-bold mr-1">{q.id}</span>
                <span className="font-semibold text-gray-700">{q.word}</span>
              </div>

              <div className="flex flex-1 justify-around">
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggle(q.id, idx)}
                    className={getCellClass(q.id, idx)}
                  >
                    <img
                      src={opt.src}
                      className="max-w-40 max-h-15"
                      alt={opt.label}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
}
