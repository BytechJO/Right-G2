import React, { useState, useRef, useEffect } from "react";
import "./Unit3_Page5_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import sound from "../../../assets/audio/ClassBook/U 3/Page 26 - A2/Audio.mp3";
import img1 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-1.svg";
import img2 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-2.svg";
import img3 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-3.svg";
import img4 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-4.svg";
import img5 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-5.svg";
import img6 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-6.svg";
import img7 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-7.svg";
import img8 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-8.svg";
import img9 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-9.svg";
import img10 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-10.svg";
import img11 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-11.svg";
import img12 from "../../../assets/imgs/Right 2 Unit 3 On a Picnic/Page 26/Ex A2-12.svg";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

/* ================= DATA ================= */
const captions = [
  {
    start: 0.14,
    end: 7.62,
    text: "Page 26. Exercise 2. Listen and tap or click the pictures that begin with the same sound.",
  },
  {
    start: 8.76,
    end: 13.82,
    text: "1. Jet, yo-yo, jam.",
  },
  {
    start: 15.4,
    end: 20.3,
    text: "2. Shirt, yellow, yell.",
  },
  {
    start: 21.98,
    end: 27.26,
    text: "3. Jam, jacket, yogurt.",
  },
  {
    start: 28.94,
    end: 33.86,
    text: "4. Juice, yawn, yellow.",
  },
];
// ⚠️ audio.start / audio.end = مقطع كل سؤال من نفس ملف الصوت (بالثواني)
// القيم تقديرية (التعليمات بتخلص عند الثانية 8): عدّليها بعد ما تسمعي الملف
const data = [
  {
    id: 1,
    images: [
      { id: 1, src: img1, value: "plane" },
      { id: 2, src: img2, value: "yo-yo" },
      { id: 3, src: img3, value: "juice" },
    ],
    correct: ["plane", "juice"], // نفس صوت /j/
    sound: "j",
    audio: { start: 9, end: 12 },
  },
  {
    id: 2,
    images: [
      { id: 1, src: img4, value: "rocket" },
      { id: 2, src: img5, value: "oil" },
      { id: 3, src: img6, value: "boy" },
    ],
    correct: ["oil", "boy"], // نفس صوت /oi/
    sound: "oi",
    audio: { start: 12.2, end: 15.2 },
  },
  {
    id: 3,
    images: [
      { id: 1, src: img7, value: "juice" },
      { id: 2, src: img8, value: "jacket" },
      { id: 3, src: img9, value: "yogurt" },
    ],
    correct: ["juice", "jacket"], // نفس صوت /j/
    sound: "j",
    audio: { start: 15.4, end: 18.4 },
  },
  {
    id: 4,
    images: [
      { id: 1, src: img10, value: "milk" },
      { id: 2, src: img11, value: "boy" },
      { id: 3, src: img12, value: "oil" },
    ],
    correct: ["boy", "oil"], // نفس صوت /oi/
    sound: "oi",
    audio: { start: 18.6, end: 21.6 },
  },
];

/* ================= HELPERS (خارج الكومبوننت) ================= */

// نتيجة السؤال: صح إذا اختار الصورتين الصح بس
const rowResult = (q, chosen = []) =>
  chosen.length === q.correct.length &&
  q.correct.every((c) => chosen.includes(c))
    ? "correct"
    : "wrong";

const feedbackText = (q, result) =>
  result === "correct"
    ? `Correct! These pictures begin with the sound /${q.sound}/.`
    : `Not quite. Look for the two pictures that begin with the sound /${q.sound}/.`;

const pauseOtherAudio = () => {
  document.querySelectorAll("audio").forEach((el) => el.pause());
};

