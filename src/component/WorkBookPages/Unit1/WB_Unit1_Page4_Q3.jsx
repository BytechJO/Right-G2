import { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 3.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";

const WB_Unit1_Page4_Q3 = () => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState({}); // { leftId: rightId }
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const containerRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});
  const [lines, setLines] = useState([]);
  const [checked, setChecked] = useState(false);

  const data = {
    left: [
      { id: 1, text: "I'm Stella's ...", img: img1 },
      { id: 2, text: "I'm Stella's ...", img: img2 },
      { id: 3, text: "I'm Stella's ...", img: img3 },
    ],
    right: [
      { id: 1, text: "cousin." },
      { id: 2, text: "aunt." },
      { id: 3, text: "uncle." },
    ],
  };

  const correctMatches = { 1: 3, 2: 1, 3: 2 };

  /**
   * معالج النقر على عنصر من الجهة اليسرى
   * يحدد العنصر المختار أو يلغي التحديد إذا تم النقر عليه مرة أخرى
   */
  const handleLeftClick = (id) => {
    if (selectedLeft === id) {
      // إذا تم النقر على نفس العنصر، ألغِ التحديد
      setSelectedLeft(null);
    } else {
      // اختر عنصراً جديداً
      setSelectedLeft(id);
    }
  };

  /**
   * معالج النقر على عنصر من الجهة اليمنى
   * يقوم بتوصيل العنصر المختار من اليسار بالعنصر المختار من اليمين
   * إذا كان العنصر من اليمين موصولاً بعنصر آخر من اليسار، يتم قطع الاتصال السابق
   */
  const handleRightClick = (rightId) => {
    if (selectedLeft) {
      // البحث عن أي عنصر من اليسار موصول بهذا العنصر من اليمين
      const existingLeftId = Object.keys(matches).find(
        (key) => matches[key] === rightId,
      );

      // إنشء نسخة جديدة من الـ matches
      const newMatches = { ...matches };

      // إذا كان هناك اتصال سابق، قم بحذفه
      if (existingLeftId) {
        delete newMatches[existingLeftId];
      }

      // أضف الاتصال الجديد
      newMatches[selectedLeft] = rightId;
      setMatches(newMatches);

      // ألغِ التحديد من اليسار
      setSelectedLeft(null);
    }
  };

  /**
   * التحقق من الإجابات
   */
  const checkAnswers = () => {
    if (showAnswers || checked) return;

    // ⭐ تحقق إذا مش كل العناصر موصّلة
    const totalQuestions = Object.keys(correctMatches).length;

    if (Object.keys(matches).length !== totalQuestions) {
      ValidationAlert.info("Oops!", "Please match all sentences first.");
      return;
    }

    let currentScore = 0;

    Object.keys(correctMatches).forEach((leftId) => {
      const userMatch = matches[leftId];
      const correctMatch = correctMatches[leftId];

      if (userMatch && userMatch === correctMatch) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setChecked(true);

    if (currentScore === totalQuestions) {
      ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
    } else if (currentScore > 0) {
      ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
    } else {
      ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
    }
  };

  /**
   * عرض الإجابات الصحيحة
   */
  const handleShowAnswer = () => {
    setMatches(correctMatches);
    setShowAnswers(true);
  };

  /**
   * إعادة تعيين المكون للبدء من جديد
   */
  const handleStartAgain = () => {
    setMatches({});
    setShowResults(false);
    setShowAnswers(false);
    setSelectedLeft(null);
    setChecked(false);
  };

  /**
   * رسم الخطوط بين العناصر الموصولة
   */
  useEffect(() => {
    const newLines = [];

    Object.keys(matches).forEach((leftId) => {
      const rightId = matches[leftId];

      const leftEl = leftRefs.current[leftId];
      const rightEl = rightRefs.current[rightId];

      if (leftEl && rightEl && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const leftRect = leftEl.getBoundingClientRect();
        const rightRect = rightEl.getBoundingClientRect();

        newLines.push({
          x1: leftRect.right - containerRect.left,
          y1: leftRect.top + leftRect.height / 2 - containerRect.top,
          x2: rightRect.left - containerRect.left,
          y2: rightRect.top + rightRect.height / 2 - containerRect.top,
        });
      }
    });

    setLines(newLines);
  }, [matches]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div className="div-forall" style={{gap:"100px"}}>
        <h1 className="WB-header-title-page8">
          {" "}
          <div className="WB-ex-A">E</div> Look, read, and match.
        </h1>

        <div
          ref={containerRef}
          className="flex justify-between gap-20 relative"
        >
          {/* Left Side */}
          <div className="space-y-12">
            {data.left.map((item) => {
              const isWrong =
                checked &&
                matches[item.id] &&
                matches[item.id] !== correctMatches[item.id];
              const isConnected = matches[item.id] !== undefined;

              return (
                <div key={item.id} className="flex items-center gap-6 relative">
                  {isWrong && (
                    <div className="wb-wrong-icon-unit1-page4-q3">✕</div>
                  )}

                  <span className="font-bold text-blue-900 text-xl">
                    {item.id}
                  </span>
                  <img
                    src={item.img}
                    alt=""
                    className="max-w-16 max-h-16 rounded-full object-cover"
                  />

                  {/* جعل النص قابلاً للنقر بدون خلفية */}
                  <span
                    onClick={() => handleLeftClick(item.id)}
                    className={`text-xl cursor-pointer transition-all duration-200 ${
                      selectedLeft === item.id
                        ? "text-red-600 font-bold underline decoration-red-600 decoration-2 underline-offset-2"
                        : isConnected
                          ? "text-black-600 font-semibold"
                          : "text-gray-700 hover:text-red-500 hover:underline hover:decoration-red-500 hover:decoration-2 hover:underline-offset-2"
                    }`}
                  >
                    {item.text}
                  </span>

                  {/* نقطة الاتصال من اليسار */}
                  <div
                    ref={(el) => (leftRefs.current[item.id] = el)}
                    onClick={() => handleLeftClick(item.id)}
                    className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
                      selectedLeft === item.id
                        ? "bg-red-500 scale-125 shadow-lg"
                        : isConnected
                          ? "bg-red-500"
                          : "bg-[#eb533c]"
                    }`}
                    title="انقر للاختيار"
                  />
                </div>
              );
            })}
          </div>

          {/* Right Side */}
          <div
            className="space-y-18 flex flex-col items-center"
            style={{ justifyContent: "space-evenly" }}
          >
            {data.right.map((item) => {
              const isConnected = Object.values(matches).includes(item.id);

              return (
                <div key={item.id} className="flex items-center justify-end">
                  {/* نقطة الاتصال من اليمين */}
                  <div
                    ref={(el) => (rightRefs.current[item.id] = el)}
                    onClick={() => handleRightClick(item.id)}
                    className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
                      isConnected ? "bg-red-500" : "bg-[#eb533c]"
                    }`}
                    title="انقر للتوصيل"
                  />

                  {/* جعل النص قابلاً للنقر بدون خلفية */}
                  <span
                    onClick={() => handleRightClick(item.id)}
                    className={`text-xl cursor-pointer transition-all duration-200 w-24 text-right ${
                      isConnected
                        ? "text-black-600 font-semibold"
                        : "text-gray-700 hover:text-red-500 hover:underline hover:decoration-red-500 hover:decoration-2 hover:underline-offset-2"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* رسم الخطوط بين العناصر الموصولة */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {lines.map((line, index) => (
              <line
                key={index}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="red"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      </div>
      <Button
        handleShowAnswer={handleShowAnswer}
        handleStartAgain={handleStartAgain}
        checkAnswers={checkAnswers}
      />
    </div>
  );
};

export default WB_Unit1_Page4_Q3;
