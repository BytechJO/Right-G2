import ExerciseHeader from "../../ExerciseHeader";
import {playGlobalAudio,stopGlobalAudio} from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - J/Item_001_I'm_Stella's_uncle.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - J/Item_002_I'm_Stella's_brother.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - J/Item_003_I'm_Stella's_aunt.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - J/Item_004_I'm_Stella's_sister.mp3";
import React, { useState, useEffect, useRef } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex J 4.svg";
import trueIcon from "../../../assets/imgs/true.svg"
import falseIcon from "../../../assets/imgs/false.svg"
import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
const IMAGE_DESCRIPTIONS={[img1]:"A boy in a purple top.",[img2]:"A man in a blue vest.",[img3]:"A woman wearing glasses and an orange top.",[img4]:"A child with dark hair tied up and a blue top."};



const focusClass = "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Local audio indicator keeps changes scoped to this exercise.
const SpeakerBadge = () => <span aria-hidden="true" style={{position:"absolute",top:-10,right:-10,width:22,height:22,borderRadius:"50%",background:"white",color:"black",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:3,boxShadow:"0 1px 3px rgba(0,0,0,.25)"}}><FaVolumeUp size={12}/></span>;
const activate = (e) => { if(e.key!=="Enter" && e.key!==" ") return; e.preventDefault(); e.stopPropagation(); if(!e.repeat) e.currentTarget.click(); };
const release = (e) => { if(e.key==="Enter" || e.key===" "){e.preventDefault();e.stopPropagation();} };
function useExerciseAudio() {
  const rootRef = useRef(null),
    ownerRef = useRef(Symbol("workbook-exercise")),
    tokenRef = useRef(0);
  const [playingKey, setPlayingKey] = useState(null);
  const stopAudio = () => {
    tokenRef.current++;
    stopGlobalAudio(ownerRef.current);
    setPlayingKey(null);
  };
  const playSound = (key, src) => {
    if (!src) return;
    stopAudio();
    rootRef.current?.querySelectorAll("audio").forEach(audio => audio.pause());
    const token = tokenRef.current;
    setPlayingKey(key);
    try {
      playGlobalAudio(src, {
        owner: ownerRef.current,
        onFinish: () => {
          if (tokenRef.current === token) setPlayingKey(null);
        }
      });
    } catch {
      stopAudio();
    }
  };
  useEffect(() => {
    const tokenState = tokenRef,
      owner = ownerRef.current;
    const onPlay = e => {
      if (e.target?.tagName !== "AUDIO") return;
      tokenRef.current++;
      stopGlobalAudio(ownerRef.current);
      setPlayingKey(null);
    };
    document.addEventListener("play", onPlay, true);
    return () => {
      document.removeEventListener("play", onPlay, true);
      tokenState.current++;
      stopGlobalAudio(owner);
    };
  }, []);
  return {
    rootRef,
    playingKey,
    playSound,
    stopAudio
  };
}
// eslint-disable-next-line react-refresh/only-export-components -- Local audio control preserves this exercise layout.
const AudioText=({children,audioKey,src,playSound,playingKey,className="",style={}})=><span role="button" tabIndex={0} aria-label={String(children)+". Hear it."} className={className+" "+focusClass} onClick={()=>playSound(audioKey,src)} onKeyDown={activate} onKeyUp={release} style={{borderRadius:"8px",...style,position:"relative",cursor:"pointer",...(playingKey===audioKey?{boxShadow:"0 0 0 3px #2563eb",backgroundColor:"#dbeafe"}:{})}}>{children}{playingKey===audioKey&&<SpeakerBadge/>}</span>;