export default function Unit3_Page5_Q2() {
  const [answers, setAnswers] = useState({});
  const [, setScore] = useState(null);
  const [locked, setLocked] = useState({}); // 🔒 { qId: [قيم الصور الصح المقفولة] }
  const [wrongPicks, setWrongPicks] = useState({}); // ✕ { qId: [قيم الصور الغلط] }
  const [ setRowResults] = useState({}); // { qId: "correct" | "wrong" }
  const [finished, setFinished] = useState(false); // كل شي صح بعد Check
  const [showAnswer, setShowAnswer] = useState(false);
  const [message, setMessage] = useState(""); // رسائل لقارئ الشاشة
  const [activeId, setActiveId] = useState(null); // آخر سؤال تعاملت معه
  const [ setPlayingId] = useState(null); // أي سؤال صوته شغّال

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const tokenRef = useRef(0); // بيلغي أي تشغيل معلّق

  const disabled = finished || showAnswer;

  // 🔒 الصورة الصح مقفولة، الغلط بيضل قابل للتعديل
  const isLocked = (qId, value) =>
    disabled || (locked[qId] || []).includes(value);

  /* ================= AUDIO ================= */


  const stopItemSound = () => {
    tokenRef.current += 1;
    clearInterval(timerRef.current);
    audioRef.current?.pause();
    setPlayingId(null);
  };

 

  // لو اشتغل أي صوت ثاني بالصفحة (مشغّل التعليمات) نوقف صوت الأسئلة
  // وعند الخروج من الصفحة نوقف كل شي
  useEffect(() => {
    const onOtherPlay = (e) => {
      if (e.target !== audioRef.current) {
        tokenRef.current += 1;
        clearInterval(timerRef.current);
        audioRef.current?.pause();
        setPlayingId(null);
      }
    };

    document.addEventListener("play", onOtherPlay, true);

    return () => {
      document.removeEventListener("play", onOtherPlay, true);
      tokenRef.current += 1;
      clearInterval(timerRef.current);
      audioRef.current?.pause();
    };
  }, []);



  /* ================= INTERACTIONS ================= */

  const handleSelect = (qId, value) => {
    setActiveId(qId);

    if (isLocked(qId, value)) {
      setMessage(
        showAnswer
          ? "Correct answers are shown. Press Start Again to try again."
          : finished
            ? "All answers are correct and locked."
            : `Question ${qId}: ${value} is correct and locked.`,
      );
      return;
    }

    const current = answers[qId] || [];

    if (!current.includes(value) && current.length >= 2) {
      setMessage(
        `Question ${qId}: you can choose only two pictures. Press a selected picture to remove it.`,
      );
    } else {
      setMessage(
        current.includes(value)
          ? `Question ${qId}: ${value} removed.`
          : `Question ${qId}: ${value} selected.`,
      );
    }

    setAnswers((prev) => {
      const current = prev[qId] || [];

      // 1️⃣ إذا كانت الصورة مختارة → نشيلها (Toggle)
      if (current.includes(value)) {
        return { ...prev, [qId]: current.filter((v) => v !== value) };
      }

      // 2️⃣ إذا حاول يختار أكثر من 2 → نمنعه
      if (current.length >= 2) {
        return prev;
      }

      // 3️⃣ إضافة اختيار جديد
      return { ...prev, [qId]: [...current, value] };
    });

    // تعديل إجابة غلط: بيشيل علامة الغلط وفيدباك السؤال القديم
    setWrongPicks((prev) => ({
      ...prev,
      [qId]: (prev[qId] || []).filter((v) => v !== value),
    }));
    setRowResults((prev) => ({ ...prev, [qId]: null }));
  };

  /* ================= CHECK ================= */

  const handleCheck = () => {
    // بعد Show Answer أو بعد ما كل شي صح: ما في شي نعمله
    if (disabled) return;

    // فحص إذا الطالب مختار على الأقل إجابة من السؤال الأول
    if (!answers[data[0].id] || answers[data[0].id].length === 0) {
      const msg = "Please select at least one picture in question 1.";
      ValidationAlert.info(msg);
      setMessage(msg);
      return;
    }

    // فحص إذا الطالب مختار على الأقل إجابة من السؤال الثاني
    if (!answers[data[1].id] || answers[data[1].id].length === 0) {
      const msg = "Please select at least one picture in question 2.";
      ValidationAlert.info(msg);
      setMessage(msg);
      return;
    }

    stopItemSound();

    let correctCount = 0;

    // نحسب total = مجموع كل الإجابات الصحيحة
    const total = data.reduce((sum, q) => sum + q.correct.length, 0);

    // حساب عدد الصح
    data.forEach((q) => {
      const studentAnswers = answers[q.id] || [];

      q.correct.forEach((correctValue) => {
        if (studentAnswers.includes(correctValue)) {
          correctCount++;
        }
      });
    });

    // 🔒 الصح بينقفل، والغلط بينعلّم ✕ وبيضل قابل للتعديل
    const newLocked = {};
    const newWrong = {};
    const newRows = {};

    data.forEach((q) => {
      const chosen = answers[q.id] || [];
      newLocked[q.id] = chosen.filter((v) => q.correct.includes(v));
      newWrong[q.id] = chosen.filter((v) => !q.correct.includes(v));
      newRows[q.id] = rowResult(q, chosen);
    });

    setLocked(newLocked);
    setWrongPicks(newWrong);
    setRowResults(newRows);

    if (
      correctCount === total &&
      data.every((q) => newRows[q.id] === "correct")
    ) {
      setFinished(true);
    }

    // 🔊 فيدباك مسموع لقارئ الشاشة (لكل سؤال + السكور)
    const details = data
      .map((q) => `Question ${q.id}: ${feedbackText(q, newRows[q.id])}`)
      .join(" ");

    const allCorrect = data.every((q) => newRows[q.id] === "correct");

    setMessage(
      `Score ${correctCount} out of ${total}. ${details}${
        allCorrect
          ? ""
          : " Correct pictures are locked. Change the pictures marked with a cross, then press Check Answer again."
      }`,
    );

    // اختيار اللون حسب النتيجة
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; text-align:center; margin-top: 8px;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${total}
      </span>
    </div>
  `;

    // إظهار نوع النتيجة
    if (correctCount === total) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* ================= SHOW ANSWER ================= */

  const handleShowAnswer = () => {
    stopItemSound();

    const correctAnswersObj = {};

    data.forEach((q) => {
      correctAnswersObj[q.id] = [...q.correct]; // نضع كل الإجابات الصحيحة
    });

    setAnswers(correctAnswersObj);
    setLocked({});
    setWrongPicks({});
    setRowResults({});
    setFinished(false);
    setShowAnswer(true);
    setMessage("Correct answers are shown.");
  };

  /* ================= START AGAIN ================= */

  const handleReset = () => {
    stopItemSound();
    pauseOtherAudio();

    setAnswers({});
    setLocked({});
    setWrongPicks({});
    setRowResults({});
    setFinished(false);
    setScore(null);
    setShowAnswer(false); // 🔥 إلغاء وضع Show Answer
    setActiveId(null);
    setMessage("Exercise reset. All answers, feedback and score are cleared.");
  };

  /* ================= RENDER ================= */

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
          gap: "30px",
        }}
      >
        <div className="circle-wrapper-Unit5_Page5_Q2">
          <ExerciseHeader
            // sectionLetter="A"
            questionNumber="2"
            title="Which pictures begin with the same sound? Circle."
            subTitle="Replay the audio, say the word quietly, then tap the sound or letter that matches."
          />

          <p id="u3p5q2-help" className="sr-only">
            Press Tab to move between the sound buttons and the pictures. When a
            sound button is focused, its audio plays. Press Enter or Space on it
            to hear it again. Press Enter or Space on a picture to choose it or
            remove it. Choose two pictures in each question.
          </p>

          <QuestionAudioPlayer
            src={sound}
            stopAtSecond={8}
            captions={captions}
            pageId={"sb-unit3-page5-q2"}
          />

          <div
            className="CB-unit3-p5-q2-content-container"
            role="group"
            aria-label="Questions"
            aria-describedby="u3p5q2-help"
          >
            {data.map((q) => {
              const chosen = answers[q.id] || [];
              // const result = rowResults[q.id];
              const isActive = activeId === q.id;
   
           

              return (
                <div
                  key={q.id}
                  role="group"
                  aria-label={`Question ${q.id}`}
                  className={`question-row-CB-unit3-p5-q2 ${
                    isActive ? "is-active" : ""
                  }`}
                >
                  <span
                    className="q-number"
                    aria-hidden="true"
                    style={{
                      color: "#2c5287",
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {q.id}.
                  </span>

                
                  <div className="images-row-CB-unit3-p5-q2">
                    {q.images.map((img) => {
                      const isSelected = chosen.includes(img.value);
                      const imgLocked = isLocked(q.id, img.value);
                      const isCorrectPick =
                        !showAnswer &&
                        isSelected &&
                        (locked[q.id] || []).includes(img.value);
                      const isWrong =
                        !showAnswer &&
                        isSelected &&
                        (wrongPicks[q.id] || []).includes(img.value);

                      return (
                        <div key={img.id} className="CB-unit3-p5-q2-img-wrap">
                          <button
                            type="button"
                            className={`img-box-CB-unit3-p5-q2 
              ${isSelected ? "selected-CB-unit3-p5-q2" : ""} 
              ${isCorrectPick ? "correct-CB-unit3-p5-q2" : ""} 
              ${isWrong ? "wrong" : ""}`}
                            aria-pressed={isSelected}
                            aria-disabled={imgLocked}
                            aria-label={`Picture ${img.id}: ${img.value}${
                              isCorrectPick
                                ? ", correct and locked"
                                : isWrong
                                  ? ", incorrect, you can change it"
                                  : ""
                            }`}
                            onClick={() => handleSelect(q.id, img.value)}
                            onFocus={() => setActiveId(q.id)}
                          >
                            <img
                              src={img.src}
                              alt=""
                              aria-hidden="true"
                              draggable="false"
                              style={{ height: "100px", width: "100px" }}
                            />
                          </button>

                       
                          {/* علامة X تظهر فقط عند الغلط */}
                          {isWrong && (
                            <div
                              className="wrong-mark-CB-unit3-p5-q2"
                              aria-hidden="true"
                            >
                              ✕
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button
          type="button"
          className="try-again-button"
          onClick={handleReset}
        >
          Start Again ↻
        </button>
        {/* ⭐⭐⭐ NEW — زر Show Answer */}
        <button
          type="button"
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>
        <button
          type="button"
          onClick={handleCheck}
          className="check-button2"
          aria-disabled={disabled}
          style={disabled ? { cursor: "not-allowed" } : undefined}
        >
          Check Answer ✓
        </button>
      </div>
    </div>
  );
}
