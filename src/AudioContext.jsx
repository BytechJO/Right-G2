import { createContext, useState } from "react";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  return (
    <AudioContext.Provider value={{ isAudioPlaying, setIsAudioPlaying }}>
      {children}
    </AudioContext.Provider>
  );
};