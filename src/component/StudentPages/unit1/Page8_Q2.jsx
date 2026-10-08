import React, { useState } from "react";
import "./Page8_Q2.css";
import sound1 from "../../../assets/audio/ClassBook/U 1/page8-q1.mp3";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
import ValidationAlert from "../../Popup/ValidationAlert";

// Example images imports. Replace with your actual paths.
import img1a from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-1.svg";
import img1b from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-2.svg";
import img1c from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-3.svg";

import img2a from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-2-1.svg";
import img2b from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-2-2.svg";
import img2c from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-2-3.svg";

import img3a from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-3-1.svg";
import img3b from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-3-2.svg";
import img3c from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-3-3.svg";

import img4a from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-4-1.svg";
import img4b from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-4-2.svg";
import img4c from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 8/Page8-Ex A 2-4-3.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

const Page8_Q2 = () => {
  // ✏️ alts: وصف كل صورة (من الـ captions). عدّلها حسب الصور الفعلية
  const groups = [
    {
      images: [img1a, img1b, img1c],
      alts: ["Someone running", "A rabbit", "A lemon"],
      different: 2,
    },
    {
      images: [img2a, img2b, img2c],
      alts: ["A leg", "A railroad track", "Something red"],
      different: 0,
    },
    {
      images: [img3a, img3b, img3c],
      alts: ["Someone laughing", "Rain", "A lock"],
      different: 1,
    },
    {
      images: [img4a, img4b, img4c],
      alts: ["A lion", "A lamp", "A ring"],
      different: 2,
    },
  ];

  const total = groups.length;
  const falses = () => Array(total).fill(false);

  const [selected, setSelected] = useState(Array(total).fill(null));

  // 🔒 المجموعات الصح بعد Check بتنقفل
  const [lockedGroups, setLockedGroups] = useState(falses());
  // ✕ المجموعات الغلط (بتضل قابلة للتعديل)
  const [wrongGroups, setWrongGroups] = useState(falses());
  // 🔒 بعد Show Answer كل شي مقفول
  const [showAnswer, setShowAnswer] = useState(false);

  // 📢 رسالة لقارئ الشاشة
  const [message, setMessage] = useState("");

  // 🔊 لإيقاف صوت QuestionAudioPlayer عند Start Again / Show Answer
  const [forceStopAudio, setForceStopAudio] = useState(0);

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0.579,
      end: 3.379,
      text: "Page 8. Right Activities.",
    },
    {
      start: 4.519,
      end: 6.859,
      text: "Exercise A, number 2.",
    },
    {
      start: 7.919,
      end: 12.439,
      text: "Listen and write X on the picture with a different sound.",
    },
    {
      start: 13.5,
      end: 19.739,
      text: "1:run, rabbit, lemon.",
    },

    {
      start: 19.739,
      end: 26.26,
      text: "2:leg,railroad track, red",
    },

    {
      start: 26.26,
      end: 32.34,
      text: "3:laugh, rain, lock.",
    },

    {
      start: 32.34,
      end: 37.84,
      text: "4: lion, lamp,ring",
    },
  ];

  // ================================
  // اختيار صورة (كليك / Enter / Space)
  // ================================
  const handleSelect = (groupIndex, imageIndex) => {
    if (showAnswer || lockedGroups[groupIndex]) return;

    const updated = [...selected];
    updated[groupIndex] = imageIndex;
    setSelected(updated);

    // نشيل ✕ فقط عن المجموعة الي تغيّرت
    setWrongGroups((prev) => prev.map((w, i) => (i === groupIndex ? false : w)));

    setMessage(
      `Group ${groupIndex + 1}: picture ${imageIndex + 1} marked as different.`,
    );
  };

  const handleKeyDown = (e, groupIndex, imageIndex) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // يمنع سكرول الصفحة عند Space
      handleSelect(groupIndex, imageIndex);
    }
  };

  // ================================
  // Show Answer
  // ================================
  const showAnswers = () => {
    setSelected(groups.map((g) => g.different));
    setLockedGroups(Array(total).fill(true));
    setWrongGroups(falses());
    setShowAnswer(true);
    setForceStopAudio((prev) => prev + 1);
    setMessage("Correct answers are shown.");
  };

  // ================================
  // Check Answer
  // ================================
  const checkAnswers = () => {
    if (showAnswer) return;

    if (selected.some((val) => val === null)) {
      ValidationAlert.info("Please choose one picture in every group!");
      return;
    }

    let score = 0;
    const newLocked = [...lockedGroups];
    const newWrong = falses();
    const wrongItems = [];

    groups.forEach((group, index) => {
      if (selected[index] === group.different) {
        score++;
        newLocked[index] = true; // 🔒 الصح بينقفل
      } else {
        newWrong[index] = true; // ✕ وبيضل قابل للتعديل
        wrongItems.push(index + 1);
      }
    });

    setLockedGroups(newLocked);
    setWrongGroups(newWrong);

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${score} / ${total}
      </span>
    </div>
  `;

    setMessage(
      score === total
        ? `Score ${score} out of ${total}. All answers are correct.`
        : `Score ${score} out of ${total}. Correct answers are locked. Groups to fix: ${wrongItems.join(", ")}.`,
    );

    if (score === total) {
      ValidationAlert.success(scoreMessage);
    } else if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ================================
  // Start Again
  // ================================
  const reset = () => {
    setSelected(Array(total).fill(null));
    setLockedGroups(falses());
    setWrongGroups(falses());
    setShowAnswer(false);
    setForceStopAudio((prev) => prev + 1);
    setMessage("Exercise reset. All answers are cleared.");
  };

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
      {/* 📢 رسائل لقارئ الشاشة */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>

      <div
        className="div-forall"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          justifyContent: "flex-start",
        }}
      >
        <ExerciseHeader
          // sectionLetter="A"
          questionNumber="2"
          title="Listen and write ✗ on the picture with a different sound."
          subTitle="Listen to every option once, then tap the picture whose sound is different."
        />
        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          pageId="unit1-page8-q2"
          stopAtSecond={12.43}
          forceStop={forceStopAudio}
        />

        <div className="exercise-row-CB-unit1-p8-q2">
          {groups.map((group, gIndex) => {
            const groupLocked = showAnswer || lockedGroups[gIndex];

            return (
              <div
                className="group-box-CB-unit1-p8-q2 "
                key={gIndex}
                role="group"
                aria-label={`Group ${gIndex + 1}. Choose the picture with a different sound.`}
              >
                <span
                  aria-hidden="true"
                  style={{ color: "darkblue", fontWeight: "700" }}
                >
                  {gIndex + 1}
                </span>
                {group.images.map((img, iIndex) => {
                  const isSelected = selected[gIndex] === iIndex;
                  const alt = group.alts?.[iIndex] || `Picture ${iIndex + 1}`;

                  return (
                    <div
                      className={`image-wrapper-CB-unit1-p8-q2 ${
                        groupLocked ? "locked" : ""
                      }`}
                      key={iIndex}
                      role="button"
                      tabIndex={groupLocked ? -1 : 0}
                      aria-pressed={isSelected}
                      aria-disabled={groupLocked}
                      aria-label={`Group ${gIndex + 1}, picture ${
                        iIndex + 1
                      }: ${alt}.${isSelected ? " Marked as different." : ""}${
                        groupLocked && isSelected
                          ? " Correct. Locked."
                          : !groupLocked && wrongGroups[gIndex] && isSelected
                            ? " Incorrect. Try again."
                            : ""
                      }`}
                      onClick={() => handleSelect(gIndex, iIndex)}
                      onKeyDown={(e) => handleKeyDown(e, gIndex, iIndex)}
                    >
                      <img src={img} alt={alt} className="image-CB-unit1-p8-q2 " />

                      {/* ✕ على الصورة المختارة */}
                      {isSelected && (
                        <div className="ds-x" aria-hidden="true">
                          ✕
                        </div>
                      )}
                      {/* ❌ دائرة حمراء للخطأ بعد Check (بتنشال لما يعدّل) */}
                      {wrongGroups[gIndex] && isSelected && (
                        <span
                          className="wrong-x-CB-unit1-p8-q2"
                          aria-hidden="true"
                        >
                          ✕
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="action-buttons-container">
        <button type="button" onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button
          type="button"
          onClick={showAnswers}
          className="show-answer-btn"
        >
          Show Answer
        </button>
        <button
          type="button"
          onClick={checkAnswers}
          className="check-button2"
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Page8_Q2;