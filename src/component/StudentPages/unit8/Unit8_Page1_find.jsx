import React from "react";
import find_img from "../../../assets/imgs/Right 2 Unit 8 Its Shopping Time/Page.png";
import MySVG from "../../../assets/imgs/Interactive Svg un 8.svg";
import FindQuestion from "../../FindQuestion";

// The purse, including its shoulder strap, in the verified Unit 8 artwork.
const targetArea = {
  x1: 66.5,
  y1: 54,
  x2: 80,
  y2: 79,
};

const Unit8_Page1_find = () => (
  <FindQuestion
    title="I need your help. Can you help me find the purse in the shopping picture?"
    subtitle="Wait for the full scene to load, scan it carefully, then tap the the purse"
    image={find_img}
    imageAlt="People shopping in a clothing store, with clothes on racks, shopping carts, and a checkout counter."
    targetName="the purse"
    targetArea={targetArea}
    answerHighlight={MySVG}
    targetAudio=""
    imageHeight="75vh"
    highlightTop="55%"
    highlightLeft="68%"
    highlightHeight="28%"
    targetAriaLabel="Select the purse"
    pointerSelectedMessage="A point in the scene was selected. Use Check Answer to check it."
    keyboardSelectedMessage="The purse selected. Use Check Answer to check your answer."
    correctAnnouncement="Correct. You found the purse."
    correctAlertMessage="You found the purse! 🏆"
    wrongAnnouncement="That is not the purse. Try again."
    wrongAlertMessage="This is not the purse. Try again!"
    resetAnnouncement="Activity reset. Find the purse."
    showAnswerAnnouncement="The purse is highlighted."
  />
);

export default Unit8_Page1_find;
