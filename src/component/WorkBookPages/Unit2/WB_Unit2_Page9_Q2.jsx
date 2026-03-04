import React, { useState, useRef } from "react";
import img from "../../../assets/imgs/test6.png";
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../button";

const leftParts = [
    { id: 1, text: "rabbit" },
    { id: 2, text: "flower" },
    { id: 3, text: "duck" },
    { id: 4, text: "horse" },
    { id: 5, text: "tree" },
    { id: 6, text: "cloud" },
];

const images = [
    { id: "img1", src: img },
    { id: "img2", src: img },
    { id: "img3", src: img },
    { id: "img4", src: img },
    { id: "img5", src: img },
    { id: "img6", src: img },
];

const rightParts = [
    { id: "r1", src: img },
    { id: "r2", src: img },
    { id: "r3", src: img },
    { id: "r4", src: img },
    { id: "r5", src: img },
    { id: "r6", src: img },
];

const correctMatches = [
    { leftId: 1, centerId: "img4", rightId: "r1" },
    { leftId: 2, centerId: "img2", rightId: "r3" },
    { leftId: 3, centerId: "img1", rightId: "r2" },
    { leftId: 4, centerId: "img3", rightId: "r4" },
    { leftId: 5, centerId: "img6", rightId: "r6" },
    { leftId: 6, centerId: "img5", rightId: "r5" },
];

