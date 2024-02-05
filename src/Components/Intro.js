import React, { useEffect } from "react";
import introSound from "../intro/NIntro.mp3";

function Intro() {
  useEffect(() => {
    const audio = new Audio(introSound);
    // Attempt to play audio on mount
    audio
      .play()
      .then(() => {
        console.log("Playing audio");
      })
      .catch((e) => {
        console.error("Error playing audio:", e);
        // Handling if autoplay is not allowed
        // Show a message or a play button to the user here
      });
  }, []);

  return <div>{/* Your component's content */}</div>;
}

export default Intro;
