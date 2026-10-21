import React from "react";
import find_img from "../../../assets/imgs/Right 2 Unit 10 At Our Home/Page.png";
import MySVG from "../../../assets/imgs/Interactive Svg un 10.svg";
import FindQuestion from "../../FindQuestion";

const targetArea = { x1: 63.7, y1: 51.4, x2: 93.9, y2: 71.63 };

const Unit10_Page1_find = () => (
  <FindQuestion
    title="I need your help. Can you help me find the plant in the picture?"
    subtitle={"Wait for the full scene to load, scan it carefully, then tap the plant."}
    image={find_img}
    imageAlt="A cutaway house with people cooking, dressing, watching television, reading, and sleeping; children play outdoors beside a flower garden."
    targetName="the plant"
    targetArea={targetArea}
    answerHighlight={MySVG}
    targetAudio=""
    imageHeight="75vh"
    highlightTop="50%"
    highlightLeft="61%"
    highlightHeight="22.2%"
    targetAriaLabel="Select the plant"
    pointerSelectedMessage="A point in the scene was selected. Use Check Answer to check it."
    keyboardSelectedMessage="The plant selected. Use Check Answer to check your answer."
    correctAnnouncement="Correct. You found the plant."
    correctAlertMessage="You found the plant! 🏆"
    wrongAnnouncement="That is not the plant. Try again."
    wrongAlertMessage="This is not the plant. Try again!"
    resetAnnouncement="Activity reset. Find the plant."
    showAnswerAnnouncement="The plant is highlighted."
  />
);

export default Unit10_Page1_find;