const WB_Unit2_Page9_Q2 = () => {
    const containerRef = useRef(null);

    const [lines, setLines] = useState([]);
    const [firstPoint, setFirstPoint] = useState(null);
    const [wrongLeft, setWrongLeft] = useState([]);
    const [locked, setLocked] = useState(false);
    const [checked, setChecked] = useState(false);

    const getDotCenter = (parent, selector) => {
        const rect = containerRef.current.getBoundingClientRect();
        const dot = parent.querySelector(selector);
        if (!dot) return null;

        const r = dot.getBoundingClientRect();
        return {
            x: r.left - rect.left + r.width / 2,
            y: r.top - rect.top + r.height / 2,
        };
    };

    const handleStart = (e) => {
        if (locked) return;

        const data = e.currentTarget.dataset;
        const pos = getDotCenter(e.currentTarget, ".dot");
        if (!pos) return;

        let type = "";
        let id = "";

        if (data.image) {
            type = data.image.startsWith("img") ? "leftImg" : "rightImg";
            id = data.image;
        } else if (data.leftId) {
            type = "centerText";
            id = Number(data.leftId);
        }

        setFirstPoint({ id, type, x: pos.x, y: pos.y });
    };

    const handleEnd = (e) => {
        if (!firstPoint || locked) return;

        const data = e.currentTarget.dataset;
        const pos = getDotCenter(e.currentTarget, ".dot");
        if (!pos) return;

        let type = "";
        let id = "";

        if (data.image) {
            type = data.image.startsWith("img") ? "leftImg" : "rightImg";
            id = data.image;
        } else if (data.leftId) {
            type = "centerText";
            id = Number(data.leftId);
        }

        // منع التوصيل بنفس النوع
        if (firstPoint.type === type) {
            setFirstPoint({ id, type, x: pos.x, y: pos.y });
            return;
        }

        // منع التوصيل المباشر بين الصور (يجب المرور بالنص في الوسط)
        if (firstPoint.type.includes("Img") && type.includes("Img")) {
            return;
        }

        // تحديد الـ leftId والـ imageId للتخزين في المصفوفة
        let leftIdValue, imageIdValue;
        if (firstPoint.type === "centerText") {
            leftIdValue = firstPoint.id;
            imageIdValue = id;
        } else {
            leftIdValue = id;
            imageIdValue = firstPoint.id;
        }

        const newLine = {
            x1: firstPoint.x,
            y1: firstPoint.y,
            x2: pos.x,
            y2: pos.y,
            leftId: leftIdValue,
            image: imageIdValue,
        };

        setLines((prev) => [...prev, newLine]);

        // التعديل الجوهري: إذا انتهت التوصيلة عند النص الأوسط، اجعل النص هو البداية التلقائية للتوصيلة التالية
        if (type === "centerText") {
            setFirstPoint({ id, type, x: pos.x, y: pos.y });
        } else {
            // إذا انتهت التوصيلة عند صورة (يسار أو يمين)، صفر النقطة الأولى
            setFirstPoint(null);
        }
    };

    const handleTryAgain = () => {
        setLines([]);
        setWrongLeft([]);
        setLocked(false);
        setChecked(false);
        setFirstPoint(null);
    };

    const handleShowAnswer = () => {
        const finalLines = [];
        const container = containerRef.current;

        correctMatches.forEach((c) => {
            const leftImgEl = container.querySelector(`[data-image="${c.centerId}"]`);
            const centerTextEl = container.querySelector(`[data-left-id="${c.leftId}"]`);
            const rightImgEl = container.querySelector(`[data-image="${c.rightId}"]`);

            if (!leftImgEl || !centerTextEl || !rightImgEl) return;

            const leftDot = getDotCenter(leftImgEl, ".dot");
            const centerDot = getDotCenter(centerTextEl, ".dot");
            const rightDot = getDotCenter(rightImgEl, ".dot");

            if (leftDot && centerDot) {
                finalLines.push({ x1: leftDot.x, y1: leftDot.y, x2: centerDot.x, y2: centerDot.y, leftId: c.leftId, image: c.centerId });
            }
            if (centerDot && rightDot) {
                finalLines.push({ x1: centerDot.x, y1: centerDot.y, x2: rightDot.x, y2: rightDot.y, leftId: c.leftId, image: c.rightId });
            }
        });

        setLines(finalLines);
        setLocked(true);
        setChecked(true);
    };

    const checkAnswers = () => {
        if (lines.length === 0) {
            ValidationAlert.warning("Please connect the items first.");
            return;
        }

        const wrong = [];
        let correctCount = 0;

        const grouped = {};
        lines.forEach((line) => {
            if (!grouped[line.leftId]) grouped[line.leftId] = [];
            grouped[line.leftId].push(line.image);
        });

        correctMatches.forEach((match) => {
            const userConnections = grouped[match.leftId] || [];
            if (userConnections.includes(match.centerId) && userConnections.includes(match.rightId)) {
                correctCount++;
            } else {
                wrong.push(match.leftId);
            }
        });

        setWrongLeft(wrong);
        setChecked(true);
        setLocked(true);

        if (wrong.length === 0) {
            ValidationAlert.success(`Score: ${correctCount} / ${correctMatches.length}`);
        } else {
            ValidationAlert.error(`Score: ${correctCount} / ${correctMatches.length}`);
        }
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-12 mt-10 ml-70">
                <div className="ex-A">B</div>
                <h1 className="header-title-page8">Look, read, and match.</h1>
            </div>
            <div className="flex flex-col items-center p-8">
                <div className="flex justify-center items-center w-full relative gap-65" ref={containerRef}>
                    
                    {/* Left Column (Images) */}
                    <div className="flex flex-col gap-4">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className={`relative cursor-pointer ${locked ? "opacity-50" : ""} ${firstPoint?.id === img.id ? "ring-2 ring-blue-400 rounded" : ""}`}
                                data-image={img.id}
                                onClick={(e) => (firstPoint ? handleEnd(e) : handleStart(e))}
                            >
                                <div className="dot w-3 h-3 bg-red-500 rounded-full absolute top-1 right-1" />
                                <img src={img.src} alt="" className="max-w-50 max-h-24 object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* Center Column (Texts) */}
                    <div className="flex flex-col gap-20">
                        {leftParts.map((l, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-5 p-2 cursor-pointer border rounded ${locked ? "opacity-50" : ""} ${firstPoint?.id === l.id && firstPoint?.type === "centerText" ? "bg-blue-100 border-blue-400" : "border-transparent"}`}
                                data-left-id={l.id}
                                onClick={(e) => (firstPoint ? handleEnd(e) : handleStart(e))}
                            >
                                <div className="dot w-3 h-3 bg-red-500 rounded-full" />
                                <span>{l.text}</span>
                                {wrongLeft.includes(l.id) && checked && <span className="text-red-500 ml-2 font-bold">✕</span>}
                            </div>
                        ))}
                    </div>

                    {/* Right Column (Images) */}
                    <div className="flex flex-col gap-4">
                        {rightParts.map((r) => (
                            <div
                                key={r.id}
                                className={`relative cursor-pointer ${locked ? "opacity-50" : ""} ${firstPoint?.id === r.id ? "ring-2 ring-blue-400 rounded" : ""}`}
                                data-image={r.id}
                                onClick={(e) => (firstPoint ? handleEnd(e) : handleStart(e))}
                            >
                                <div className="dot w-3 h-3 bg-red-500 rounded-full absolute top-1 left-1" />
                                <img src={r.src} alt="" className="max-w-35 max-h-24 object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* SVG Layer for Lines */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                        {lines.map((l, i) => (
                            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="blue" strokeWidth="3" strokeLinecap="round" />
                        ))}
                        {/* رسم خط مؤقت من النقطة المختارة إلى مكان الماوس يمكن إضافته لاحقاً، لكن هنا سنكتفي بتوضيح النقطة النشطة */}
                    </svg>
                </div>

                <div className="mt-16">
                    <Button handleShowAnswer={handleShowAnswer} handleStartAgain={handleTryAgain} checkAnswers={checkAnswers} />
                </div>
            </div>
        </>
    );
};

export default WB_Unit2_Page9_Q2;