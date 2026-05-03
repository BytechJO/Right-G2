import React, { useMemo, useState } from "react";
import sound from "../../../assets/audio/WorkBook/cd3pg20instruction-adult-lady_bOtPfDKP.mp3";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import placeholderImg from "../../../assets/imgs/WorkBook/Right Int WB G2 U3 Folder/Page 20/Asset 37.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";

const conversations = [
  {
    id: "conv1",
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
  const state = {};

  conversations.forEach((conv) => {
    conv.lines.forEach((line) => {
      line.text.forEach((part) => {
        if (typeof part === "object") {
          state[part.id] = "";
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

  const stopAtSecond = 9.159;

  const captions = [
    {
      start: 0.5,
      end: 9.159,
      text: "Page 20 phonics, exercise B. Listen and write the missing letters. Practice the conversation in pairs.",
    },
  ];

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
    if (!items[blankId]) return false;
    return normalize(items[blankId]) !== normalize(correctLetter);
  };

  const handleChange = (blankId, value) => {
    if (showResults) return;

    setItems((prev) => ({
      ...prev,
      [blankId]: value,
    }));
  };

  const handleShowAnswer = () => {
    const filledAnswers = {};

    allBlanks.forEach((blank) => {
      filledAnswers[blank.id] = blank.correct;
    });

    setItems(filledAnswers);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setItems(initialState);
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;

    const allFilled = allBlanks.every((blank) => items[blank.id]);

    if (!allFilled) {
      ValidationAlert.info("Please fill all blanks first.");
      return;
    }

    setShowResults(true);

    let score = 0;
    const total = allBlanks.length;

    allBlanks.forEach((blank) => {
      if (normalize(items[blank.id]) === normalize(blank.correct)) {
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
      <div className="div-forall"  style={{gap:"25px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">B</span> Listen and select the missing
          letters.
        </h1>

        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={stopAtSecond}
        />

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 mt-4">
          <img
            src={placeholderImg}
            alt="conversation"
            style={{ height: "180px" }}
          />

          <div className="space-y-6">
            {conversations.map((conv) => (
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
                        <span key={part.id} className="relative mx-1">
                          <select
                            value={items[part.id] || ""}
                            onChange={(e) =>
                              handleChange(part.id, e.target.value)
                            }
                            disabled={showResults}
                            className={`border-b-2 px-1 text-[22px] font-bold bg-transparent outline-none cursor-pointer
                              ${
                                isWrongAnswer(part.id, part.correct)
                                  ? "border-red-500"
                                  : "border-gray-400"
                              }`}
                          >
                            <option value=""></option>
                            <option value="y">y</option>
                            <option value="j">j</option>
                          </select>

                          {isWrongAnswer(part.id, part.correct) && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                              ✕
                            </span>
                          )}
                        </span>
                      ),
                    )}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

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