import { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U4 Folder/Page25/Ex J 4.svg";

const WB_Unit4_Page25_Q2 = () => {
  const initialSelections = {
    1: { relation: null },
    2: { relation: null },
    3: { relation: null },
    4: { relation: null },
  };

  const [userSelections, setUserSelections] = useState(initialSelections);
  const [showResults, setShowResults] = useState(false);

  // 1. تم إصلاح هيكل البيانات ليكون متسقاً
  const data = [
    {
      id: 1,
      img: img1,
      per: "He's",
      relations: ["grows food", "fixes cars"],
      correctRelation: "grows food",
    },
    {
      id: 2,
      img: img2,
      per: "They're",
      relations: ["teachers.", "policemen"],
      correctRelation: "policemen",
    },
    {
      id: 3,
      img: img3,
      per: "He's",
      relations: ["grows food", "fixes cars"],
      correctRelation: "fixes cars",
    },
    {
      id: 4,
      img: img4,
      per: "She's",
      relations: ["vet", "photographer."],
      correctRelation: "photographer.",
    },
  ];

  const handleSelect = (id, field, option) => {
    if (showResults) return; // لا تسمح بالتغيير بعد عرض النتائج
    setUserSelections({
      ...userSelections,
      [id]: { ...userSelections[id], [field]: option },
    });
  };

  const handleShowAnswer = () => {
    const correctSelections = {};
    data.forEach((item) => {
      correctSelections[item.id] = {
        relation: item.correctRelation,
      };
    });
    setUserSelections(correctSelections);
    setShowResults(true); // تفعيل عرض النتائج
  };

  const handleStartAgain = () => {
    setUserSelections(initialSelections);
    setShowResults(false);
  };

  const checkAnswers = () => {
        if (showResults) return; // لا تسمح بالتغيير بعد عرض النتائج

    // ✅ أولاً: تأكد أن كل الخيارات مختارة
    const hasEmptySelection = data.some(
      (item) => !userSelections[item.id]?.relation,
    );

    if (hasEmptySelection) {
      ValidationAlert.info("Please choose an answer for all questions first.");
      return;
    }

    // ✅ إذا كله مختار، كمل التصحيح
    setShowResults(true);

    let score = 0;
    data.forEach((item) => {
      if (userSelections[item.id].relation === item.correctRelation) {
        score += 1;
      }
    });

    if (score === data.length) {
      ValidationAlert.success(`Score: ${score} / ${data.length}`);
    } else if (score === 0) {
      ValidationAlert.error(`Score: ${score} / ${data.length}`);
    } else {
      ValidationAlert.warning(`Score: ${score} / ${data.length}`);
    }
  };
  const isWrong = (item) => {
    if (!showResults) return false;

    const selected = userSelections[item.id]?.relation;
    if (!selected) return false;

    return selected !== item.correctRelation;
  };
  // 2. دالة مساعدة لتحديد لون الزر
  const getButtonClass = (item, r) => {
    const isSelected = userSelections[item.id].relation === r;

    if (isSelected) {
      return "border-blue-900"; // اختيار المستخدم الحالي
    }

    return "border-gray-300 bg-white hover:border-blue-900"; // الحالة الافتراضية
  };

  return (
    <div className="main-container-component">
      <div className="div-forall" style={{gap:"90px"}}>
        <h1 className="WB-header-title-page8">
          <span className="WB-ex-A">J</span>Look, read, and circle.
        </h1>

        <div className="grid grid-cols-2 gap-x-20 gap-y-10">
          {data.map((item) => (
            <div key={item.id} className="flex items-center gap-6">
              <div className="flex items-start gap-4 max-w-full">
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt=""
                  className="object-contain rounded-xl "
                   style={{height:"120px",width:"120px"}}
                />
              </div>

              <div className="flex items-center gap-4 text-lg text-gray-800">
                <span >{item.per}</span>

                <div className="flex flex-col gap-4">
                  {item.relations.map((r) => (
                    <div key={r} className="relative">
                      <button
                        onClick={() => handleSelect(item.id, "relation", r)}
                        className={`w-40 px-4 py-1 rounded-full border-2 font-medium transition-all ${getButtonClass(item, r)} ${isWrong(item) &&
                        userSelections[item.id]?.relation === r && "border-red-500 bg-white"}`}
                      >
                        {r}
                      </button>

                      {isWrong(item) &&
                        userSelections[item.id]?.relation === r && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow border-2 border-white">
                            ✕
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
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

export default WB_Unit4_Page25_Q2;
