import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex H 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex H 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex H 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Ex H 4.svg";
import img from "../../../assets/imgs/WorkBook/Right Int WB G2 U2 Folder/Page 12/Asset 43.svg";
const correctAnswers = {
  input1_1: "Are these",
  input1_2: "Yes, they are.",
  input2_1: "Is this a",
  input2_2: "Yes, it is.",
  input3_1: "Is this a",
  input3_2: "Yes, it is.",
  input4_1: "Are these",
  input4_2: "No, they aren't.",
};

const questions = [
  { id: "q1", number: 1, question1_end: "dogs?", image: 2 },
  { id: "q2", number: 2, question1_end: "squirrel?", image: 3 },
  { id: "q3", number: 3, question1_end: "horse?", image: 0 },
  { id: "q4", number: 4, question1_end: "rabbits?", image: 1 },
];

/* ================= SVG ================= */

const InteractiveConnectingLines = ({
  connections,
  leftDotsPositions,
  rightDotsPositions,
}) => {
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
      {connections.map((connection, index) => {
        const leftPos = leftDotsPositions[connection.leftDotId];
        const rightPos = rightDotsPositions[connection.rightImageIndex];

        if (!leftPos || !rightPos) return null;

        return (
          <path
            key={index}
            d={`M ${leftPos.x} ${leftPos.y} 
           C ${(leftPos.x + rightPos.x) / 2} ${leftPos.y},
             ${(leftPos.x + rightPos.x) / 2} ${rightPos.y},
             ${rightPos.x} ${rightPos.y}`}
            stroke="red"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
        );
      })}
    </svg>
  );
};

/* ================= MATCHING ================= */

