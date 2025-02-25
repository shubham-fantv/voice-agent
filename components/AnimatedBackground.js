"use client";

import dynamic from "next/dynamic";
import React from "react";
import { withBasePath } from "../utils/deepgramUtils";

const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), {
  ssr: false,
});

const AnimatedBackground = ({ children }) => {
  return (
    <div className="playerError">
      <Player
        autoplay
        loop
        src={withBasePath("/sts-bg.json")}
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        className="animatedBackground"
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "black",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
