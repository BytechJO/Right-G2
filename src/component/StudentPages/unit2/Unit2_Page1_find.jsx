import React, { useState, useEffect, useRef } from "react";
import backgroundImage from "../../../assets/imgs/Right 2 Unit 2  A Day at the Park/Page.png"; //======= should change ==========
import SquirrelGif from "../../../assets/Squirrel_1164_1433px.gif";
import ValidationAlert from "../../Popup/ValidationAlert";
import MySVG from "../../../assets/imgs/Interactive Svg un 2.svg";

const TARGET_NAME = "kite";

const targetArea = {
  left: 51,
  top: 13.5,
  width: 12,
  height: 14.5,
};

// كل الصور المطلوبة للنشاط (لازم كلها تحمّل قبل ما يشتغل)
const SCENE_IMAGES = [backgroundImage, MySVG, SquirrelGif];
const LOAD_TIMEOUT_MS = 15000;

// نغمات الفيدباك
const TONES = {
  select: [{ freq: 560 }],
  success: [
    { freq: 523, start: 0 },
    { freq: 659, start: 0.12 },
    { freq: 784, start: 0.24, duration: 0.25 },
  ],
  fail: [
    { freq: 220, start: 0, duration: 0.25, type: "triangle" },
    { freq: 165, start: 0.15, duration: 0.3, type: "triangle" },
  ],
};

const loadImage = (src, attempt) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = () => reject(new Error(`Failed: ${src}`));

    // عند Retry نضيف بارامتر عشان المتصفح ما يرجّع النتيجة الفاشلة
    // (ما بنضيفو لـ data: URI لأنو بيخرّبها)
    const url =
      attempt > 0 && !src.startsWith("data:") ? `${src}?retry=${attempt}` : src;

    image.src = url;
  });

const Unit2_Page1_find = () => {
  const [loadStatus, setLoadStatus] = useState("loading"); // loading | ready | error
  const [loadAttempt, setLoadAttempt] = useState(0);

  const [clickedPoint, setClickedPoint] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const audioCtxRef = useRef(null);

  /* =====================================================
     PRELOAD — لازم كل الصور تحمّل قبل ما يبدأ النشاط
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    setLoadStatus("loading");
    setAnnouncement("Loading the scene. Please wait.");

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), LOAD_TIMEOUT_MS),
    );

    Promise.race([
      Promise.all(SCENE_IMAGES.map((src) => loadImage(src, loadAttempt))),
      timeout,
    ])
      .then(() => {
        if (cancelled) return;
        setLoadStatus("ready");
        setAnnouncement(`Scene loaded. Find the ${TARGET_NAME} in the picture.`);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadStatus("error");
        setAnnouncement(
          "The scene could not be loaded. Press the Retry button to try again.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  const handleRetryLoad = () => setLoadAttempt((n) => n + 1);

  /* =====================================================
     AUDIO — AudioContext واحد مشترك
  ===================================================== */

  useEffect(
    () => () => {
      audioCtxRef.current?.close();
    },
    [],
  );

  const playTone = (notes) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxRef.current) audioCtxRef.current = new AudioContextClass();

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    notes.forEach(({ freq, start = 0, duration = 0.14, type = "sine" }) => {
      const t0 = ctx.currentTime + start;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.12, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(t0);
      oscillator.stop(t0 + duration);
    });
  };

  /* =====================================================
     SELECTION
  ===================================================== */

  const selectPoint = (point, message) => {
    setClickedPoint(point);
    setCheckResult(null);
    setAnnouncement(message);
    playTone(TONES.select);
  };

  // كليك بمكان ثاني بالصورة (إجابة غلط)
  const handleImageClick = (e) => {
    if (showAnswer) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    selectPoint(
      {
        x,
        y,
        inside:
          x >= targetArea.left &&
          x <= targetArea.left + targetArea.width &&
          y >= targetArea.top &&
          y <= targetArea.top + targetArea.height,
      },
      "A point in the scene was selected. Use Check Answer to check it.",
    );
  };

  // الهدف الكبير: كليك / لمس / Enter / Space (الزر بيعمل click بكل الحالات)
  const handleTargetSelection = () => {
    if (showAnswer) return;

    selectPoint(
      { x: 0, y: 0, inside: true },
      `${TARGET_NAME} selected. Use Check Answer to check your answer.`,
    );
  };

  /* =====================================================
     CHECK / SHOW / RESET — دايماً شغّالين بعد التحميل
  ===================================================== */

  const handleCheck = () => {
    if (showAnswer) {
      const msg = "The answer is already shown. Press Start Again to try.";
      setAnnouncement(msg);
      ValidationAlert.info("Pay Attention!", msg);
      return;
    }

    if (!clickedPoint) {
      const msg = `Please select the ${TARGET_NAME} before checking.`;
      setAnnouncement(msg);
      ValidationAlert.info("Pay Attention!", msg);
      return;
    }

    if (clickedPoint.inside) {
      setCheckResult("success");
      setAnnouncement(`Correct. You found the ${TARGET_NAME}.`);
      playTone(TONES.success);
      ValidationAlert.success("Bravo!", `You found the ${TARGET_NAME}! 🏆`);
    } else {
      setCheckResult("fail");
      setAnnouncement(`That is not the ${TARGET_NAME}. Try again.`);
      playTone(TONES.fail);
      ValidationAlert.error(
        "Oops!",
        `This is not the ${TARGET_NAME}. Try again!`,
      );
    }
  };

  const handleStartAgain = () => {
    setClickedPoint(null);
    setCheckResult(null);
    setShowAnswer(false);
    setAnnouncement(`Activity reset. Find the ${TARGET_NAME} in the scene.`);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setClickedPoint(null);
    setCheckResult(null);
    setAnnouncement(`The correct ${TARGET_NAME} is highlighted.`);
  };

  /* =====================================================
     DERIVED STATE
  ===================================================== */

  
