import { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Asset 17.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Asset 18.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Asset 19.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Asset 20.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U5 Folder/Page29/Asset 21.svg";
import trueIcon from "../../../assets/imgs/true.svg";
const questions = [
  {
    id: 1,
    option1: "He likes fruit. He is happy.",
    option2: "He likes chicken. He is happy.",
    correct: "yes",
    img: img1,
  },
  {
    id: 2,
    option1: "He doesn’t like fish. He isn’t happy.",
    option2: "He doesn’t like rice. He isn’t happy.",
    correct: "no",
    img: img2,
  },
  {
    id: 3,
    option1: "She likes stew. She is happy.",
    option2: "She likes meat. She is happy.",
    correct: "yes",
    img: img3,
  },
  {
    id: 4,
    option1: "She doesn’t like chicken.",
    option2: "She doesn’t like meat.",
    correct: "yes",
    img: img4,
  },
  {
    id: 5,
    option1: "He likes fish.",
    option2: "He likes burgers.",
    correct: "no",
    img: img5,
  },
];

const WB_Unit5_Page29_Q2 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleChange = (id, value) => {
    if (showResults) return;
    setAnswers({ ...answers, [id]: value });
    setShowResults(false);
  };

  const checkAnswers = () => {
    if (showResults) return;
    const hasEmpty = questions.some((q) => !answers[q.id]);

    if (hasEmpty) {
      ValidationAlert.info("Please choose an answer for all questions first.");
      return;
    }

    let score = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        score++;
      }
    });

    setShowResults(true);

    if (score === questions.length) {
      ValidationAlert.success(`Score: ${score} / ${questions.length}`);
    } else if (score === 0) {
      ValidationAlert.error(`Score: ${score} / ${questions.length}`);
    } else {
      ValidationAlert.warning(`Score: ${score} / ${questions.length}`);
    }
  };
  const isWrong = (q) => {
    if (!showResults) return false;

    const selected = answers[q.id];
    if (!selected) return false;

    return selected !== q.correct;
  };
  const handleShowAnswer = () => {
    const correct = {};
    questions.forEach((q) => {
      correct[q.id] = q.correct;
    });
    setAnswers(correct);
    setShowResults(true);
  };

  const handleStartAgain = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="main-container-component">
      <div className="div-forall mb-10"  style={{gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          <div className="WB-ex-A">F</div>
          Look, read, and write <span style={{ color: "navy" }}>✓</span>.
        </h1>

        <div className="space-y-4 mb-5">
          {questions.map((q) => (
            <div key={q.id} className="flex flex-col">
              <div className="grid grid-cols-[1fr_1fr] items-center">
                <div className="flex gap-5">
                  <span className="text-2xl text-blue-900 font-semibold">
                    {q.id}
                  </span>
                  <img
                    src={q.img}
                    alt=""
                    className="object-contain"
                    style={{ height: "100px", width: "150px" }}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <label className="flex items-center gap-2 cursor-pointer text-lg">
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={answers[q.id] === "yes"}
                        onChange={() => handleChange(q.id, "yes")}
                        className="hidden"
                      />

                      <span
                        className={`w-10 h-10 border-2 border-gray-400 rounded-sm flex items-center justify-center text-2xl font-bold ${
                          answers[q.id] === "yes" ? "text-green-600" : ""
                        }`}
                      >
                        {answers[q.id] === "yes" ? (
                          <img src={trueIcon} style={{ height: "25px" }} />
                        ) : (
                          ""
                        )}
                      </span>

                      {q.option1}
                    </label>

                    {isWrong(q) && answers[q.id] === "yes" && (
                      <div className="absolute -top-2 right-63 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <label className="flex items-center gap-2 cursor-pointer text-lg">
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={answers[q.id] === "no"}
                        onChange={() => handleChange(q.id, "no")}
                        className="hidden"
                      />

                      <span
                        className={`w-10 h-10 border-2 border-gray-400 rounded-sm flex items-center justify-center text-2xl font-bold ${
                          answers[q.id] === "no" ? "text-green-600" : ""
                        }`}
                      >
                        {answers[q.id] === "no" ? (
                          <img src={trueIcon} style={{ height: "25px" }} />
                        ) : (
                          ""
                        )}
                      </span>

                      {q.option2}
                    </label>

                    {isWrong(q) && answers[q.id] === "no" && (
                      <div className="absolute -top-2 right-63 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                        ✕
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          checkAnswers={checkAnswers}
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
        />
      </div>
    </div>
  );
};

export default WB_Unit5_Page29_Q2;
