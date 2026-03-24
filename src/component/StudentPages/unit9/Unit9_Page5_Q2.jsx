import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Unit9_Page5_Q2.css";
import sound1 from "../../../assets/audio/ClassBook/U 10/CD61.Pg86_Instruction1_Adult Lady.mp3";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";

import img1 from "../../../assets/imgs/test6.png";
import img2 from "../../../assets/imgs/test6.png";
import img3 from "../../../assets/imgs/test6.png";
import img4 from "../../../assets/imgs/test6.png";
import img5 from "../../../assets/imgs/test6.png";
import img6 from "../../../assets/imgs/test6.png";

const questions = [
  {
    id: 1,
    images: [img1, img2],
    correctImage: 0,
    correctWord: "pain",
  },
  {
    id: 2,
    images: [img3, img4],
    correctImage: 1,
    correctWord: "shake",
  },
  {
    id: 3,
    images: [img5, img6],
    correctImage: 1,
    correctWord: "day",
  },
];

const wordBank = ["shake", "pain", "day"];

const Unit9_Page5_Q2 = () => {
  const [selected, setSelected] = useState({});
  const [droppedWords, setDroppedWords] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [locked, setLocked] = useState(false);

  const audioRef = useRef(null);
  const settingsRef = useRef(null);

  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const stopAtSecond = 14.2; // عدلها حسب طول الأوديو عندك

  const captions = [
    {
      start: 0,
      end: 7.5,
      text: "Which picture has a short a? Listen, circle, and write.",
    },
    { start: 7.6, end: 9.5, text: "1. sad" },
    { start: 9.6, end: 11.5, text: "2. cap" },
    { start: 11.6, end: 14.2, text: "3. cat" },
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
    audio.play().catch(() => {});

    const interval = setInterval(() => {
      if (audio.currentTime >= stopAtSecond) {
        audio.pause();
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 100);

    const handleEnded = () => {
      audio.currentTime = 0;
      setActiveIndex(null);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(interval);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (activeIndex === -1 || activeIndex === null) return;

    const el = document.getElementById(`caption-${activeIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSelect = (qId, index) => {
    if (locked) return;
    setSelected((prev) => ({ ...prev, [qId]: index }));
    setShowResult(false);
  };

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const word = draggableId.replace("word-", "");

    setDroppedWords((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((slotId) => {
        if (updated[slotId] === word) {
          delete updated[slotId];
        }
      });

      if (destination.droppableId === "word-bank") {
        return updated;
      }

      updated[destination.droppableId] = word;
      return updated;
    });

    setShowResult(false);
  };

  const removeWordFromSlot = (slotId) => {
    if (locked) return;

    setDroppedWords((prev) => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });

    setShowResult(false);
  };

  const availableWords = useMemo(() => {
    const usedWords = Object.values(droppedWords);
    return wordBank.filter((word) => !usedWords.includes(word));
  }, [droppedWords]);

  const checkAnswers = () => {
    if (locked) return;

    const notComplete = questions.some(
      (q) => selected[q.id] === undefined || !droppedWords[`slot-${q.id}`],
    );

    if (notComplete) {
      ValidationAlert.info("Please answer all questions.");
      return;
    }

    let totalScore = 0;
    const totalPossible = questions.length * 2; // 6

    questions.forEach((q) => {
      const imageCorrect = selected[q.id] === q.correctImage;
      const wordCorrect = droppedWords[`slot-${q.id}`] === q.correctWord;

      if (imageCorrect) totalScore += 1;
      if (wordCorrect) totalScore += 1;
    });

    const color =
      totalScore === totalPossible
        ? "green"
        : totalScore === 0
          ? "red"
          : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${totalScore} / ${totalPossible}
      </span>
    </div>
  `;

    if (totalScore === totalPossible) {
      ValidationAlert.success(scoreMessage);
    } else if (totalScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }

    setShowResult(true);
    setLocked(true);
  };

  const showAnswers = () => {
    const correctSelected = {};
    const correctWords = {};

    questions.forEach((q) => {
      correctSelected[q.id] = q.correctImage;
      correctWords[`slot-${q.id}`] = q.correctWord;
    });

    setSelected(correctSelected);
    setDroppedWords(correctWords);
    setShowResult(true);
    setLocked(true);
  };

  const resetAll = () => {
    setSelected({});
    setDroppedWords({});
    setShowResult(false);
    setLocked(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px", color: "#2e3192" }}>2</span>
            Which picture has a<span style={{ color: "#2e3192" }}>long a</span>?
            Listen, circle, and write.
          </h5>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              className="audio-popup-read"
              style={{
                width: "50%",
                marginTop: "0px",
              }}
            >
              <div className="audio-inner player-ui">
                <audio
                  ref={audioRef}
                  src={sound1}
                  onTimeUpdate={(e) => {
                    const time = e.target.currentTime;
                    setCurrent(time);
                    updateCaption(time);
                  }}
                  onLoadedMetadata={(e) => setDuration(e.target.duration)}
                />

                <div className="top-row">
                  <span className="audio-time">
                    {new Date(current * 1000).toISOString().substring(14, 19)}
                  </span>

                  <input
                    type="range"
                    className="audio-slider"
                    min="0"
                    max={duration || 0}
                    value={current}
                    onChange={(e) => {
                      audioRef.current.currentTime = Number(e.target.value);
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

          {/* WORD BANK */}
          <Droppable droppableId="word-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                  minHeight: "52px",
                }}
              >
                {availableWords.map((word, index) => (
                  <Draggable
                    key={word}
                    draggableId={`word-${word}`}
                    index={index}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "8px 18px",
                          borderRadius: "12px",
                          background: "#dbeafe",
                          color: "#1d4ed8",
                          fontWeight: "bold",
                          fontSize: "20px",
                          cursor: locked ? "default" : "grab",
                          userSelect: "none",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {word}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* QUESTIONS */}
          <div className="flex flex-col items-center gap-6 p-6">
            <div className="flex justify-center" style={{ gap: "6vw" }}>
              {questions.map((q) => {
                const slotId = `slot-${q.id}`;
                const droppedWord = droppedWords[slotId];

                return (
                  <div key={q.id} className="flex flex-col items-center">
                    <div className="flex gap-2 items-center">
                      {q.images.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelect(q.id, index)}
                          style={{
                            position: "relative",
                            width: "10vw",
                            height: "10vw",
                            cursor: locked ? "default" : "pointer",
                          }}
                        >
                          <img
                            src={img}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />

                          {selected[q.id] === index && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: showResult
                                  ? index === q.correctImage
                                    ? "4px solid green"
                                    : "4px solid red"
                                  : "4px solid red",
                                borderRadius: "50%",
                                pointerEvents: "none",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <Droppable droppableId={slotId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            marginTop: "12px",
                            minHeight: "38px",
                            minWidth: "95px",
                            borderBottom: "2px solid #222",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {droppedWord && (
                            <Draggable
                              draggableId={`word-${droppedWord}`}
                              index={0}
                              isDragDisabled={locked}
                            >
                              {(provided) => (
                                <span
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => removeWordFromSlot(slotId)}
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: showResult
                                      ? droppedWord === q.correctWord
                                        ? "green"
                                        : "red"
                                      : "#c62828",
                                    cursor: locked ? "default" : "pointer",
                                    userSelect: "none",
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {droppedWord}
                                </span>
                              )}
                            </Draggable>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={resetAll}>
            Start Again ↻
          </button>
          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>
          <button className="check-button2" onClick={checkAnswers}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit9_Page5_Q2;
