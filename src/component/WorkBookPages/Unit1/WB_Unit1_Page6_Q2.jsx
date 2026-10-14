import ExerciseHeader from "../../ExerciseHeader";
import {playGlobalAudio,stopGlobalAudio} from "../../audioManager";
import { FaVolumeUp } from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_001_She's.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_002_uncle.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_003_I'm.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_004_sister.mp3";
import clip4 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_005_my.mp3";
import clip5 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_006_He's.mp3";
import clip6 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_007_aunt.mp3";
import clip7 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_008_brother.mp3";
import clip8 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_009_They're.mp3";
import clip9 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_010_mother_and_father.mp3";
import clip10 from "../../../assets/audio/WorkBook/Unit 1/Page 6 - I/Item_011_uncle_and_aunt.mp3";
import React, { useState, useEffect, useRef } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex I 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex I 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex I 3.svg";
import img4 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 6/Ex I 4.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";
const IMAGE_DESCRIPTIONS={[img1]:"A man in a cream shirt.",[img2]:"A boy in a red top.",[img3]:"A man in a blue vest beside a woman in green with an orange headband.",[img4]:"A child with dark hair tied up and a blue top."};



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

const WB_Unit1_Page6_Q2 = () => {
  const [userSelections, setUserSelections] = useState({
    1: { pronoun: null, relation: null },
    2: { pronoun: null, relation: null },
    3: { pronoun: null, relation: null },
    4: { pronoun: null, relation: null },
  });
  const [results,setResults]=useState({});
  const [message,setMessage]=useState("");
  const {rootRef,playingKey,playSound,stopAudio}=useExerciseAudio();

  const [showAnswers, setShowAnswers] = useState(false);

  const data = [
    {
      id: 1,
      img: img1,
      pronouns: ["She's", "He's"],
      relations: ["uncle.", "aunt."],
      correctPronoun: "He's",
      correctRelation: "uncle.",
    },
    {
      id: 2,
      img: img2,
      pronouns: ["I'm", "He's"],
      relations: ["sister.", "brother."],
      correctPronoun: "He's",
      correctRelation: "brother.",
    },
    {
      id: 3,
      img: img3,
      pronouns: ["They're", "He's"],
      relations: ["mother and father.", "uncle and aunt."],
      correctPronoun: "They're",
      correctRelation: "mother and father.",
    },
    {
      id: 4,
      img: img4,
      pronouns: ["She's", "He's"],
      relations: ["sister.", "brother."],
      correctPronoun: "She's",
      correctRelation: "sister.",
    },
  ];

  const handleSelect = (id, field, option) => {
    if (!showAnswers && results[`${id}-${field}`]!=="correct") {
      setResults(prev=>({...prev,[`${id}-${field}`]:null}));
      setMessage(`Question ${id}, ${field}: ${option} selected.`);
      setUserSelections({
        ...userSelections,
        [id]: { ...userSelections[id], [field]: option },
      });
    }
  };

  const checkAnswers = () => {
    if (showAnswers) return;
    stopAudio();
    const hasEmptySelections = data.some((item) => {
      const userItem = userSelections[item.id];
      return !userItem?.pronoun || !userItem?.relation;
    });

    if (hasEmptySelections) {
      ValidationAlert.info("Please complete all answers first.");
      setMessage("Please complete all answers first.");
      return;
    }

    let currentScore = 0;
    const totalQuestions = data.length * 2;

    data.forEach((item) => {
      const userItem = userSelections[item.id] || {};

      if (
        userItem.pronoun?.toLowerCase().trim() ===
        item.correctPronoun.toLowerCase()
      ) {
        currentScore++;
      }

      if (
        userItem.relation?.toLowerCase().trim() ===
        item.correctRelation.toLowerCase()
      ) {
        currentScore++;
      }
    });

    setResults(Object.fromEntries(data.flatMap(item=>[ [`${item.id}-pronoun`,userSelections[item.id].pronoun===item.correctPronoun?"correct":"wrong"], [`${item.id}-relation`,userSelections[item.id].relation===item.correctRelation?"correct":"wrong"] ])));
    setMessage(`Score ${currentScore} out of ${totalQuestions}. Correct answers are locked.`);


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
      answers[item.id] = {
        pronoun: item.correctPronoun,
        relation: item.correctRelation,
      };
    });
    setUserSelections(answers);
    stopAudio();
    setResults(Object.fromEntries(data.flatMap(item=>[[`${item.id}-pronoun`,"correct"],[`${item.id}-relation`,"correct"]])));
    setMessage("Correct answers shown and locked.");
    setShowAnswers(true);
  };

  const handleStartAgain = () => {
    setUserSelections({
      1: { pronoun: null, relation: null },
      2: { pronoun: null, relation: null },
      3: { pronoun: null, relation: null },
      4: { pronoun: null, relation: null },
    });
    stopAudio();
    setResults({});
    setMessage("Exercise reset.");
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
        style={{gap:"35px"}}
       
      >
        <ExerciseHeader
            isWorkbook
            sectionLetter="I"
            title={<>Look, read, and circle.
        </>}
          />

        <div className="grid grid-cols-2 gap-x-20 gap-y-5" style={{justifyItems:"start"}}>
          {data.map((item) => (
            <div key={item.id} className="flex flex-col gap-6 w-full">
              <div className="flex items-start gap-4 w-full">
                <span className="font-bold text-blue-900 text-2xl">
                  {item.id}
                </span>
                <img
                  src={item.img}
                  alt={IMAGE_DESCRIPTIONS[item.img]||""}
                  className="max-w-24 max-h-24 object-contain rounded-xl "
                />
              </div>

              <div className="flex items-center gap-4 text-xl text-gray-800">
                <div className="flex flex-col gap-4">
                  {item.pronouns.map((p) => {
                    const isWrong =
                      results[`${item.id}-pronoun`]==="wrong" &&
                      userSelections[item.id].pronoun === p &&
                      p !== item.correctPronoun;

                    return (
                      <button
                        key={p}
                        type="button" aria-pressed={userSelections[item.id].pronoun===p} aria-disabled={showAnswers||results[`${item.id}-pronoun`]==="correct"}
                        aria-label={`Question ${item.id}, pronoun: ${p}${results[`${item.id}-pronoun`]==="correct"?", correct and locked":""}`}
                        onKeyDown={activate} onKeyUp={release}
                        style={userSelections[item.id].pronoun===p&&results[`${item.id}-pronoun`]?{borderColor:results[`${item.id}-pronoun`]==="correct"?"#16a34a":"#ef4444",boxShadow:results[`${item.id}-pronoun`]==="correct"?"inset 0 -2px #16a34a":undefined}:undefined}
                        onClick={() => {playSound(`choice-${item.id}-pronoun-${p}`,{"She's":clip0,"uncle.":clip1,"I'm":clip2,"sister.":clip3,"He's":clip5,"aunt.":clip6,"brother.":clip7,"They're":clip8,"mother and father.":clip9,"uncle and aunt.":clip10}[p]);handleSelect(item.id,"pronoun",p);}}
                        className={`relative px-4 py-1 rounded-full ${focusClass} border-2 text-nowrap transition-all ${
                          userSelections[item.id].pronoun === p
                            ? "border-red-500 bg-red-50"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        {p}
                        {playingKey===`choice-${item.id}-pronoun-${p}`&&<SpeakerBadge/>}

                        {isWrong && (
                          <div className="wb-wrong-icon-unit1-page6-q2">
                            ✕
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <AudioText audioKey={`my-${item.id}`} src={clip4} playSound={playSound} playingKey={playingKey} className="font-bold">my</AudioText>
                <div className="flex flex-col gap-4">
                  {item.relations.map((r) => {
                    const isWrong =
                      results[`${item.id}-relation`]==="wrong" &&
                      userSelections[item.id].relation === r &&
                      r !== item.correctRelation;

                    return (
                      <button
                        key={r}
                        type="button" aria-pressed={userSelections[item.id].relation===r} aria-disabled={showAnswers||results[`${item.id}-relation`]==="correct"}
                        aria-label={`Question ${item.id}, relation: ${r}${results[`${item.id}-relation`]==="correct"?", correct and locked":""}`}
                        onKeyDown={activate} onKeyUp={release}
                        style={userSelections[item.id].relation===r&&results[`${item.id}-relation`]?{borderColor:results[`${item.id}-relation`]==="correct"?"#16a34a":"#ef4444",boxShadow:results[`${item.id}-relation`]==="correct"?"inset 0 -2px #16a34a":undefined}:undefined}
                        onClick={() => {playSound(`choice-${item.id}-relation-${r}`,{"She's":clip0,"uncle.":clip1,"I'm":clip2,"sister.":clip3,"He's":clip5,"aunt.":clip6,"brother.":clip7,"They're":clip8,"mother and father.":clip9,"uncle and aunt.":clip10}[r]);handleSelect(item.id,"relation",r);}}
                        className={`relative px-4 py-1 rounded-full ${focusClass} border-2  text-nowrap transition-all ${
                          userSelections[item.id].relation === r
                            ? "border-red-500 bg-red-50"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        {r}
                        {playingKey===`choice-${item.id}-relation-${r}`&&<SpeakerBadge/>}

                        {isWrong && (
                          <div className="wb-wrong-icon-unit1-page6-q2">
                            ✕
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
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

export default WB_Unit1_Page6_Q2;
