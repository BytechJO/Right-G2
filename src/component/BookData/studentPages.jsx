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

//=================== Review1,2
import Review1_Page1 from "../StudentPages/review1&2/Review1_Page1";
import Review1_Page2 from "../StudentPages/review1&2/Review1_Page2";
import Review2_Page1 from "../StudentPages/review1&2/Review2_Page1";
import Review2_Page2 from "../StudentPages/review1&2/Review2_Page2";
import Reading_Unit2_Page1 from "../StudentPages/unit2/Reading_Unit2_Page1";
import Reading_Unit2_Page2 from "../StudentPages/unit2/Reading_Unit2_Page2";

// ==================== unit 3 pages
import Unit3_Page1 from "../StudentPages/unit3/Unit3_Page1";
import Unit3_Page2 from "../StudentPages/unit3/Unit3_Page2";
import Unit3_Page3 from "../StudentPages/unit3/Unit3_Page3";
import Unit3_Page4 from "../StudentPages/unit3/Unit3_Page4";
import Unit3_Page5 from "../StudentPages/unit3/Unit3_Page5";
import Unit3_Page6 from "../StudentPages/unit3/Unit3_Page6";

//==================== unit 4 pages
import Unit4_Page1 from "../StudentPages/unit4/Unit4_Page1";
import Unit4_Page2 from "../StudentPages/unit4/Unit4_Page2";
import Unit4_Page3 from "../StudentPages/unit4/Unit4_Page3";
import Unit4_Page4 from "../StudentPages/unit4/Unit4_Page4";
import Unit4_Page5 from "../StudentPages/unit4/Unit4_Page5";
import Unit4_Page6 from "../StudentPages/unit4/Unit4_Page6";

//=================== Review3,4
import Review3_Page1 from "../StudentPages/review3&4/Review3_Page1";
import Review3_Page2 from "../StudentPages/review3&4/Review3_Page2";
import Review4_Page1 from "../StudentPages/review3&4/Review4_Page1";
import Review4_Page2 from "../StudentPages/review3&4/Review4_Page2";
import Reading_Unit4_Page1 from "../StudentPages/unit4/Reading_Unit4_Page1";
import Reading_Unit4_Page2 from "../StudentPages/unit4/Reading_Unit4_Page2";

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

  <Review1_Page1 openPopup={openPopup} />,
  <Review1_Page2 openPopup={openPopup} />,
  <Review2_Page1 openPopup={openPopup} />,
  <Review2_Page2 openPopup={openPopup} />,

  <Reading_Unit2_Page1 openPopup={openPopup} />,
  <Reading_Unit2_Page2 />,

  <Unit3_Page1 openPopup={openPopup} />,
  <Unit3_Page2 openPopup={openPopup} />,
  <Unit3_Page3 openPopup={openPopup} />,
  <Unit3_Page4 openPopup={openPopup} />,
  <Unit3_Page5 openPopup={openPopup} />,
  <Unit3_Page6 openPopup={openPopup} />,

  <Unit4_Page1 openPopup={openPopup} />,
  <Unit4_Page2 openPopup={openPopup} />,
  <Unit4_Page3 openPopup={openPopup} />,
  <Unit4_Page4 openPopup={openPopup} />,
  <Unit4_Page5 openPopup={openPopup} />,
  <Unit4_Page6 openPopup={openPopup} />,

  <Review3_Page1 openPopup={openPopup} />,
  <Review3_Page2 openPopup={openPopup} />,
  <Review4_Page1 openPopup={openPopup} />,
  <Review4_Page2 openPopup={openPopup} />,
  <Reading_Unit4_Page1 openPopup={openPopup} />,
  <Reading_Unit4_Page2 />,

  <Page1 />,
];
