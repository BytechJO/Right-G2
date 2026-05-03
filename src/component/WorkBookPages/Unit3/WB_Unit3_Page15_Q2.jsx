import React, { useState, useEffect } from "react";
import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import trueIcon from "../../../assets/imgs/true.svg";
const questions = [
  { id: "q1", text: "Can you climb a tree?" },
  { id: "q2", text: "Can you swim?" },
  { id: "q3", text: "Can you ride a bike?" },
  { id: "q4", text: "Can you play the drum?" },
];

const WB_Unit3_Page15_Q2 = () => {
  const [selections, setSelections] = useState({});

  const [writtenAnswers, setWrittenAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });

  const correctAnswers = {
    q1: true,
    q2: true,
    q3: true,
    q4: false,
  };

  useEffect(() => {
    const newWrittenAnswers = {};
    questions.forEach((q) => {
      const selection = selections[q.id];
      if (selection === true) {
        newWrittenAnswers[q.id] = `${q.text} Yes, I can.`;
      } else if (selection === false) {
        newWrittenAnswers[q.id] = `${q.text} No, I can't.`;
      } else {
        newWrittenAnswers[q.id] = "";
      }
    });
    setWrittenAnswers(newWrittenAnswers);
  }, [selections]);

  const handleSelect = (questionId, choice) => {
    setSelections((prev) => ({
      ...prev,
      [questionId]: choice,
    }));
  };

  const handleTextChange = (questionId, value) => {
    setWrittenAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const getCellClass = (questionId, choice) => {
    if (selections[questionId] === choice) {
      return "bg-blue-100 border-blue-400";
    }
    return "bg-white hover:bg-gray-50";
  };

  const handleStartAgain = () => {
    setSelections({});
    setWrittenAnswers({
      q1: "",
      q2: "",
      q3: "",
      q4: "",
    });
  };

  const checkAnswers = () => {
    let score = 0;

    questions.forEach((q) => {
      if (selections[q.id] === correctAnswers[q.id]) {
        score++;
      }
    });

    if (score === questions.length) {
      ValidationAlert.success(`Score: ${score} / ${questions.length}`);
    } else {
      ValidationAlert.error(`Score: ${score} / ${questions.length}`);
    }
    if (!score) {
      ValidationAlert.warning("No matches. Try again.");
    }
  };

  const handleShowAnswer = () => {
    const newSelections = {};
    const newWrittenAnswers = {};

    questions.forEach((q) => {
      const correct = correctAnswers[q.id];
      newSelections[q.id] = correct;

      if (correct) {
        newWrittenAnswers[q.id] = `${q.text} Yes, I can.`;
      } else {
        newWrittenAnswers[q.id] = `${q.text} No, I can't.`;
      }
    });

    setSelections(newSelections);
    setWrittenAnswers(newWrittenAnswers);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          {" "}
          <span className="WB-ex-A">B</span>Read and write{" "}
          <span style={{ color: "navy" }}>✓</span>. Write the question and
          answer.
        </h1>

        {/* جدول الاختيارات */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-r border-gray-300 w-1/2"></th>
                <th className="p-3 border-r border-gray-300 font-semibold text-gray-700">
                  Yes, I can.
                </th>
                <th className="p-3 font-semibold text-gray-700">
                  No, I can't.
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={q.id} className="border-t border-gray-300">
                  <td className="p-3 border-r border-gray-300 text-left text-gray-800">
                    <span className="font-bold mr-2">{index + 1}</span>
                    {q.text}
                  </td>
                  <td
                    onClick={() => handleSelect(q.id, true)}
                    className={`p-3 border-r border-gray-300 cursor-pointer transition-colors ${getCellClass(q.id, true)}`}
                  >
                    {selections[q.id] === true && (
                      <div className="flex justify-center items-center ">
                        <img src={trueIcon} style={{ height: "25px" }} />
                      </div>
                    )}
                  </td>
                  <td
                    onClick={() => handleSelect(q.id, false)}
                    className={`p-3 cursor-pointer transition-colors ${getCellClass(q.id, false)}`}
                  >
                    {selections[q.id] === false && (
                      <div className="flex justify-center items-center ">
                        {" "}
                        <img src={trueIcon} style={{ height: "25px" }} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* قسم الكتابة */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={`write-${q.id}`} className="flex items-center gap-3">
              <span className="font-bold text-gray-600">{index + 1}</span>
              <input
                type="text"
                value={writtenAnswers[q.id]}
                onChange={(e) => handleTextChange(q.id, e.target.value)}
                placeholder="Your answer will appear here..."
                className="w-full bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg text-gray-800 pb-1"
                readOnly
              />
            </div>
          ))}
        </div>
        <div className="action-buttons-container">
          <button onClick={handleStartAgain} className="try-again-button">
            Start Again ↻
          </button>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit3_Page15_Q2;
