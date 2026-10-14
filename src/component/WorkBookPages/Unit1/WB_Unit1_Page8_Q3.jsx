import ExerciseHeader from "../../ExerciseHeader";
import {playGlobalAudio,stopGlobalAudio} from "../../audioManager";
import {FaVolumeUp} from "react-icons/fa";
import sentenceClip0 from "../../../assets/audio/WorkBook/Unit 1/Page 8 - C/Item_001_Look_there's_a_abbit_on_the_oad.mp3";
import sentenceClip1 from "../../../assets/audio/WorkBook/Unit 1/Page 8 - C/Item_002_Larry_has_long_egs.mp3";
import sentenceClip2 from "../../../assets/audio/WorkBook/Unit 1/Page 8 - C/Item_003_There_is_a_amp_on_the_table.mp3";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex C 2.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex C 1.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 8/Ex C 3.svg";
import sound from "../../../assets/audio/WorkBook/cd1pg8instruction-adult-lady_6uG66wZc.mp3";

import Button from "../Button";
import ValidationAlert from "../../Popup/ValidationAlert";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
const IMAGE_DESCRIPTIONS={[img1]:"A brown long-eared animal on a grey road.",[img2]:"A man wearing glasses, a brown top, and green trousers.",[img3]:"A silver table light on a wooden table."};


const focusClass = "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Local audio indicator keeps changes scoped to this exercise.
const SpeakerBadge = () => <span aria-hidden="true" style={{position:"absolute",top:0,right:0,width:22,height:22,borderRadius:"50%",background:"white",color:"black",display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:3,boxShadow:"0 1px 3px rgba(0,0,0,.25)"}}><FaVolumeUp size={12}/></span>;
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


// ⭐ Select بدل DropBox
// eslint-disable-next-line react-refresh/only-export-components -- This select belongs to this exercise only.
const SelectBox = ({ id, value, isWrong, onChange, showAnswer, isCorrect }) => {
  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <select
        value={value || ""}
        onChange={(e) => onChange(id, e.target.value)}
        disabled={showAnswer}
        aria-label={`${{sentence1a:"Question 1, first missing letter",sentence1b:"Question 1, second missing letter",sentence2:"Question 2, missing letter",sentence3:"Question 3, missing letter"}[id]}${isCorrect?", correct and locked":""}`}
        data-letter-field={id}
        onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.stopPropagation();if(e.repeat)e.preventDefault();}}}
        onKeyUp={e=>{if(e.key==="Enter"||e.key===" ")e.stopPropagation();}}
        className="WB-unit1-p8-q3-input focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!"
        style={{
          borderRadius:"6px",
          ...(isCorrect?{borderColor:"#16a34a",boxShadow:"inset 0 -2px #16a34a"}:isWrong?{borderColor:"#ef4444"}:{}),
          fontSize: "20px",
          fontWeight: "600",
          padding: "5px",
          margin: "0 5px",
        }}
      >
        <option value="">__</option>
        <option value="r">r</option>
        <option value="l">l</option>
      </select>

      {isWrong && <div className="wrong-icon-unit1-page8-q3">✕</div>}
    </div>
  );
};

