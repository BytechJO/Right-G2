import ExerciseHeader from "../../ExerciseHeader";
import {playGlobalAudio,stopGlobalAudio} from "../../audioManager";
import React, { useState, useRef, useEffect } from "react";
import img1 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 1.svg";
import img2 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 2.svg";
import img3 from "../../../assets/imgs/WorkBook/Right Int WB G2 U1 Folder/Page 4/Ex E 3.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import Button from "../Button";


import {FaVolumeUp} from "react-icons/fa";
import clip0 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - E/Item_001_I'm_Stella's.mp3";
import clip1 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - E/Item_002_cousin.mp3";
import clip2 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - E/Item_003_aunt.mp3";
import clip3 from "../../../assets/audio/WorkBook/Unit 1/Page 4 - E/Item_004_uncle.mp3";
const IMAGE_DESCRIPTIONS={[img1]:"A man in a blue shirt and vest.",[img2]:"A boy in a red top.",[img3]:"A woman wearing glasses and an orange top."};

const focusClass = "focus-visible:outline-4! focus-visible:outline-[#2563eb]! focus-visible:outline-offset-4!";
// eslint-disable-next-line react-refresh/only-export-components -- Keep this indicator local.
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
// eslint-disable-next-line react-refresh/only-export-components -- Keep this control local.
const AudioText=({children,audioKey,src,playSound,playingKey,className="",style={}})=><span role="button" tabIndex={0} aria-label={String(children)+". Hear it."} className={className+" "+focusClass} onClick={()=>playSound(audioKey,src)} onKeyDown={activate} onKeyUp={release} style={{borderRadius:"8px",...style,position:"relative",cursor:"pointer",...(playingKey===audioKey?{boxShadow:"0 0 0 3px #2563eb",backgroundColor:"#dbeafe"}:{})}}>{children}{playingKey===audioKey&&<SpeakerBadge/>}</span>;