const WB_Unit1_Page6_Q3 = () => {
  const [userAnswers, setUserAnswers] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [results, setResults] = useState({});
  const [message,setMessage]=useState("");
  const {rootRef,playingKey,playSound,stopAudio}=useExerciseAudio();

  const [showAnswers, setShowAnswers] = useState(false);


  const data = [
    { id: 1, img: img1, text: "I'm Stella's uncle.", correct: "X" },
    { id: 2, img: img2, text: "I'm Stella's brother.", correct: "X" },
    { id: 3, img: img3, text: "I'm Stella's aunt.", correct: "✓" },
    { id: 4, img: img4, text: "I'm Stella's sister.", correct: "✓" },
  ];

  const handleSelect = (id, value) => {
    if (!showAnswers && results[id] !== "correct") {
      setResults(prev=>({...prev,[id]:null}));
      setMessage(`Question ${id}: ${value} selected.`);
      setUserAnswers({ ...userAnswers, [id]: value });
    }
  };

  const isWrongSelection = (item, value) => {
    return results[item.id] === "wrong" && userAnswers[item.id] === value && value !== item.correct;
  };

  const checkAnswers = () => {
  if (showAnswers) return;
    stopAudio();

  // ⭐ تحقق إذا في إجابة فاضية
  const hasEmpty = data.some((item) => !userAnswers[item.id]);

  if (hasEmpty) {
    ValidationAlert.info(
      "Oops!",
      "Please answer all questions first."
    );
      setMessage("Please answer all questions first.");
    return;
  }

  let currentScore = 0;
  const totalQuestions = data.length;

  data.forEach((item) => {
    const userAnswer = userAnswers[item.id]?.trim().toLowerCase();
    const correctAnswer = item.correct.toLowerCase();

    if (userAnswer && userAnswer === correctAnswer) {
      currentScore += 1;
    }
  });

  setResults(Object.fromEntries(data.map(item=>[item.id,userAnswers[item.id]===item.correct?"correct":"wrong"])));
    setMessage(`Score ${currentScore} out of ${totalQuestions}. Correct answers are locked; wrong answers can be changed.`);


  if (currentScore === totalQuestions) {
    ValidationAlert.success(`Score: ${currentScore} / ${totalQuestions}`);
  } else if (currentScore > 0) {
    ValidationAlert.warning(`Score: ${currentScore} / ${totalQuestions}`);
  } else {
    ValidationAlert.error(`Score: ${currentScore} / ${totalQuestions}`);
  }
};

  const handleShowAnswer = () => {
    const answers = {};
    data.forEach((item) => {
      answers[item.id] = item.correct;
    });
    setUserAnswers(answers);
    stopAudio();
    setResults(Object.fromEntries(data.map(item=>[item.id,"correct"])));
    setMessage("Correct answers shown and locked.");
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserAnswers({ 1: null, 2: null, 3: null, 4: null });
    stopAudio();
    setResults({});
    setMessage("Exercise reset. All answers and results cleared.");
    setShowAnswers(false);
  };

  return (
    <div ref={rootRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{message}</div>
      <div
        className="div-forall"
       style={{gap:"45px"}}
      >
        <ExerciseHeader
            isWorkbook
            sectionLetter="J"
            title={<>Look, read, and write{" "}
          <span style={{ color: "navy" }}>✓</span> or{" "}
          <span style={{ color: "navy" }}>✗</span>.
        </>}
          />

        <div className="grid grid-cols-2 gap-x-20 gap-y-25">
          {data.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <div className="relative rounded-2xl p-2 w-full h-full flex items-start justify-center gap-2">
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt={IMAGE_DESCRIPTIONS[item.img]||""}
                  className="max-w-full max-h-full object-contain"
                  style={{ height: "120px", width: "auto" }}
                />

                <div className="absolute -bottom-11 flex gap-5 p-1 bg-white/80 rounded-tl-xl">
                  <div className="relative">
                    <button
                      type="button" aria-label={`Question ${item.id}: Tick${results[item.id]==="correct"?", correct and locked":""}`} aria-pressed={userAnswers[item.id] === "✓"} aria-disabled={showAnswers||results[item.id]==="correct"}
                      onKeyDown={activate} onKeyUp={release}
                      style={userAnswers[item.id]==="✓"?{backgroundColor:"#dbeafe",...(results[item.id]?{borderColor:results[item.id]==="correct"?"#16a34a":"#ef4444",boxShadow:results[item.id]==="correct"?"inset 0 -2px #16a34a":undefined}:{})}:undefined}
                      onClick={() => handleSelect(item.id, "✓")}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all text-lg ${focusClass} ${
                        userAnswers[item.id] === "✓"
                          ? "text-black border-3 border-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      } ${results[item.id] === "correct" && item.correct === "✓" ? "bg-gray-300 text-black" : ""}`}
                    >
                                           <img src={trueIcon} alt="" aria-hidden="true" style={{height:"25px"}} />

                    </button>

                    {isWrongSelection(item, "✓") && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          backgroundColor: "red",
                          color: "white",
                          border: "2px solid white",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold",
                          lineHeight: 1,
                          zIndex: 10,
                        }}
                      >
                        ✕
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button" aria-label={`Question ${item.id}: Cross${results[item.id]==="correct"?", correct and locked":""}`} aria-pressed={userAnswers[item.id] === "X"} aria-disabled={showAnswers||results[item.id]==="correct"}
                      onKeyDown={activate} onKeyUp={release}
                      style={userAnswers[item.id]==="X"?{backgroundColor:"#dbeafe",...(results[item.id]?{borderColor:results[item.id]==="correct"?"#16a34a":"#ef4444",boxShadow:results[item.id]==="correct"?"inset 0 -2px #16a34a":undefined}:{})}:undefined}
                      onClick={() => handleSelect(item.id, "X")}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all text-lg ${focusClass} ${
                        userAnswers[item.id] === "X"
                          ? "text-black border-3 border-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      } ${results[item.id] === "correct" && item.correct === "X" ? "bg-gray-300 text-black" : ""}`}
                    >
                      <img src={falseIcon} alt="" aria-hidden="true" style={{height:"25px"}} />
                    </button>

                    {isWrongSelection(item, "X") && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          backgroundColor: "red",
                          color: "white",
                          border: "2px solid white",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "bold",
                          lineHeight: 1,
                          zIndex: 10,
                        }}
                      >
                        ✕
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <AudioText audioKey={`text-${item.id}`} src={[clip0,clip1,clip2,clip3][item.id-1]} playSound={playSound} playingKey={playingKey} className="text-lg text-gray-800 font-medium w-full text-nowrap">
                {item.text}
              </AudioText>
            </div>
          ))}
        </div>

        <Button
          handleShowAnswer={handleShowAnswer}
          handleStartAgain={handleStartAgain}
          checkAnswers={checkAnswers}
        />
      </div>
    </div>
  );
};

export default WB_Unit1_Page6_Q3;