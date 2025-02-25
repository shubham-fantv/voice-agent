"use client";
import dynamic from "next/dynamic";
import { Suspense, useState, useRef } from "react";
import { stsConfig } from "../lib/constants";
import {
  isConversationMessage,
  useVoiceBot,
  VoiceBotStatus,
} from "../context/VoiceBotContextProvider";
import { withBasePath } from "../utils/deepgramUtils";
import { isMobile } from "react-device-detect";
import { useStsQueryParams } from "../hooks/UseStsQueryParams";
import { useDeepgram } from "../context/DeepgramContextProvider";
import bg from "../images/bg.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Mic,
  Speaker,
  AudioLines,
  Globe2,
  MessageSquare,
  MessagesSquare,
  Play,
} from "lucide-react";
import ReactPlayer from "react-player";

// Dynamically import components
import { App } from "../components/App";
const Intelligence = dynamic(() => import("../components/Intelligence"), { ssr: false });
const PromptSuggestions = dynamic(() => import("../components/PromptSuggestions"), { ssr: false });
const Conversation = dynamic(() => import("../components/Conversation"), { ssr: false });
const VoiceSelector = dynamic(() => import("../components/VoiceSelector/VoiceSelector"), {
  ssr: false,
});
const PopupButton = dynamic(() => import("../components/PopupButton"), { ssr: false });
const MobileMenu = dynamic(() => import("../components/MobileMenu"), { ssr: false });
const Latency = dynamic(() => import("../components/Latency"), { ssr: false });
const InstructionInput = dynamic(() => import("../components/InstructionInput"), { ssr: false });
const BehindTheScenes = dynamic(() => import("../components/BehindTheScenes"), { ssr: false });
const Header = dynamic(() => import("../components/Header"), { ssr: false });
const CodeDisplay = dynamic(() => import("../components/CodeDisplay"), { ssr: false });

// Dynamically import icons
import { CaretIcon } from "../components/icons/CaretIcon";
import { PencilIcon } from "../components/icons/PencilIcon";
import { TerminalIcon } from "../components/icons/TerminalIcon";
import Image from "next/image";

const DesktopMenuItems = () => {
  const { instructions } = useStsQueryParams();
  return (
    <>
      <PopupButton
        buttonIcon={<PencilIcon />}
        buttonText={
          <span>Prompt {instructions && <span className="text-green-spring">*</span>}</span>
        }
        popupContent={<InstructionInput className="w-96" focusOnMount />}
        tooltipText={instructions ? "Using your custom prompt. Click to edit." : null}
      />
    </>
  );
};