const MatchingSection = ({
  leftDotsPositions,
  setLeftDotsPositions,
  rightDotsPositions,
  setRightDotsPositions,
  connections,
}) => {
  const containerRef = useRef(null);
  const leftDotsRef = useRef([]);
  const rightDotsRef = useRef([]);

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      const left = {};
      leftDotsRef.current.forEach((dot, index) => {
        if (!dot) return;
        const rect = dot.getBoundingClientRect();

        left[`q${index + 1}`] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        };
      });

      const right = {};
      rightDotsRef.current.forEach((dot, index) => {
        if (!dot) return;
        const rect = dot.getBoundingClientRect();

        right[index] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        };
      });

      setLeftDotsPositions(left);
      setRightDotsPositions(right);
    };

    // Use ResizeObserver for more reliable updates
    const resizeObserver = new ResizeObserver(() => {
      calc();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial calculation after a short delay to ensure layout is ready
    const timer = setTimeout(calc, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [setLeftDotsPositions, setRightDotsPositions]);

  const images = [img1, img2, img3, img4];
  const labels = ["horse", "mules", "dogs", "squirrel"];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex justify-between items-center min-h-[400px]"
    >
      {/* LEFT DOTS */}
      <div className="flex flex-col justify-around h-full">
        {images.map((_, i) => (
          <div key={i} className="flex items-center h-[100px]">
            <div
              ref={(el) => (leftDotsRef.current[i] = el)}
              className="w-5 h-5 bg-gray-400 rounded-full"
            />
          </div>
        ))}
      </div>

      {/* LINES */}
      <InteractiveConnectingLines
        connections={connections}
        leftDotsPositions={leftDotsPositions}
        rightDotsPositions={rightDotsPositions}
      />

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-around h-full items-start">
        {images.map((image, index) => (
          <div key={index} className="flex items-center gap-3 h-[100px]">
            <div
              ref={(el) => (rightDotsRef.current[index] = el)}
              className="w-5 h-5 bg-gray-400 rounded-full"
            />
            <div className="flex flex-col items-center gap-2">
              <img src={image} style={{ height: "90px" }} alt={labels[index]} />
              <span className="text-sm font-semibold text-gray-700">
                {labels[index]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= MAIN ================= */

export default function WritingExercise() {
  const [inputs, setInputs] = useState({
    input1_1: "",
    input1_2: "",
    input2_1: "",
    input2_2: "",
    input3_1: "",
    input3_2: "",
    input4_1: "",
    input4_2: "",
  });

  const [results, setResults] = useState({});
  const [leftDotsPositions, setLeftDotsPositions] = useState({});
  const [rightDotsPositions, setRightDotsPositions] = useState({});
  const [connections, setConnections] = useState([]);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (
      Object.keys(leftDotsPositions).length &&
      Object.keys(rightDotsPositions).length
    ) {
      setConnections(
        questions.map((q) => ({
          leftDotId: q.id,
          rightImageIndex: q.image,
        })),
      );
    }
  }, [leftDotsPositions, rightDotsPositions]);

  const handleSelectChange = (inputName, value) => {
    setInputs((prev) => ({ ...prev, [inputName]: value }));
  };

  const checkAnswers = () => {
    if (locked) return;

    // ⭐ تحقق إذا في input فاضي
    const hasEmpty = Object.values(inputs).some((value) => value.trim() === "");

    if (hasEmpty) {
      ValidationAlert.info("Oops!", "Please complete all fields first.");
      return;
    }

    let score = 0;
    const newResults = {};

    for (const key in correctAnswers) {
      const isCorrect = inputs[key] === correctAnswers[key];
      newResults[key] = isCorrect;
      if (isCorrect) score++;
    }

    setResults(newResults);

    if (score === 8) {
      ValidationAlert.success(`Score: ${score} / 8`);
    } else if (score > 0) {
      ValidationAlert.warning(`Score: ${score} / 8`);
    } else {
      ValidationAlert.error(`Score: ${score} / 8`);
    }

    setLocked(true);
  };

  const resetExercise = () => {
    setInputs(Object.fromEntries(Object.keys(inputs).map((k) => [k, ""])));
    setResults({});
    setLocked(false);
    setConnections(
      questions.map((q) => ({
        leftDotId: q.id,
        rightImageIndex: q.image,
      })),
    );
  };

  const handleShowAnswer = () => {
    setInputs(correctAnswers);
    setLocked(true);
    setConnections(
      questions.map((q) => ({
        leftDotId: q.id,
        rightImageIndex: q.image,
      })),
    );

    const showResults = {};
    Object.keys(correctAnswers).forEach((k) => (showResults[k] = true));
    setResults(showResults);
  };

  const getInputBorderColor = (name) => {
    if (results[name] === undefined) return "border-gray-300";
    return results[name] ? "border-gray-300" : "border-red-500";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{ gap: "5px" }}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">H</span> Look, trace, and write.
        </h1>
        <div className="font-sans w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* LEFT SIDE */}
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="flex items-start space-x-3 text-lg">
                  <span className="font-bold text-blue-900">{q.number}</span>

                  <div className="w-full space-y-4">
                    <div className="relative">
                      <div
                        className={`border-b-2 pb-2 ${getInputBorderColor(`input${q.number}_1`)}`}
                      >
                        <select
                          className={`bg-transparent outline-none ${
                            inputs[`input${q.number}_1`] === ""
                              ? "text-gray-400"
                              : "text-black"
                          }`}
                          value={inputs[`input${q.number}_1`]}
                          onChange={(e) =>
                            handleSelectChange(
                              `input${q.number}_1`,
                              e.target.value,
                            )
                          }
                        >
                          <option value="" disabled hidden>
                            -- Select Question --
                          </option>
                          <option value="Is this a">Is this a</option>
                          <option value="Are these">Are these</option>
                        </select>

                        <span className="text-red-600 ml-2">
                          {q.question1_end}
                        </span>
                      </div>

                      {/* ❌ ICON */}
                      {results[`input${q.number}_1`] === false && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <span className="text-white text-sm font-bold">
                            ✕
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div
                        className={`border-b-2 pb-2 ${getInputBorderColor(`input${q.number}_2`)}`}
                      >
                        <select
                          className={`bg-transparent outline-none ${
                            inputs[`input${q.number}_2`] === ""
                              ? "text-gray-400"
                              : "text-black"
                          }`}
                          value={inputs[`input${q.number}_2`]}
                          onChange={(e) =>
                            handleSelectChange(
                              `input${q.number}_2`,
                              e.target.value,
                            )
                          }
                        >
                          <option value="" disabled hidden>
                            -- Select Answer --
                          </option>
                          <option value="Yes, they are.">Yes, they are.</option>
                          <option value="No, they aren't.">
                            No, they aren't.
                          </option>
                          <option value="Yes, it is.">Yes, it is.</option>
                          <option value="No, it isn't.">No, it isn't.</option>
                        </select>
                      </div>

                      {/* ❌ ICON */}
                      {results[`input${q.number}_2`] === false && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                          <span className="text-white text-sm font-bold">
                            ✕
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT MATCHING */}
            <div className="flex justify-center items-center">
              <img
                src={img}
                alt="exercise"
                className="w-full max-w-[400px] object-contain"
                style={{height:"100%"}}
              />
            </div>
          </div>

          <div className="mt-10">
            <Button
              handleShowAnswer={handleShowAnswer}
              handleStartAgain={resetExercise}
              checkAnswers={checkAnswers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
