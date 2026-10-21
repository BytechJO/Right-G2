import React, { useRef ,useState ,useEffect} from "react";
import arrowBtn from "../../../assets/Page 01/Arrow.svg";
import page3 from "../../../assets/imgs/Right 2 Unit 1 Stellas Family/Page 3.png";

// غيّر المسارات حسب مكان الأصوات عندك
import unit1Audio from "../../../assets/audio/ClassBook/U 1/Page 3/Helen's Day.mp3";
import unit2Audio from "../../../assets/audio/ClassBook/U 1/Page 3/It's Boarding Time.mp3";
import unit3Audio from "../../../assets/audio/ClassBook/U 1/Page 3/It's Shopping Time.mp3";
import unit4Audio from "../../../assets/audio/ClassBook/U 1/Page 3/Visiting Our Grandparents.mp3";
import unit5Audio from "../../../assets/audio/ClassBook/U 1/Page 3/At Our Home.mp3";

const Page3 = ({ goToUnit }) => {
  const imgRef = useRef(null);
  const audioRef = useRef(null);

  const [playingUnit, setPlayingUnit] = useState(null);

  const clickableAreas = [
    {
      title: "Unit 1",
      startIndex: 46,
      audio: unit1Audio,
      top: "8.5%",
      left: "13%",
      width: "21.5%",
      height: "3%",
      arrowTop: "8.5%",
      arrowLeft: "35%",
    },
    {
      title: "Unit 2",
      startIndex: 58,
      audio: unit2Audio,

      top: "26.5%",
      left: "14%",
      width: "26.5%",
      height: "3%",

      arrowTop: "26.5%",
      arrowLeft: "41%",
    },
    {
      title: "Unit 3",
      startIndex: 64,
      audio: unit3Audio,

      top: "44%",
      left: "14%",
      width: "27%",
      height: "3%",

      arrowTop: "44%",
      arrowLeft: "41.8%",
    },
    {
      title: "Unit 4",
      startIndex: 76,
      audio: unit4Audio,

      top: "61%",
      left: "14%",
      width: "35%",
      height: "3%",

      arrowTop: "61%",
      arrowLeft: "49.5%",
    },
    {
      title: "Unit 5",
      startIndex: 82,
      audio: unit5Audio,

      top: "79%",
      left: "14%",
      width: "23%",
      height: "3%",

      arrowTop: "79%",
      arrowLeft: "37%",
    },
  ];

  const playUnitAudio = (area) => {
    // إذا في صوت شغال، وقفه أول
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(area.audio);

    audioRef.current = audio;
    setPlayingUnit(area.title);

    audio.play();

    audio.onended = () => {
      setPlayingUnit(null);
    };
  };

  const handleGoToUnit = (area) => {
    // وقف الصوت قبل الانتقال للوحدة
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setPlayingUnit(null);

    goToUnit(area.startIndex);
  };

  // لو طلع المستخدم من الصفحة، وقف الصوت
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div
      className="page1-img-wrapper"
      ref={imgRef}
      style={{
        backgroundImage: `url(${page3})`,
        position: "relative",
      }}
    >
      {clickableAreas.map((area, index) => (
        <React.Fragment key={index}>
          {/* =========================
              UNIT AUDIO AREA
          ========================== */}
          <button
            type="button"
            onClick={() => playUnitAudio(area)}
            aria-label={`Play ${area.title} audio`}
            aria-pressed={playingUnit === area.title}
            className={`absolute cursor-pointer transition-all duration-150
              ${
                playingUnit === area.title
                  ? "ring-4 ring-green-500"
                  : "hover:ring-2 hover:ring-blue-400"
              }
            `}
            style={{
              top: area.top,
              left: area.left,
              width: area.width,
              height: area.height,
              background: "transparent",
              border: "none",
              borderRadius: "8px",
            }}
          >
            {playingUnit === area.title && (
              <span
                style={{
                  position: "absolute",
                  top: "-25px",
                  left: "0",
                  background: "#16a34a",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                🔊 Playing
              </span>
            )}
          </button>

          {/* =========================
              NAVIGATION ARROW
          ========================== */}
          <button
            type="button"
            onClick={() => handleGoToUnit(area)}
            aria-label={`Go to ${area.title}`}
            className="
                absolute z-20
                w-5 h-5
                flex items-center justify-center
                p-0
                bg-transparent
                border-0
                cursor-pointer
                transition-all duration-150
                hover:scale-110
                active:scale-95
                focus-visible:outline-offset-2
                rounded-full
              "
            style={{
              top: area.arrowTop,
              left: area.arrowLeft,
            }}
          >
            <img
              src={arrowBtn}
              alt=""
              className="w-full h-full object-contain pointer-events-none"
            />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Page3;