import Book from "./component/Book";
import { AudioProvider } from "./AudioContext";
function App() {

  return (
    <>
   
     <AudioProvider>
      <Book />
      </AudioProvider>
    </>
  );
}

export default App;
