import React, { useMemo, useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Volume2 } from "lucide-react";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import sound from "../../../assets/audio/WorkBook/titel G2/Unit 2.mp3";
import placeholderImg from "../../../assets/imgs/test6.png";
import Button from "../button";
import ValidationAlert from "../../Popup/ValidationAlert";

const conversations = [
  {
    id: "conv1",
    audioSrc: "/audio/conversation1.mp3",
    lines: [
      {
        speaker: "Stella",
        text: [
          "Where's my ",
          { id: "c1_1", correct: "y" },
          "o-",
          { id: "c1_2", correct: "y" },
          "o, John?",
        ],
      },
      { speaker: "John", text: ["Which one?"] },
      {
        speaker: "Stella",
        text: [
          "The ",
          { id: "c1_3", correct: "y" },
          "ellow one. It's ",
          { id: "c1_4", correct: "y" },
          "ellow like a banana.",
        ],
      },
      {
        speaker: "John",
        text: ["Oh yes! Here ", { id: "c1_5", correct: "y" }, "ou are."],
      },
    ],
  },
  {
    id: "conv2",
    audioSrc: "/audio/conversation2.mp3",
    lines: [
      {
        speaker: "Stella",
        text: [
          "Where are my ",
          { id: "c2_1", correct: "j" },
          "eans, ",
          { id: "c2_2", correct: "J" },
          "ohn?",
        ],
      },
      { speaker: "John", text: ["Which ones?"] },
      {
        speaker: "Stella",
        text: [
          "The blue ones that I bought with the red ",
          { id: "c2_3", correct: "j" },
          "acket?",
        ],
      },
      {
        speaker: "John",
        text: ["Here ", { id: "c2_4", correct: "y" }, "ou are."],
      },
    ],
  },
];

const buildInitialState = () => {
  const state = {
    wordBank: [
      { id: "bank_y", text: "y" },
      { id: "bank_j", text: "j" },
    ],
  };

  conversations.forEach((conv) => {
    conv.lines.forEach((line) => {
      line.text.forEach((part) => {
        if (typeof part === "object") {
          state[part.id] = [];
        }
      });
    });
  });

  return state;
};