export default function Home() {
  const { messages, status } = useVoiceBot();
  const { rateLimited } = useDeepgram();
  const [conversationOpen, setConversationOpen] = useState(false);
  const [behindTheScenesOpen, setBehindTheScenesOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hoveredStates, setHoveredStates] = useState<Record<number, boolean>>({});

  const handleMouseEnter = (index: number) => {
    setHoveredStates((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const handleMouseLeave = (index: number) => {
    setHoveredStates((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const toggleConversation = () => setConversationOpen(!conversationOpen);

  const has4ConversationMessages = messages.filter(isConversationMessage).length > 3;

  const industries = [
    {
      name: "Hotel Reception",
      description: "Automate guest inquiries, bookings, and concierge services.",
      image: "/hotel.png",
      video: "/videos/receptionist.mp4",
    },
    {
      name: "Dentist Booking",
      description: "Simplify appointment scheduling with AI-powered assistance.",
      image: "/dentist.png",
      video: "/videos/dentist.mp4",
    },
    // {
    //   name: "Healthcare",
    //   description:
    //     "Provide 24/7 patient support with voice-guided care and appointment management.",
    //   image: "/insurance.png",
    // },
    {
      name: "Insurance Sales",
      description: "Handle customer queries efficiently with AI-driven conversations.",
      image: "/insurance.png",
      video: "/videos/life-ensurance.mp4",
    },
    {
      name: "Real Estate Sales",
      description: "Engage buyers with virtual AI assistants for property tours and inquiries.",
      image: "/real-estate.png",
      video: "/videos/real-estate.mp4",
    },
    // {
    //   name: "Customer Support",
    //   description: "Deliver instant, humanlike responses to customer concerns.",
    //   image: "/insurance.png",
    // },
    // {
    //   name: "Entertainment",
    //   description: "Create immersive, character-driven voice experiences for games and media.",
    //   image: "/insurance.png",
    // },
    // {
    //   name: "E-commerce",
    //   description: "Increase conversions with personalized, voice-enabled shopping.",
    //   image: "/insurance.png",
    // },
    // {
    //   name: "Education",
    //   description: "Make learning dynamic with interactive AI voice tutors.",
    //   image: "/insurance.png",
    // },
  ];

  const scroll = (direction: "left" | "right"): void => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({
        left: amount,
        behavior: "smooth",
      });
    }
  };
  const useCases = [
    {
      name: "Real-Time Voice Generation",
      description: "Instant, natural conversations.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.35 9.65V11.35C4.35 15.57 7.78 19 12 19C16.22 19 19.65 15.57 19.65 11.35V9.65"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 19V22"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Customizable Voice Profiles",
      description: "Tailor voice tone, accent, and personality.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.2101 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.8201 15.13 19.2101 15.74Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Scalable API Integration",
      description: "Seamless integration into existing platforms.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 2V5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 2V5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 11H16"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 16H12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Multilingual Support",
      description: "Communicate globally with ease.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 3H9C7.05 8.84 7.05 15.16 9 21H8"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 3C16.95 8.84 16.95 15.16 15 21"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 9C8.84 7.05 15.16 7.05 21 9"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Emotionally Intelligent AI",
      description: "Voices that understand and respond with emotion.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 15C8.91304 16.2175 10.3796 17 12 17C13.6204 17 15.087 16.2175 16 15"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 10C9.55228 10 10 9.55228 10 9C10 8.44772 9.55228 8 9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10Z"
            fill="white"
          />
          <path
            d="M15 10C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8C14.4477 8 14 8.44772 14 9C14 9.55228 14.4477 10 15 10Z"
            fill="white"
          />
        </svg>
      ),
    },
  ];

  const capabilities = [
    {
      title: "Text-to-Speech (TTS)",
      description: "Rapid, lifelike voice creation for both low and high-volume needs.",
      icon: Speaker,
    },
    {
      title: "Speech-to-Text (STT)",
      description: "Capture speech with remarkable precision and minimal lag.",
      icon: Mic,
    },
    {
      title: "Audio Intelligence",
      description: "Enterprise-level audio analysis for better data-driven decision-making.",
      icon: AudioLines,
    },
    {
      title: "Multilingual Support",
      description:
        "Build voice interactions in over 25 languages, including English, Spanish, German, Hindi, and Portuguese.",
      icon: Globe2,
    },
    {
      title: "Natural Speech Flow",
      description:
        "Our AI knows how and when to stop talking, pause and listen, just like human conversations.",
      icon: MessageSquare,
    },
    {
      title: "Empower Seamless AI Conversations",
      description:
        "A powerful, voice-to-voice API designed to create lifelike, fluid interactions between humans and machines.",
      icon: MessagesSquare,
    },
  ];

  return (
    <>
      <main
        className="flex flex-col items-center justify-center h-full text-white"
        style={{
          backgroundImage: `
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 1)
      ),
      url(${bg.src})
    `,
          backgroundSize: "cover",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Suspense>
          {/* <Header logoHref={withBasePath("/")} /> */}
          <header className="w-[90%] p-2 flex justify-between items-center bg-black shadow-lg rounded-[100px] mt-4">
            <Image src={"/logo.svg"} alt="Voizy Logo" width={140} height={40} />
            {/* <nav>
              <ul className="flex space-x-4">
                <li>Platform</li>
                <li>Solutions</li>
                <li>Resources</li>
                <li>Pricing</li>
              </ul>
            </nav> */}
            <div className="flex flex-row space-x-2">
              <button className="px-4 py-2 bg-white hover:bg-gray-300 rounded-[100px] shadow-md  text-black font-bold transition-all">
                Launch App
              </button>
            </div>
          </header>
        </Suspense>

        <div className="flex flex-col flex-grow">
          <div className="flex-grow relative">
            {/* Main Content */}
            <div className="flex-1 flex justify-center items-start md:items-center">
              <div className="md:h-full flex flex-col min-w-[60vw] md:min-w-[20vw] max-w-[60vw] justify-center">
                {/* <div className="flex md:order-last md:mt-2 justify-center">
                  <Intelligence />
                </div> */}
                <Suspense>
                  <App
                    defaultStsConfig={stsConfig}
                    className="flex-shrink-0 h-64 items-end"
                    requiresUserActionToInitialize={isMobile}
                  />
                  <div className="flex flex-col items-center space-y-1 mt-2">
                    <p>Select Voice</p>
                    <Suspense>
                      <VoiceSelector className="flex justify-end items-center" />
                    </Suspense>
                  </div>
                </Suspense>

                {/* Desktop Conversation Toggle */}
                {has4ConversationMessages ? (
                  <div className="hidden md:flex justify-center mt-auto mb-4 md:mt-4 text-gray-350">
                    <button className="text-[14px] text-gray-350 py-4" onClick={toggleConversation}>
                      See full conversation <CaretIcon className="rotate-90 h-4 w-4" />
                    </button>
                  </div>
                ) : null}

                {/* Speech Bubbles */}
                {!has4ConversationMessages &&
                  !rateLimited &&
                  status !== VoiceBotStatus.SLEEPING &&
                  status !== VoiceBotStatus.NONE && (
                    <div>
                      {/* Desktop */}
                      <div className="hidden md:flex justify-center text-gray-450">Try saying:</div>
                      <div className="hidden md:grid max-w-max mx-auto grid-cols-3 gap-4 mt-6 relative">
                        <PromptSuggestions />
                      </div>
                      {/* Mobile */}
                      <div className="flex md:hidden justify-center text-gray-450 mt-2">
                        Try saying:
                      </div>
                      <div className="scrollable-element w-full flex md:hidden gap-4 items-center mt-4 overflow-x-auto -mr-10">
                        <PromptSuggestions />
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <main className="flex flex-col items-center mt-4 w-full max-w-4xl mx-auto mb-2">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-center text-white">
                Meet VOIZY
              </h1>
              <p className="text-lg text-center mb-6 p-2">
                Enabling live conversation across businesses
              </p>
              <div className="flex space-x-5 mb-4">
                <div className="bg-gradient-to-r from-[#FFFFFF] to-[#8162FF] p-[1px] rounded-full">
                  <button className="bg-[#6A48F2] rounded-full w-[160px] h-[43px] hover:bg-[#8162FF] transition-all">
                    Try Demo
                  </button>
                </div>
                <button className="">Read the docs</button>
              </div>
            </main>

            {/* Right Panel (Desktop only) */}
            {/* <div
            className="hidden md:block p-6 pl-0 max-h-screen overflow-hidden"
            style={{ zIndex: 11 }}
          >
            <div className="flex flex-col gap-4">
              {behindTheScenesOpen ? (
                <BehindTheScenes onClose={() => setBehindTheScenesOpen(false)} />
              ) : (
                <>
                  <button
                    className="w-full px-4 py-3 bg-gray-850 hover:bg-gray-800 text-gray-25 rounded-lg transition-colors flex items-center gap-2"
                    onClick={() => setBehindTheScenesOpen(true)}
                  >
                    <TerminalIcon className="w-5 h-5" />
                    <span className="font-medium flex-grow text-left">Backstage</span>
                    <CaretIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div> */}
            {/* Conversation */}
            {conversationOpen && <Conversation toggleConversation={toggleConversation} />}
          </div>
        </div>

        {/* Desktop Bottom Stuff */}
        <div className={`hidden md:flex z-0 absolute bottom-0 left-8 right-[320px] mb-8`}>
          <div className="space-y-4">
            <Suspense>
              <DesktopMenuItems />
            </Suspense>
          </div>
          <Suspense>
            <Latency />
          </Suspense>
        </div>

        {/* Mobile Bottom Stuff */}
        <div className={`flex flex-col z-0 items-center md:hidden`}>
          {has4ConversationMessages && (
            <div className="flex justify-center mt-auto text-gray-350">
              <button className="text-sm text-gray-350 pb-8" onClick={toggleConversation}>
                See full conversation <CaretIcon className="rotate-90 h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Voice Selector */}
        <Suspense>
          <VoiceSelector
            className={`absolute md:hidden bottom-0 left-0 pb-[16px] pl-[16px]`}
            collapsible
          />
          <MobileMenu className="fixed md:hidden bottom-4 right-4 text-gray-200" />
        </Suspense>
      </main>

      <div className="bg-black text-white min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Agents in Action</h1>
        <p className="text-md mb-8">
          Ready-to-Use AI Agents <br /> Tailored for Your Industry
        </p>

        <div className="mb-12 relative">
          {/* Left Navigation Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-2"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Carousel Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 justify-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {industries.map((industry, index) => (
              <div key={index} className="flex-none" style={{ width: "300px" }}>
                <div className="bg-gray-900 rounded-[24px] border-2 border-[#262626] h-full">
                  <div className="p-4 h-24">
                    <h3 className="text-white text-xl font-semibold mb-2">{industry.name}</h3>
                    <p className="text-gray-300 text-sm">{industry.description}</p>
                  </div>
                  <div
                    className="relative h-96 overflow-hidden rounded-b-[24px]"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <ReactPlayer
                      url={industry.video}
                      playing={hoveredStates[index]}
                      loop
                      width="100%"
                      height="100%"
                      className="absolute top-0 left-0"
                      config={{
                        file: {
                          attributes: {
                            preload: "auto",
                          },
                        },
                      }}
                    />

                    {!hoveredStates[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Play size={48} className="text-gray-700 bg-white rounded-full p-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-2"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-6">Key Features</h2>
        <p className="text-xl mb-8">
          What Makes Our AI Voice <br /> Tech Stand Out
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-[#262626]/0 via-[#6A48F2] to-[#262626]/0 p-[1px] rounded-[24px] hover:bg-[#6A48F2] transition-all duration-300"
            >
              <div className="bg-gray-900 p-6 rounded-[24px] border-2 border-[#262626]">
                <div className="text-4xl mb-4 w-fit p-2 bg-[#6A48F2]/30 border-2 border-[#6A48F2] rounded-[8px]">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{useCase.name}</h3>
                <p className="text-gray-400">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-6">Build, Deploy, Scale, Repeat</h2>
        <p className="text-xl mb-8">
          Transform Your Business <br /> with AI-Powered Conversations
        </p>

        <div className="w-full flex items-center justify-center mb-12">
          <CodeDisplay />
        </div>

        <h2 className="text-3xl font-bold mb-6">AI Capabilites</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="bg-gray-900 text-white rounded-lg shadow-md p-6 h-full hover:shadow-xl border border-gray-800 hover:border-[#6A48F2] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <capability.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">{capability.title}</h3>
              </div>
              <p className="text-gray-600">{capability.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 md:p-10 rounded-2xl shadow-lg w-full mx-2">
          <h2 className="text-center text-lg font-semibold text-gray-800 mb-6">Why Voizy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black text-white p-6 rounded-xl text-center">
              <h3 className="text-4xl font-bold">10,000+</h3>
              <p className="mt-2 text-sm font-medium">
                AI-generated conversations dailyAI-generated conversations daily
              </p>
              {/* <p className="mt-1 text-xs text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p> */}
            </div>
            <div className="bg-black text-white p-6 rounded-xl text-center">
              <h3 className="text-4xl font-bold">99.9% </h3>
              <p className="mt-2 text-sm font-medium">Realistic voice accuracy</p>
              {/* <p className="mt-1 text-xs text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p> */}
            </div>
            <div className="bg-black text-white p-6 rounded-xl text-center">
              <h3 className="text-4xl font-bold">50%+ </h3>
              <p className="mt-2 text-sm font-medium">Cost savings on customer support</p>
              {/* <p className="mt-1 text-xs text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
