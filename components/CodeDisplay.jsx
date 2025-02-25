"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const syntaxHighlight = (code) => {
  return code.split(/(\s+)/).map((word, index) => {
    // Keywords
    if (
      word.match(
        /\b(const|let|var|function|return|async|await|if|while|break|import|export|default|from)\b/,
      )
    ) {
      return (
        <span key={index} className="text-[#C678DD]">
          {word}
        </span>
      );
    }
    // Built-in objects and functions
    if (word.match(/\b(console|Promise|JSON|Math|Object|Array|String|RegExp|fetch|setTimeout)\b/)) {
      return (
        <span key={index} className="text-[#E5C07B]">
          {word}
        </span>
      );
    }
    // Function calls and declarations
    if (word.match(/\b\w+(?=\()/)) {
      return (
        <span key={index} className="text-[#61AFEF]">
          {word}
        </span>
      );
    }
    // Strings
    if (word.match(/(['"`]).*?\1/)) {
      return (
        <span key={index} className="text-[#98C379]">
          {word}
        </span>
      );
    }
    // Numbers
    if (word.match(/\b\d+\b/)) {
      return (
        <span key={index} className="text-[#D19A66]">
          {word}
        </span>
      );
    }
    // Python-specific keywords
    if (word.match(/\b(def|ctx|await|auto_subscribe|True)\b/)) {
      return (
        <span key={index} className="text-[#C678DD]">
          {word}
        </span>
      );
    }
    // Comments
    if (word.startsWith("//")) {
      return (
        <span key={index} className="text-gray-500">
          {word}
        </span>
      );
    }
    return word;
  });
};

const CodeDisplay = () => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTabId, setActiveTabId] = useState("components");

  const tabs = [
    {
      id: "app",
      name: "app.jsx",
      code: `import React from "react";\n\nexport default function App() {\n    return <h1>Hello, World!</h1>;\n}`,
    },
    {
      id: "components",
      name: "components.tsx",
      code: `import React from 'react'\n\nconst Home = () => {\n    return (\n        <div>Home</div>\n    )\n}\n\nexport default Home`,
    },
    {
      id: "stream",
      name: "stream.jsx",
      code: `async function startStream() {\n    const response = await fetch("/api/stream");\n    const reader = response.body.getReader();\n    \n    while (true) {\n        const { done, value } = await reader.read();\n        if (done) break;\n        console.log(new TextDecoder().decode(value));\n    }\n}`,
    },
    {
      id: "ai-generate",
      name: "ai-generate.jsx",
      code: `async def entrypoint(ctx: JobContext):\n    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)\n    \n    agent = VoicePipelineAgent(\n        vad=silero.VAD.load(),\n        stt=deepgram.STT(),\n        llm=openai.LLM(),\n        tts=openai.TTS(),\n        allow_interruptions=True,\n    )\n    \n    participant = await ctx.wait_for_participant()\n    agent.start(ctx.room, participant)\n`,
    },
  ];

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  useEffect(() => {
    if (!activeTab) return;
    setDisplayedCode("");
    setCurrentIndex(0);
  }, [activeTabId]);

  useEffect(() => {
    if (!activeTab) return;
    if (currentIndex < activeTab.code.length) {
      const timer = setTimeout(() => {
        setDisplayedCode((prev) => prev + activeTab.code[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, activeTab]);

  return (
    <div className="w-full max-w-4xl h-[480px] bg-[#1E1E1E] rounded-lg overflow-hidden shadow-2xl flex flex-col border border-gray-800">
      {/* Tab Bar */}
      <div className="flex items-center bg-[#252526] border-b border-gray-800 px-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`px-4 py-3 text-sm transition-all relative ${
              activeTabId === tab.id ? "text-white" : "text-gray-400 hover:text-gray-200"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {activeTabId === tab.id && (
              <div className="absolute inset-0 bg-[#1E1E1E] border-t-2 border-t-blue-500 z-0" />
            )}
            <span className="relative z-10">{tab.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Code Display */}
      <div className="p-6 font-mono text-sm overflow-auto flex-1 bg-[#1E1E1E]">
        <motion.div
          key={activeTabId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.1 }}
          className="relative"
        >
          {displayedCode.split("\n").map((line, index) => (
            <div key={index} className="flex group">
              <div className="w-12 text-right pr-4 text-gray-600 select-none group-hover:text-gray-500 transition-colors">
                {index + 1}
              </div>
              <div className="flex-1 text-gray-300">
                <pre className="inline">{syntaxHighlight(line)}</pre>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CodeDisplay;