const WB_Unit3_Page20_Q2 = () => {
  const initialState = useMemo(() => buildInitialState(), []);
  const [items, setItems] = useState(initialState);
  const [showResults, setShowResults] = useState(false);
  const clickAudioRef = useRef(null);
  const audioRef = useRef(null);
  const stopAtSecond = 9;
  const [paused, setPaused] = useState(false);
  // إعدادات الصوت
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

  const allBlanks = useMemo(() => {
    const blanks = [];
    conversations.forEach((conv) => {
      conv.lines.forEach((line) => {
        line.text.forEach((part) => {
          if (typeof part === "object") blanks.push(part);
        });
      });
    });
    return blanks;
  }, []);

  const normalize = (text) => text?.trim().toLowerCase();

  const isWrongAnswer = (blankId, correctLetter) => {
    if (!showResults) return false;
    const dropped = items[blankId]?.[0]?.text;
    if (!dropped) return false;

    return normalize(dropped) !== normalize(correctLetter);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    setShowResults(false);

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setItems((prev) => {
      const newState = { ...prev };

      // إذا السحب من wordBank إلى فراغ: نعمل clone
      if (
        source.droppableId === "wordBank" &&
        destination.droppableId !== "wordBank"
      ) {
        const sourceItem = prev.wordBank[source.index];
        const destList = Array.from(newState[destination.droppableId]);

        const clonedItem = {
          id: `${sourceItem.text}_${destination.droppableId}_${Date.now()}`,
          text: sourceItem.text,
        };

        destList.splice(0, destList.length, clonedItem);
        newState[destination.droppableId] = destList;
        return newState;
      }

      // إذا من فراغ إلى wordBank: نحذف من الفراغ فقط
      if (
        source.droppableId !== "wordBank" &&
        destination.droppableId === "wordBank"
      ) {
        newState[source.droppableId] = [];
        return newState;
      }

      // إذا من فراغ إلى فراغ
      if (
        source.droppableId !== "wordBank" &&
        destination.droppableId !== "wordBank"
      ) {
        const sourceList = Array.from(newState[source.droppableId]);
        const destList = Array.from(newState[destination.droppableId]);
        const [movedItem] = sourceList.splice(source.index, 1);

        destList.splice(0, destList.length, movedItem);

        newState[source.droppableId] = sourceList;
        newState[destination.droppableId] = destList;
        return newState;
      }

      return newState;
    });
  };

  const handleShowAnswer = () => {
    const filledAnswers = {
      wordBank: [
        { id: "bank_y", text: "y" },
        { id: "bank_j", text: "j" },
      ],
    };

    allBlanks.forEach((blank, index) => {
      filledAnswers[blank.id] = [
        {
          id: `ans_${index + 1}`,
          text: blank.correct,
        },
      ];
    });

    setItems(filledAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setItems(initialState);
    setShowResults(false);
  };

  const checkAnswers = () => {
    const allFilled = allBlanks.every(
      (blank) => items[blank.id] && items[blank.id].length > 0,
    );

    if (!allFilled) {
      ValidationAlert.info("Please fill all blanks first.");
      return;
    }

    setShowResults(true);

    let score = 0;
    const total = allBlanks.length;

    allBlanks.forEach((blank) => {
      if (normalize(items[blank.id][0]?.text) === normalize(blank.correct)) {
        score++;
      }
    });

    if (score === total) {
      ValidationAlert.success(`Score: ${score} / ${total}`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / ${total}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${total}`);
    }
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "20px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span> Listen and drag the missing
          letters.
        </h1>

        <DragDropContext onDragEnd={onDragEnd}>
          {/* Word Bank */}
          <div className="p-2 border rounded-xl bg-gray-50">
            <Droppable droppableId="wordBank" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-wrap justify-center items-center gap-3 min-h-[42px]"
                >
                  {items.wordBank.map((letter, index) => (
                    <Draggable
                      key={letter.id}
                      draggableId={letter.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg shadow-sm cursor-grab ${
                            snapshot.isDragging ? "rotate-2" : ""
                          }`}
                        >
                          {letter.text}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "15px 0px",
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
          <audio ref={clickAudioRef} style={{ display: "none" }} />

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 mt-2">
            <img
              src={placeholderImg}
              alt="conversation"
              className="max-w-50 max-h-48 rounded-lg shadow-md mx-auto md:mx-0 mt-25"
            />

            <div className="space-y-6">
              {conversations.map((conv, index) => (
                <div key={conv.id}>
                  {conv.lines.map((line, lineIndex) => (
                    <p
                      key={lineIndex}
                      className="text-lg leading-10 flex flex-wrap items-center"
                    >
                      <span className="font-bold w-20 inline-block">
                        {line.speaker}:
                      </span>

                      {line.text.map((part, partIndex) =>
                        typeof part === "string" ? (
                          <span key={partIndex}>{part}</span>
                        ) : (
                          <Droppable key={part.id} droppableId={part.id}>
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`relative inline-flex align-middle mx-1 w-8 h-9 items-center justify-center border-b-2 font-bold transition-colors`}
                              >
                                {items[part.id].map((letter, index) => (
                                  <Draggable
                                    key={letter.id}
                                    draggableId={letter.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <span
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-red-600 font-bold"
                                      >
                                        {letter.text}
                                      </span>
                                    )}
                                  </Draggable>
                                ))}

                                {isWrongAnswer(part.id, part.correct) && (
                                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                                    ✕
                                  </span>
                                )}

                                {provided.placeholder}
                              </span>
                            )}
                          </Droppable>
                        ),
                      )}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </DragDropContext>

        <div className="mt-10 flex justify-center">
          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
      </div>
    </div>
  );
};

export default WB_Unit3_Page20_Q2;