function useMatching(correct) {
  const [matches, setMatches] = useState({}),
    [results, setResults] = useState({}),
    [source, setSource] = useState(null),
    [preview, setPreview] = useState(null),
    [revealed, setRevealed] = useState(false),
    [message, setMessage] = useState("");
  const containerRef = useRef(null),
    leftDots = useRef({}),
    rightDots = useRef({}),
    leftRefs = useRef({}),
    rightRefs = useRef({}),
    frame = useRef(null);
  const [, setGeometry] = useState(0),
    refresh = () => setGeometry(v => v + 1),
    ids = Object.keys(correct),
    rightIds = [...new Set(Object.values(correct))].map(String);
  const locked = (side, id) => revealed || (side === "left" ? results[id] === "correct" : Object.entries(matches).some(([left, right]) => String(right) === String(id) && results[left] === "correct"));
  const cancelFocus = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  };
  const focus = (side, id) => {
    cancelFocus();
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      (side === "left" ? leftRefs : rightRefs).current[id]?.focus();
    });
  };
  useEffect(() => {
    window.addEventListener("resize", refresh);
    return () => {
      window.removeEventListener("resize", refresh);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);
  useEffect(() => {
    const id = requestAnimationFrame(refresh);
    return () => cancelAnimationFrame(id);
  }, [matches, source, preview]);
  const cancel = () => {
    cancelFocus();
    setSource(null);
    setPreview(null);
    setMessage("Connection cancelled.");
  };
  const choose = (side, id, keyboard = false) => {
    id = String(id);
    if (locked(side, id)) return;
    if (!source || source.side === side) {
      if (source?.side === side && source.id === id) {
        cancel();
        return;
      }
      setSource({
        side,
        id
      });
      setPreview(null);
      setMessage("Selected. Choose an endpoint on the opposite side.");
      if (keyboard) {
        const other = side === "left" ? "right" : "left",
          next = (other === "left" ? ids : rightIds).find(id => !locked(other, id));
        if (next !== undefined) focus(other, next);
      }
      return;
    }
    const left = side === "left" ? id : source.id,
      right = side === "right" ? id : source.id;
    if (locked("left", left) || locked("right", right)) return;
    const next = {
        ...matches
      },
      affected = [left];
    for (const [previous, value] of Object.entries(next)) if (String(value) === right && previous !== left) {
      if (locked("left", previous)) return;
      delete next[previous];
      affected.push(previous);
    }
    next[left] = right;
    setMatches(next);
    setResults(prev => Object.fromEntries(Object.entries(prev).filter(([id]) => !affected.includes(id))));
    setSource(null);
    setPreview(null);
    setMessage("Pair connected.");
    if (keyboard) {
      const nextId = ids.find(id => !locked("left", id));
      if (nextId) focus("left", nextId);
    }
  };
  const endpointProps = (side, id, label) => ({
    role: "button",
    tabIndex: source?.side === "right" && side === "right" ? -1 : 0,
    "aria-label": label + (locked(side, id) ? ". Correct and locked." : ". Matching endpoint."),
    "aria-disabled": locked(side, id),
    "aria-pressed": source?.side === side && source.id === String(id),
    onKeyDown: e => {
      if (e.key === "Escape" && source) {
        e.preventDefault();
        e.stopPropagation();
        cancel();
        return;
      }
      if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        const list = side === "left" ? ids : rightIds,
          step = e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 1;
        for (let n = 1; n <= list.length; n++) {
          const next = list[(list.indexOf(String(id)) + step * n + list.length) % list.length];
          if (!locked(side, next)) {
            focus(side, next);
            break;
          }
        }
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat) choose(side, id, true);
    },
    onKeyUp: release,
    onFocus: () => {
      if (source && source.side !== side && !locked(side, id)) setPreview({
        side,
        id: String(id)
      });
    },
    onMouseEnter: () => {
      if (source && source.side !== side && !locked(side, id)) setPreview({
        side,
        id: String(id)
      });
    },
    onMouseLeave: () => setPreview(null),
    style: {
      position: "relative",
      borderRadius: "8px",
      ...(source?.side === side && source.id === String(id) ? {
        outline: "3px solid #eb533c",
        outlineOffset: 2
      } : {}),
      ...(locked(side, id) ? {
        boxShadow: "inset 0 -2px #16a34a"
      } : {})
    }
  });
  const point = (side, id) => {
    const el = (side === "left" ? leftDots : rightDots).current[id],
      root = containerRef.current;
    if (!el || !root) return null;
    const r = el.getBoundingClientRect(),
      c = root.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - c.left,
      y: r.top + r.height / 2 - c.top
    };
  };
  const line = (left, right) => {
    const a = point("left", left),
      b = point("right", right);
    return a && b ? {
      left,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y
    } : null;
  };
  const lines = Object.entries(matches).map(([left, right]) => line(left, right)).filter(Boolean);
  const previewLine = source && preview && source.side !== preview.side ? line(source.side === "left" ? source.id : preview.id, source.side === "right" ? source.id : preview.id) : null;
  const evaluate = () => {
    cancel();
    const next = Object.fromEntries(ids.map(id => [id, results[id] === "correct" || String(matches[id]) === String(correct[id]) ? "correct" : "wrong"]));
    setResults(next);
    return next;
  };
  const show = () => {
    cancel();
    setMatches(Object.fromEntries(Object.entries(correct).map(([left, right]) => [left, String(right)])));
    setResults(Object.fromEntries(ids.map(id => [id, "correct"])));
    setRevealed(true);
    setMessage("Correct connections shown and locked.");
  };
  const reset = () => {
    cancel();
    setMatches({});
    setResults({});
    setRevealed(false);
    setMessage("Exercise reset.");
  };
  return {
    matches,
    results,
    source,
    preview,
    revealed,
    message,
    setMessage,
    containerRef,
    leftDots,
    rightDots,
    leftRefs,
    rightRefs,
    choose,
    endpointProps,
    lines,
    previewLine,
    evaluate,
    show,
    reset,
    cancel,
    cancelFocus,
    locked,
    refresh
  };
}

