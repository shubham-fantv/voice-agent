import React, { useRef, useEffect } from "react";
import { Mic } from "lucide-react";
import { useVoiceBot, VoiceBotStatus } from "../context/VoiceBotContextProvider";

const PULSE_PERIOD_SECONDS = 3;
const PULSE_SIZE_MULTIPLIER = 1.02;
const AVERAGE_ROTATION_PERIOD_SECONDS = 6;
const SLEEP_SPEED_MULTIPLIER = 0.5;
const FOCUS_SPEED_MULTIPLIER = 5;
const FOCUS_SIZE_MULTIPLIER = 0.5;
const CHATTER_SIZE_MULTIPLIER = 1.15;
const CHATTER_WINDOW_SIZE = 3;

const pi = (n) => Math.PI * n;

const getCenter = (ctx) => {
  const { width, height } = ctx.canvas.getBoundingClientRect();
  return {
    x: width / 2,
    y: height / 2,
  };
};

const lerp = (start, stop, amt) => amt * (stop - start) + start;

const easeInOutQuad = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

const Color = {
  springGreen: "#13ef93cc",
  springGreenLight: "#b8f8d2cc",
  eucalyptus: "#027a48cc",
  rose: "#f185becc",
  lavender: "#ba80f5cc",
  chryslerBlue: "#3a00d3cc",
  azure: "#149afbcc",
};

const lines = [
  {
    segments: [
      { pct: 0, color: Color.rose },
      { pct: 1, color: Color.springGreen },
    ],
    startAngle: 0,
    speedMultiplier: 1.2,
    width: 3,
  },
  {
    segments: [
      { pct: 0, color: Color.azure },
      { pct: 1, color: Color.chryslerBlue },
    ],
    startAngle: pi(0.5),
    speedMultiplier: 0.8,
    width: 3,
  },
  {
    segments: [
      { pct: 0, color: Color.eucalyptus },
      { pct: 1, color: Color.lavender },
    ],
    startAngle: pi(1),
    speedMultiplier: 1,
    width: 3,
  },
];

const makeGradient = (ctx, angle, parts) => {
  const center = getCenter(ctx);
  const x1 = center.x * (1 - Math.cos(angle));
  const y1 = center.y * (1 - Math.sin(angle));
  const x2 = center.x * (1 + Math.cos(angle));
  const y2 = center.y * (1 + Math.sin(angle));
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  parts.forEach(({ pct, color }) => {
    g.addColorStop(pct, color);
  });
  return g;
};

const radiusOscillation = (shape) =>
  1 +
  (PULSE_SIZE_MULTIPLIER - 1) *
    Math.sin((shape.current.time * pi(1)) / PULSE_PERIOD_SECONDS / 1000) *
    lerp(1, 0.33, shape.current.focus);

const rollingAverage = (noise, start) => {
  const noiseWindow = noise.slice(start, start + CHATTER_WINDOW_SIZE);
  return noiseWindow.reduce((a, b) => a + b) / noiseWindow.length;
};

const speechSimulation = (shape, start) =>
  lerp(1, CHATTER_SIZE_MULTIPLIER, rollingAverage(shape.current.agentNoise, start));

const listeningSimulation = (shape, start) =>
  lerp(1, 1 / CHATTER_SIZE_MULTIPLIER, rollingAverage(shape.current.userNoise, start));

const draw = (ctx, shape, last, now) => {
  shape.current.time +=
    (now - last) * lerp(1, FOCUS_SPEED_MULTIPLIER, shape.current.focus) * SLEEP_SPEED_MULTIPLIER;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.filter = "saturate(150%)";

  const center = getCenter(ctx);
  const maxRadius = Math.min(center.x, center.y) * 0.8;

  lines.forEach((line, i) => {
    ctx.lineWidth = line.width;
    ctx.shadowColor = line.segments[0].color;
    ctx.shadowBlur = line.width * 1.1;

    const radius =
      maxRadius *
      speechSimulation(shape, i) *
      listeningSimulation(shape, i) *
      radiusOscillation(shape) *
      lerp(1, FOCUS_SIZE_MULTIPLIER, easeInOutQuad(shape.current.focus));

    const gradient = makeGradient(
      ctx,
      line.startAngle +
        ((shape.current.time * pi(1)) / 1000 / AVERAGE_ROTATION_PERIOD_SECONDS) *
          line.speedMultiplier,
      line.segments,
    );

    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, pi(2));
    ctx.stroke();
  });

  requestAnimationFrame((t) => {
    draw(ctx, shape, now, t);
  });
};

const focusIntensity = (orbState) => {
  switch (orbState) {
    case VoiceBotStatus.THINKING:
      return 1;
    default:
      return 0;
  }
};

const CircularVoiceIndicator = ({ width = 0, height = 0, agentVolume = 0, userVolume = 0 }) => {
  const { status: orbState } = useVoiceBot();
  const canvas = useRef(null);
  const shape = useRef({
    generation: 0,
    time: 0,
    focus: focusIntensity(orbState),
    agentNoise: Array(lines.length + CHATTER_WINDOW_SIZE).fill(agentVolume),
    userNoise: Array(lines.length + CHATTER_WINDOW_SIZE).fill(userVolume),
  });

  useEffect(() => {
    if (canvas.current) {
      const context = canvas.current.getContext("2d");
      if (context) {
        const now = performance.now();
        requestAnimationFrame((t) => {
          draw(context, shape, now, t);
        });
      }
    }
  }, []);

  useEffect(() => {
    shape.current.agentNoise.shift();
    shape.current.agentNoise.push(agentVolume);
  }, [agentVolume]);

  useEffect(() => {
    shape.current.userNoise.shift();
    shape.current.userNoise.push(userVolume);
  }, [userVolume]);

  return (
    <div className="relative inline-block">
      <canvas ref={canvas} width={width} height={height} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-[#6A48F2]/20 rounded-full flex items-center justify-center p-8 shadow-xl shadow-[#6A48F2]/40 relative before:content-[''] before:absolute before:inset-0 before:rounded-full before:shadow-inner transition-all duration-300 hover:shadow-2xl hover:before:shadow-lg hover:scale-105 hover:shadow-[#6A48F2]/50 hover:before:shadow-[#6A48F2]/40 hover:scale-105">
          <img src="/microphone.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default CircularVoiceIndicator;
