import { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 4.svg";
import img5 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 5.svg";
import img6 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page24/Ex G 6.svg";
import trueIcon from "../../../assets/imgs/true.svg"
const questions = [
  {
    id: 1,
    question: "Do you want a chocolate bar?",
    correct: "yes",
  },
  {
    id: 2,
    question: "Do you want a yo-yo?",
    correct: "yes",
  },
  {
    id: 3,
    question: "Do you want a ball?",
    correct: "no",
  },
];

const WB_Unit4_Page24_Q1 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const pairedImages = [
    [img1, img4],
    [img2, img5],
    [img3, img6],
  ];
  const handleChange = (id, value) => {
    if (showResults) return;
    setAnswers({ ...answers, [id]: value });
    setShowResults(false);
  };
  const isWrong = (q) => {
    if (!showResults) return false;
    if (!answers[q.id]) return false;

    return answers[q.id] !== q.correct;
  };
 const checkAnswers = () => {
  if (showResults) return;

  // ✅ تحقق إنو كل الأسئلة متجاوبة
  const allAnswered = questions.every((q) => answers[q.id]);

  if (!allAnswered) {
    ValidationAlert.info("Please answer all questions first.");
    return;
  }

  // ✅ إذا كله معبّي → كمل
  let score = 0;

  questions.forEach((q) => {
    if (answers[q.id] === q.correct) {
      score++;
    }
  });

  setShowResults(true);

  if (score === questions.length) {
    ValidationAlert.success(`Score: ${score} / ${questions.length}`);
  } else if (score > 0) {
    ValidationAlert.warning(`Score: ${score} / ${questions.length}`);
  } else {
    ValidationAlert.error(`Score: ${score} / ${questions.length}`);
  }
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

  const getColor = (q) => {
    if (!showResults) return "";
    return answers[q.id] === q.correct ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="main-container-component">
      <div className="div-forall"  style={{gap:"35px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">G</span>Look, read, and write{" "}
          <span style={{ color: "navy" }}>✓</span>.
        </h1>

        <div className="space-y-1">
          {questions.map((q) => (
            <div
              key={q.id}
              className="flex flex-col"
            >
              <p className={`mr-50 text-[20px] font-medium`}>
                {q.id}. {q.question}
              </p>

              <div className="grid grid-cols-2 items-center gap-45">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {pairedImages[q.id - 1].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="pair"
                      style={{
                        width: i === 1 ? "120px" : "100px",
                        height: i === 1 ? "120px" : "80px",
                        objectFit: "contain",
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-5">
                  <div className="relative">
                    <label className="flex items-center gap-2 cursor-pointer text-xl">
                      
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={answers[q.id] === "yes"}
                        onChange={() => handleChange(q.id, "yes")}
                        className="hidden"
                      />
                      <span
                        className={`relative w-10 h-10 border-2 border-gray-400 rounded-sm flex items-center justify-center text-2xl font-bold text-blue-800 ${
                          answers[q.id] === "yes"
                            ? "text-red"
                            : "text-transparent"
                        }
                         ${isWrong(q) && answers[q.id] === "yes" && "border-red-500 "}`}
                      >
                        { answers[q.id] === "yes" &&<img src={trueIcon} style={{height:"25px"}}/> }
                        {isWrong(q) && answers[q.id] === "yes" && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                          ✕
                        </div>
                      )}
                      </span>
                      Yes, I do.
                    </label>
                  </div>
                  <div className="relative">
                    <label className="flex items-center gap-2 cursor-pointer text-xl" >
                      
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={answers[q.id] === "no"}
                        onChange={() => handleChange(q.id, "no")}
                        className="hidden"
                      />
                      <span
                        className={`relative w-10 h-10 border-2 border-gray-400 rounded-sm flex items-center justify-center text-2xl font-bold text-blue-800 ${
                          answers[q.id] === "no"
                            ? "text-red"
                            : "text-transparent"
                        }
                      ${isWrong(q) && answers[q.id] === "no" && "border-red-500 "}`}
                      >
                        { answers[q.id] === "no" &&<img src={trueIcon} style={{height:"25px"}}/> }
                        {isWrong(q) && answers[q.id] === "no" && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                          ✕
                        </div>
                      )}
                      </span>
                      No, I don’t.
                    </label>
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

export default WB_Unit4_Page24_Q1;