const WB_Unit1_Page8_Q3 = () => {
  const itemAudio=useExerciseAudio();
  const rootRef=itemAudio.rootRef;
  const [correctFields,setCorrectFields]=useState([]);
  const [message,setMessage]=useState("");
  const [forceStopAudio,setForceStopAudio]=useState(false);
  const stopAudio=(rewind=false)=>{itemAudio.stopAudio();rootRef.current?.querySelectorAll("audio").forEach(audio=>{audio.pause();if(rewind)audio.currentTime=0;});setForceStopAudio(true);};

  const [wrongAnswers, setWrongAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);

  const [answers, setAnswers] = useState({
    sentence1a: "",
    sentence1b: "",
    sentence2: "",
    sentence3: "",
  });

  const correctAnswers = {
    sentence1a: "r",
    sentence1b: "r",
    sentence2: "l",
    sentence3: "l",
  };

  const captions = [
    {
      start: 0.479,
      end: 7.259,
      text: "Page 8. Phonics exercise C. Listen, write, and read the sentences.",
    },
    {
      start: 8.42,
      end: 12.0,
      text: "1, look, there's a rabbit on the road.",
    },
    {
      start: 12.94,
      end: 16.0,
      text: "2, Larry has long legs.",
    },
    {
      start: 16.74,
      end: 19.68,
      text: "3, there is a lamp on the table.",
    },
  ];

  // ⭐ تغيير القيمة
  const handleChange = (field, value) => {
    if (showAnswer||correctFields.includes(field)) return;
    stopAudio();
    setMessage(`Letter ${value} selected.`);
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));

    setWrongAnswers((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleShowAnswer = () => {
    stopAudio();
    setCorrectFields(Object.keys(correctAnswers));
    setWrongAnswers({});
    setMessage("Correct answers shown and locked.");
    setShowAnswer(true);
    setAnswers(correctAnswers);
  };

  const handleStartAgain = () => {
    stopAudio(true);setCorrectFields([]);setMessage("Exercise reset.");
    setAnswers({
      sentence1a: "",
      sentence1b: "",
      sentence2: "",
      sentence3: "",
    });
    setWrongAnswers({});
    setShowAnswer(false);

  };

  const checkAnswers = () => {
    if (showAnswer) return;
    stopAudio();
    const allFilled = Object.values(answers).every((a) => a !== "");

    if (!allFilled) {
      ValidationAlert.info("Please fill in all answers!");
      setMessage("Please fill in all answers!");
      return;
    }

    let correct = 0;
    const total = 4;

    const newWrongAnswers = {
      sentence1a: answers.sentence1a !== correctAnswers.sentence1a,
      sentence1b: answers.sentence1b !== correctAnswers.sentence1b,
      sentence2: answers.sentence2 !== correctAnswers.sentence2,
      sentence3: answers.sentence3 !== correctAnswers.sentence3,
    };

    if (!newWrongAnswers.sentence1a) correct++;
    if (!newWrongAnswers.sentence1b) correct++;
    if (!newWrongAnswers.sentence2) correct++;
    if (!newWrongAnswers.sentence3) correct++;

    setWrongAnswers(newWrongAnswers);
    setCorrectFields(Object.keys(newWrongAnswers).filter(key=>!newWrongAnswers[key]));
    setMessage(`Score ${correct} out of ${total}. Correct answers are locked.`);

    if (correct === total) {
      ValidationAlert.success(`Score: ${correct}/${total}`);
    } else if (correct > 0) {
      ValidationAlert.warning(`Score: ${correct}/${total}`);
    } else {
      ValidationAlert.error(`Score: ${correct}/${total}`);
    }
  };

  return (
    <div ref={rootRef} className="main-container-component" onPlayCapture={()=>setForceStopAudio(false)}>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{message}</div>
      <div className="div-forall"  style={{gap:"35px"}}>
        <ExerciseHeader
            isWorkbook
            sectionLetter="C"
            title={<> Listen. Write and read the
          sentences.
        </>}
          />
        <div className="flex flex-col gap-2">
        <QuestionAudioPlayer
          src={sound}
          captions={captions}
          stopAtSecond={7.25}
          pageId="wb_unit1_page8_q3" forceStop={forceStopAudio} onInteract={()=>setForceStopAudio(false)}
        />

        <div className="family-completion-activity p-2">
          <div className="flex items-start gap-8">
            <div className="sentences flex-1">
              {/* Sentence 1 */}
              <div className="flex w-full gap-10 items-center">
                <p className="text-[22px]">
                  <span className="text-blue-900 font-semibold mr-3">1.</span>
                  <AudioText audioKey="sentence-1" src={sentenceClip0} playSound={(key,src)=>{stopAudio();itemAudio.playSound(key,src);}} playingKey={itemAudio.playingKey}>Look there's a</AudioText>
                  <SelectBox
                    id="sentence1a"
                    value={answers.sentence1a}
                    isWrong={wrongAnswers.sentence1a}
                    onChange={handleChange}
                    showAnswer={showAnswer||correctFields.includes("sentence1a")} isCorrect={correctFields.includes("sentence1a")}
                  />
                  abbit on the
                  <SelectBox
                    id="sentence1b"
                    value={answers.sentence1b}
                    isWrong={wrongAnswers.sentence1b}
                    onChange={handleChange}
                    showAnswer={showAnswer||correctFields.includes("sentence1b")} isCorrect={correctFields.includes("sentence1b")}
                  />
                  oad.
                </p>
                <img
                  src={img1}
                  alt={IMAGE_DESCRIPTIONS[img1]||""}
                  style={{ width: "120px", height: "120px" }}
                />
              </div>
              {/* Sentence 2 */}
              <div className="flex w-full gap-10 items-center">
                <p className="text-[22px]">
                  <span className="text-blue-900 font-semibold mr-3">2.</span>
                  <AudioText audioKey="sentence-2" src={sentenceClip1} playSound={(key,src)=>{stopAudio();itemAudio.playSound(key,src);}} playingKey={itemAudio.playingKey}>Larry has long</AudioText>
                  <SelectBox
                    id="sentence2"
                    value={answers.sentence2}
                    isWrong={wrongAnswers.sentence2}
                    onChange={handleChange}
                    showAnswer={showAnswer||correctFields.includes("sentence2")} isCorrect={correctFields.includes("sentence2")}
                  />
                  egs.
                </p>
                <img
                  src={img2}
                  alt={IMAGE_DESCRIPTIONS[img2]||""}
                  style={{ width: "120px", height: "120px" }}
                />
              </div>
              <div className="flex w-full gap-10 items-center">
                {/* Sentence 3 */}
                <p className="text-[22px]">
                  <span className="text-blue-900 font-semibold mr-3">3.</span>
                  <AudioText audioKey="sentence-3" src={sentenceClip2} playSound={(key,src)=>{stopAudio();itemAudio.playSound(key,src);}} playingKey={itemAudio.playingKey}>There is a</AudioText>
                  <SelectBox
                    id="sentence3"
                    value={answers.sentence3}
                    isWrong={wrongAnswers.sentence3}
                    onChange={handleChange}
                    showAnswer={showAnswer||correctFields.includes("sentence3")} isCorrect={correctFields.includes("sentence3")}
                  />
                  amp on the table.
                </p>
                <img
                  src={img3}
                  alt={IMAGE_DESCRIPTIONS[img3]||""}
                  style={{ width: "120px", height: "120px" }}
                />
              </div>
            </div>
          </div>

          <Button
            handleShowAnswer={handleShowAnswer}
            handleStartAgain={handleStartAgain}
            checkAnswers={checkAnswers}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit1_Page8_Q3;
