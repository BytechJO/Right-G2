/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/test6.png";
import "./Review6_Page2_Q1.css";
import sound1 from "../../../assets/audio/ClassBook/U 6/Pg53_1.1_Adult Lady.mp3";
import { TbMessageCircle } from "react-icons/tb";
import { FaPause, FaPlay } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const words = [
  { id: 1, word: "light" },
  { id: 2, word: "bike" },
  { id: 3, word: "five" },
  { id: 4, word: "night" },
  { id: 5, word: "bike" },
];

const correctAnswers = ["bike", "five", "light", "bike", "night"];

export default function Review6_Page2_Q1() {
  const [answers, setAnswers] = useState([null, null, null, null, null]);
  const [locked, setLocked] = useState(false);
  const audioRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const stopAtSecond = 3.5;
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 4.23,
      text: "Page 8. Right Activities. Exercise A, number 1. ",
    },
    {
      start: 4.25,
      end: 8.28,
      text: "Listen and write the missing letters. Number the pictures.  ",
    },
    { start: 8.3, end: 11.05, text: "1-tiger." },
    { start: 11.07, end: 13.12, text: "2-taxi." },
    { start: 13.14, end: 15.14, text: "3-duck." },
    { start: 15.16, end: 17.13, text: "4-deer." },
  ];

  // ================================
  // ✔ Update caption highlight
  // ================================
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

    // عند انتهاء الأوديو يرجع يبطل أنيميشن + يظهر Continue
    const handleEnded = () => {
      const audio = audioRef.current;
      audio.currentTime = 0; // ← يرجع للبداية
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
    }, 1000); // كل ثانية
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
  const onDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination || locked) return;

    const id = Number(draggableId.replace("word-", ""));
    const index = Number(destination.droppableId.split("-")[1]);

    const selectedWord = words.find((w) => w.id === id);

    const updated = [...answers];
    updated[index] = selectedWord;

    setAnswers(updated);
  };

  const resetAnswers = () => {
    setAnswers([null, null, null, null, null]);
    setLocked(false);
  };

  const showAnswers = () => {
    const available = [...words];

    const filled = correctAnswers.map((word) => {
      const index = available.findIndex((w) => w.word === word);

      const selected = available[index];

      available.splice(index, 1);

      return selected;
    });

    setAnswers(filled);
    setLocked(true);
  };
  const checkAnswers = () => {
    if (locked) return;

    if (answers.some((a) => a === null)) {
      ValidationAlert.info("Please complete all answers");
      return;
    }

    let score = 0;

    answers.forEach((a, i) => {
      if (a.word === correctAnswers[i]) score++;
    });

    const total = correctAnswers.length;

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:#2e7d32;font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) ValidationAlert.success(message);
    else if (score === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);

    setLocked(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div className="div-forall" style={{ width: "60%" }}>
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>D</span>
            Listen, read, and complete the story.
          </h5>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
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
                  src={sound1}
                  onTimeUpdate={(e) => {
                    const time = e.target.currentTime;
                    setCurrent(time);
                    updateCaption(time);
                  }}
                  onLoadedMetadata={(e) => setDuration(e.target.duration)}
                ></audio>
                {/* Play / Pause */}
                {/* Play / Pause */}
                {/* الوقت - السلايدر - الوقت */}
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
                        (current / duration) * 100
                      }%, #d9d9d9ff ${(current / duration) * 100}%)`,
                    }}
                  />

                  <span className="audio-time">
                    {new Date(duration * 1000).toISOString().substring(14, 19)}
                  </span>
                </div>
                {/* الأزرار 3 أزرار بنفس السطر */}
                <div className="bottom-row">
                  {/* فقاعة */}
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

                  {/* Play */}
                  <button className="play-btn2" onClick={togglePlay}>
                    {isPlaying ? <FaPause size={26} /> : <FaPlay size={26} />}
                  </button>

                  {/* Settings */}
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
                            setVolume(e.target.value);
                            audioRef.current.volume = e.target.value;
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>{" "}
              </div>
            </div>
          </div>
          {/* STORY */}
          <div className="flex items-center gap-[3%] mb-5 flex-wrap">
            <div className="text-[20px] leading-loose flex-1">
              Andrew rides his
              <Droppable droppableId="slot-0">
                {(provided) => (
                  <span
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="inline-block min-w-[100px] border-b-2 border-black mx-1.5 text-center"
                  >
                    {answers[0]?.word}
                    {provided.placeholder}
                  </span>
                )}
              </Droppable>
              at
              <Droppable droppableId="slot-1">
                {(provided) => (
                  <span
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="inline-block min-w-[100px] border-b-2 border-black mx-1.5 text-center"
                  >
                    {answers[1]?.word}
                    {provided.placeholder}
                  </span>
                )}
              </Droppable>
              o’clock every evening. He has a
              <Droppable droppableId="slot-2">
                {(provided) => (
                  <span
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="inline-block min-w-[100px] border-b-2 border-black mx-1.5 text-center"
                  >
                    {answers[2]?.word}
                    {provided.placeholder}
                  </span>
                )}
              </Droppable>
              on his
              <Droppable droppableId="slot-3">
                {(provided) => (
                  <span
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="inline-block min-w-[100px] border-b-2 border-black mx-1.5 text-center"
                  >
                    {answers[3]?.word}
                    {provided.placeholder}
                  </span>
                )}
              </Droppable>
              when he rides at
              <Droppable droppableId="slot-4">
                {(provided) => (
                  <span
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="inline-block min-w-[100px] border-b-2 border-black mx-1.5 text-center"
                  >
                    {answers[4]?.word}
                    {provided.placeholder}
                  </span>
                )}
              </Droppable>
              .
            </div>

            <img
              src={img1}
              alt=""
              style={{
                width: "100%",
                maxWidth: "320px",
                height: "auto",
                border: "2px solid red",
                borderRadius: "15px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* WORD BANK */}
          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-[15px] justify-center mt-5"
              >
                {words
                  .filter((word) => !answers.some((a) => a?.id === word.id))
                  .map((word, i) => (
                    <Draggable
                      key={word.id}
                      draggableId={`word-${word.id}`}
                      index={i}
                      isDragDisabled={locked}
                    >
                      {(provided) => (
                        <span
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="px-3.5 py-1.5 border-2 border-[#2c5287] rounded-lg font-bold cursor-grab bg-white"
                        >
                          {word.word}
                        </span>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* BUTTONS */}

        <div className="action-buttons-container">
          <button onClick={resetAnswers} className="try-again-button">
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
    </DragDropContext>
  );
}
