//===================== unit 1 pages
import Page1 from "../StudentPages/unit1/Page1";
import Page2 from "../StudentPages/unit1/Page2";
import Page3 from "../StudentPages/unit1/Page3";
import Page4 from "../StudentPages/unit1/Page4";
import Page5 from "../StudentPages/unit1/Page5";
import Page6 from "../StudentPages/unit1/Page6";
import Page7 from "../StudentPages/unit1/Page7";
import Page8 from "../StudentPages/unit1/Page8";
import Page9 from "../StudentPages/unit1/Page9";

//==================== unit 2 pages

import Unit2_Page1 from "../StudentPages/unit2/Unit2_Page1";
import Unit2_Page2 from "../StudentPages/unit2/Unit2_Page2";
import Unit2_Page3 from "../StudentPages/unit2/Unit2_Page3";
import Unit2_Page4 from "../StudentPages/unit2/Unit2_Page4";
import Unit2_Page5 from "../StudentPages/unit2/Unit2_Page5";
import Unit2_Page6 from "../StudentPages/unit2/Unit2_Page6";

// ==================== unit 3 pages

//==================== unit 4 pages

//=================== Review3,4

//================== unit 5 pages

//================== unit 6 pages

// ==================Review5,6

//================ Unit7

//=============== unit8

//================ review 7,8

//================== Unit 9

//================= Unit10

//================= review 9,10

export const studentPages = (openPopup, goToUnit) => [
  <Page1 />,
  <Page2 goToUnit={goToUnit} />,
  <Page3 goToUnit={goToUnit} />,
  <Page4 openPopup={openPopup} />,
  <Page5 openPopup={openPopup} />,
  <Page6 openPopup={openPopup} />,
  <Page7 openPopup={openPopup} />,
  <Page8 openPopup={openPopup} />,
  <Page9 openPopup={openPopup} />,

  <Unit2_Page1 openPopup={openPopup} />,
  <Unit2_Page2 openPopup={openPopup} />,
  <Unit2_Page3 openPopup={openPopup} />,
  <Unit2_Page4 openPopup={openPopup} />,
  <Unit2_Page5 openPopup={openPopup} />,
  <Unit2_Page6 openPopup={openPopup} />,
];
