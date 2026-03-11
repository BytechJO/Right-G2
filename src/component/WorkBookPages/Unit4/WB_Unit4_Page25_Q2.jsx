import { useState } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

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
            img: img,
            per: "He's",
            relations: ["grows food", "fixes cars"],
            correctRelation: "grows food"
        },
        {
            id: 2,
            img: img,
            per: "They're",
            relations: ["teachers.", "policemen"],
            correctRelation: "policemen"
        },
        {
            id: 3,
            img: img,
            per: "He's",
            relations: ["grows food", "fixes cars"],
            correctRelation: "fixes cars"
        },
        {
            id: 4,
            img: img,
            per: "She's",
            relations: ["vet", "photographer."],
            correctRelation: "photographer."
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
        setShowResults(true); // تفعيل عرض النتائج
        let score = 0;
        data.forEach((item) => {
            if (userSelections[item.id].relation === item.correctRelation) {
                score += 1;
            }
        });

        if (score === data.length) {
            ValidationAlert.success(`Score: ${score} / ${data.length}`);
        } else if (score >= 1) {
            ValidationAlert.error(`Score: ${score} / ${data.length}`);
        } else {
            ValidationAlert.warning("No correct matches. Try again.");
        }
    };

    // 2. دالة مساعدة لتحديد لون الزر
    const getButtonClass = (item, r) => {
        const isSelected = userSelections[item.id].relation === r;
        const isCorrect = r === item.correctRelation;

        if (showResults) {
            if (isCorrect) return 'border-green-500 bg-green-100 text-green-800';
            if (isSelected && !isCorrect) return 'border-red-500 bg-red-100 text-red-800';
            return 'border-gray-300 bg-white'; // الخيارات الأخرى غير المحددة
        }

        if (isSelected) {
            return 'border-blue-500 bg-blue-100 text-blue-800'; // اختيار المستخدم الحالي
        }

        return 'border-gray-300 bg-white hover:bg-gray-50'; // الحالة الافتراضية
    };

    return (
        <div className="p-8 bg-white rounded-3xl max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
                <div className="ex-A">J</div>
                <h1 className="header-title-page8">Look, read, and circle.</h1>
            </div>

            <div className="grid grid-cols-2 gap-x-20 gap-y-16">
                {data.map((item) => (
                    <div key={item.id} className="flex flex-col items-center gap-6">
                        <div className="flex items-start gap-4 max-w-full">
                            <span className="font-bold text-blue-900 text-2xl">{item.id}</span>
                            <img src={item.img} alt="" className="max-w-24 max-h-24 object-contain rounded-xl grayscale" />
                        </div>

                        <div className="flex flex-col items-center gap-4 text-xl text-gray-800">
                            <span className="font-bold">{item.per}</span>

                            <div className="flex gap-4">
                                {item.relations.map((r) => (
                                    // 3. تم إصلاح بناء الجملة واستدعاء الدالة المساعدة
                                    <button
                                        key={r}
                                        onClick={() => handleSelect(item.id, "relation", r)}
                                        className={`px-4 py-1 rounded-full border-2 font-medium transition-all ${getButtonClass(item, r)}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 flex justify-center">
                <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleStartAgain} checkAnswers={checkAnswers} />
            </div>
        </div>
    );
};

export default WB_Unit4_Page25_Q2;
