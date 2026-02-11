import React, { useState ,useRef,useEffect} from "react";
import img1 from "../../../assets/imgs/test.png";
import img2 from "../../../assets/imgs/test.png";
import img3 from "../../../assets/imgs/test.png";
import img4 from "../../../assets/imgs/test.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound1 from "../../../assets/audio/ClassBook/U 2/CD14.Pg19_Instruction3_Adult Lady.mp3";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import "./Review2_Page2_Q3.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Review2_Page2_Q3 = () => {
  const items = [
    { img: img1, correct: "c", correctInput: "cat", option: ["c", "q"] },
    {
      img: img2,
      correct: "-x",
      correctInput: "box",
      option: ["-ck", "-x"],
    },
    {
      img: img3,
      correct: "-ck",
      correctInput: "clock",
      option: ["-ck", "-x"],
    },
    {
      img: img4,
      correct: "q",
      correctInput: "queen",
      option: ["c", "q"],
    },
  ];

  const [selected, setSelected] = useState(["", "", "", ""]);
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [locked, setLocked] = useState(false);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [showResult, setShowResult] = useState(false);

  /* ================ audio logic =========================*/

  const audioRef = useRef(null);
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const stopAtSecond = 3.5;
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);

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

    const value = draggableId.replace("word-", "").replace("filled-", "");
    const index = Number(destination.droppableId.split("-")[1]);

    setAnswers((prev) => {
      const updated = [...prev];

      // منع التكرار
      const oldIndex = updated.findIndex((a) => a === value);
      if (oldIndex !== -1) updated[oldIndex] = "";

      updated[index] = value;
      return updated;
    });

    setShowResult(false);
  };

  const handleSelect = (value, index) => {
    if (locked) return; // 🔒 لا تعديل بعد show answer
    const newSel = [...selected];
    newSel[index] = value;
    setSelected(newSel);
    setShowResult(false);
  };

  const resetAll = () => {
    setSelected(["", "", "", ""]);
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setShowResult(false);
    setLocked(false); // 🔒 قفل كل شيء
  };
  const showAnswers = () => {
    // حط الدوائر الصح
    const correctCircles = items.map((item) => item.correct);

    // حط الكتابة الصحيحة
    const correctTexts = items.map((item) => item.correctInput);

    setSelected(correctCircles);
    setAnswers(correctTexts);
    setWrongInputs([]);
    setShowResult(false);

    setLocked(true); // 🔒 قفل كل شيء
  };

  const checkAnswers = () => {
    if (locked) return;
    // 1) التشييك إذا في دائرة مش مختارة
    if (selected.some((s) => s === "")) {
      ValidationAlert.info("Please choose a circle (f or v) for all items!");
      return;
    }

    // 2) التشييك إذا في input فاضي
    if (answers.some((a) => a.trim() === "")) {
      ValidationAlert.info("Please fill in all the writing boxes!");
      return;
    }

    let wrong = [];
    let score = 0;
    setLocked(true);
    items.forEach((item, i) => {
      const circleCorrect = selected[i] === item.correct;
      const inputCorrect =
        answers[i].trim().toLowerCase() === item.correctInput.toLowerCase();

      // نقطة للدائرة + نقطة للكتابة
      if (circleCorrect) score++;
      if (inputCorrect) score++;

      if (!circleCorrect || !inputCorrect) {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setShowResult(true);

    const total = items.length * 2; // 8 نقاط
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    if (score === total) {
      ValidationAlert.success(scoreMessage);
    } else if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
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
            // gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span style={{ marginRight: "20px" }}>G</span> Listen, circle, and
            write.
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
          <Droppable droppableId="bank" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.correctInput}
                    draggableId={`word-${item.correctInput}`}
                    index={index}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "7px 14px",
                          border: "2px solid #2c5287",
                          borderRadius: "8px",
                          background: "white",
                          fontWeight: "bold",
                          cursor: "grab",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item.correctInput}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="question-grid-CB-review2-p2-q3">
            {items.map((item, i) => (
              <div className="question-box-CB-review2-p2-q3" key={i}>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: "600",
                    color: "#1d4f7b",
                  }}
                >
                  {i + 1}
                </span>

                <div className="img-option-CB-review2-p2-q3">
                  <img
                    src={item.img}
                    className="q-img-CB-review2-p2-q3"
                    style={{ height: "auto", width: "200px" }}
                  />

                  {/* f / v choices */}
                  <div className="choices-CB-review2-p2-q3">
                    {item.option.map((op, index) => (
                      <div className="circle-wrapper" key={index}>
                        <div
                          className={`circle-choice-CB-review2-p2-q3 ${
                            selected[i] === `${op}` ? "active" : ""
                          }`}
                          onClick={() => !locked && handleSelect(op, i)}
                        >
                          {op}
                        </div>

                        {showResult &&
                          selected[i] === `${op}` &&
                          selected[i] !== item.correct && (
                            <div className="wrong-mark-CB-review2-p2-q3 ">
                              ✕
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* writing input */}
                <div className="input-wrapper-CB-review2-p2-q3">
                  {item.input}

                  <Droppable droppableId={`slot-${i}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`write-input-CB-review2-p2-q3 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[i] && (
                          <Draggable
                            draggableId={`filled-${answers[i]}`}
                            index={0}
                            isDragDisabled={true}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[i]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {showResult &&
                    answers[i].trim() !== "" &&
                    answers[i].trim().toLowerCase() !==
                      item.correctInput.toLowerCase() &&
                    wrongInputs.includes(i) && (
                      <div className="wrong-mark-CB-review2-p2-q3 ">✕</div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
          <button
            onClick={showAnswers}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review2_Page2_Q3;