const WB_Unit1_Page4_Q3=()=>{
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
const match=useMatching(correctMatches),audio=useExerciseAudio();
const {matches,lines,containerRef}=match;
const selectedLeft=match.source?.side==="left"?Number(match.source.id):null;
const handleLeftClick=id=>{audio.playSound("left-"+id,clip0);match.choose("left",id);},handleRightClick=id=>{audio.playSound("right-"+id,{1:clip1,2:clip2,3:clip3}[id]);match.choose("right",id);};
const checkAnswers=()=>{if(match.revealed)return;match.cancel();audio.stopAudio();if(Object.keys(matches).length!==3){ValidationAlert.info("Oops!","Please match all sentences first.");match.setMessage("Please match all sentences first.");return;}const results=match.evaluate(),score=Object.values(results).filter(x=>x==="correct").length,msg=`Score: ${score} / 3`;match.setMessage(msg+". Correct pairs are locked; incorrect pairs can be changed.");if(score===3)ValidationAlert.success(msg);else if(score===0)ValidationAlert.error(msg);else ValidationAlert.warning(msg);};
const handleShowAnswer=()=>{audio.stopAudio();match.show();},handleStartAgain=()=>{audio.stopAudio();match.reset();};
return (
    <div ref={audio.rootRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{match.message}</div>
      <div className="div-forall" style={{gap:"100px"}}>
        <ExerciseHeader
            isWorkbook
            sectionLetter="E"
            title={<> Look, read, and match.
        </>}
          />

        <div
          ref={containerRef}
          className="flex justify-between gap-20 relative"
        >
          {/* Left Side */}
          <div className="space-y-12">
            {data.left.map((item) => {
              const isWrong =
                match.results[item.id]==="wrong" &&
                matches[item.id] &&
                String(matches[item.id]) !== String(correctMatches[item.id]);
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
                    alt={IMAGE_DESCRIPTIONS[item.img]||""}
                    className="max-w-16 max-h-16 rounded-full object-cover"
                  />

                  {/* جعل النص قابلاً للنقر بدون خلفية */}
                  <span
                    ref={el=>{match.leftRefs.current[item.id]=el;}}
                    {...match.endpointProps("left",item.id,item.text)}
                    onKeyDown={e=>{if((e.key==="Enter"||e.key===" ")&&!e.repeat)audio.playSound("left-"+item.id,clip0);match.endpointProps("left",item.id,item.text).onKeyDown(e);}}
                    onClick={() => handleLeftClick(item.id)}
                    className={`text-xl ${focusClass} cursor-pointer transition-all duration-200 ${
                      selectedLeft === item.id
                        ? "text-red-600 font-bold underline decoration-red-600 decoration-2 underline-offset-2"
                        : isConnected
                          ? "text-black-600 font-semibold"
                          : "text-gray-700 hover:text-red-500 hover:underline hover:decoration-red-500 hover:decoration-2 hover:underline-offset-2"
                    }`}
                  >
                    {item.text}
                    {audio.playingKey===`left-${item.id}`&&<SpeakerBadge/>}
                  </span>

                  {/* نقطة الاتصال من اليسار */}
                  <div
                    ref={(el) => (match.leftDots.current[item.id] = el)}
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
              const isConnected = Object.values(matches).includes(String(item.id));

              return (
                <div key={item.id} className="flex items-center justify-end">
                  {/* نقطة الاتصال من اليمين */}
                  <div
                    ref={(el) => (match.rightDots.current[item.id] = el)}
                    onClick={() => handleRightClick(item.id)}
                    className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
                      isConnected ? "bg-red-500" : "bg-[#eb533c]"
                    }`}
                    title="انقر للتوصيل"
                  />

                  {/* جعل النص قابلاً للنقر بدون خلفية */}
                  <span
                    ref={el=>{match.rightRefs.current[item.id]=el;}}
                    {...match.endpointProps("right",item.id,item.text)}
                    onKeyDown={e=>{if((e.key==="Enter"||e.key===" ")&&!e.repeat)audio.playSound("right-"+item.id,{1:clip1,2:clip2,3:clip3}[item.id]);match.endpointProps("right",item.id,item.text).onKeyDown(e);}}
                    onClick={() => handleRightClick(item.id)}
                    className={`text-xl ${focusClass} cursor-pointer transition-all duration-200 w-24 text-right ${
                      isConnected
                        ? "text-black-600 font-semibold"
                        : "text-gray-700 hover:text-red-500 hover:underline hover:decoration-red-500 hover:decoration-2 hover:underline-offset-2"
                    }`}
                  >
                    {item.text}
                    {audio.playingKey===`right-${item.id}`&&<SpeakerBadge/>}
                  </span>
                </div>
              );
            })}
          </div>

          {/* رسم الخطوط بين العناصر الموصولة */}
          <svg aria-hidden="true" className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {match.previewLine&&<line {...match.previewLine} stroke="#eb533c" strokeWidth="2" strokeDasharray="6 4"/>}
            {lines.map((line, index) => (
              <line
                key={index}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={match.results[line.left]==="correct"?"#16a34a":"red"}
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