const targetSelected = clickedPoint?.inside === true;
const missedPoint = clickedPoint && !clickedPoint.inside ? clickedPoint : null;
const isCorrect = checkResult === "success" || showAnswer;
const showTargetHighlight = isCorrect;
const showBorder = targetSelected || showAnswer;
  /* =====================================================
     RENDER
  ===================================================== */

  const liveRegion = (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  );

  // ⏳ Loading
  if (loadStatus === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        {liveRegion}
        <p className="sub-header" aria-hidden="true">
          Loading…
        </p>
      </div>
    );
  }

  // ⚠️ Error + Retry
  if (loadStatus === "error") {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p role="alert" className="sub-header">
          Sorry, the picture could not be loaded. Please check your connection
          and try again.
        </p>
        <button
          type="button"
          className="try-again-button"
          onClick={handleRetryLoad}
        >
          Retry ↻
        </button>
      </div>
    );
  }

  // ✅ Ready
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          id="page4-instructions"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "10px",
            width: "100%",
          }}
        >
          <img
            src={SquirrelGif}
            alt="An animated squirrel asking for help"
            style={{
              height: "100px",
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <h5 className="header-title-page8" style={{ margin: 0 }}>
              I need your help. Can you help me find a {TARGET_NAME} in the
              picture?
            </h5>

            <p className="sub-header">
              Scan the scene carefully, then tap, click, or press Enter or Space
              on the {TARGET_NAME}.
            </p>
          </div>
        </div>

        {liveRegion}

        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={backgroundImage}
            alt="A park scene with children and families playing." // ⚠️ عدّليه حسب الصورة الفعلية
            onClick={handleImageClick}
            draggable="false"
            style={{
              width: "auto",
              height: "70vh",
              cursor: showAnswer ? "default" : "crosshair",
              borderRadius: "8px",
              display: "block",
            }}
          />

          {/* 🎯 الهدف الكبير الوحيد */}
          <button
            type="button"
            className="focus-visible:outline-4 focus-visible:outline-blue-600 focus-visible:outline-offset-4"
            aria-label={`Select the ${TARGET_NAME}${
              targetSelected ? ", selected" : ""
            }`}
            aria-describedby="page4-instructions"
            aria-pressed={targetSelected}
            disabled={showAnswer}
            onClick={handleTargetSelection}
            style={{
  position: "absolute",
  left: `${targetArea.left}%`,
  top: `${targetArea.top}%`,
  width: `${targetArea.width}%`,
  height: `${targetArea.height}%`,
  minWidth: "48px",
  minHeight: "48px",
  zIndex: 2,
  padding: 0,
  // الحجم ثابت: البوردر دايماً موجود بس شفاف إذا ما في سليكت
  border: showBorder
    ? `4px dashed ${isCorrect ? "#16a34a" : "#2c5287"}`
    : "4px dashed transparent",
  borderRadius: "12px",
  background: isCorrect
    ? "rgba(34, 197, 94, 0.25)"
    : targetSelected
      ? "rgba(44, 82, 135, 0.15)"
      : "transparent",
  cursor: showAnswer ? "default" : "pointer",
  touchAction: "manipulation",
}}
>
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      left: "50%",
      bottom: "-14px",
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      padding: "2px 10px",
      borderRadius: "999px",
      fontSize: "14px",
      fontWeight: "bold",
      color: "#fff",
      background: isCorrect ? "#16a34a" : "#2c5287",
    }}
  >
    {isCorrect ? `✓ ${TARGET_NAME}` : ""}
  </span>
</button>

          {/* نقطة حمرا للضغط الغلط */}
          {missedPoint && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: `${missedPoint.y}%`,
                left: `${missedPoint.x}%`,
                width: "3%",
                aspectRatio: "1",
                backgroundColor: "red",
                border: "3px solid white",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 4,
              }}
            />
          )}

          {showTargetHighlight && (
            <img
              src={MySVG}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                top: `${targetArea.top}%`,
                left: `${targetArea.left}%`,
                width: `${targetArea.width}%`,
                height: `${targetArea.height}%`,
                pointerEvents: "none",
                zIndex: 3,
              }}
            />
          )}
        </div>
      </div>

      <div className="action-buttons-container">
        <button
          type="button"
          className="try-again-button"
          onClick={handleStartAgain}
        >
          Start Again ↻
        </button>
        <button
          type="button"
          className="show-answer-btn"
          onClick={handleShowAnswer}
        >
          Show Answer
        </button>
        <button type="button" className="check-button2" onClick={handleCheck}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page1_find;