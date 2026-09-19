import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, HelpCircle, Navigation, Eye, Route } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasCompletedRef = useRef<boolean>(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [seconds, setSeconds] = useState<number>(0);
  const DURATION_SECONDS = 10.0;

  const handleFinish = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    if (onCompleteRef.current) {
      onCompleteRef.current();
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Safe fallback for autoplay restrictions
      });
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setSeconds(Math.min(DURATION_SECONDS, elapsed));
      if (elapsed >= DURATION_SECONDS) {
        clearInterval(interval);
        handleFinish();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 4 sequential steps displayed "one after one" across the 10 seconds:
  // Step 1 (0.0s - 2.5s): Problem question
  // Step 2 (2.5s - 5.0s): Introduction question: What is MargaMetra?
  // Step 3 (5.0s - 7.5s): Continuous Optical Surveillance
  // Step 4 (7.5s - 10.0s): Smart Route Guidance Solution
  const step =
    seconds < 2.5 ? 1 : seconds < 5.0 ? 2 : seconds < 7.5 ? 3 : 4;

  const stepsMeta = [
    {
      step: 1,
      tag: 'COMMUTER CHALLENGE',
      icon: HelpCircle,
      title: 'Stuck in unexpected highway congestion?',
      description:
        'Unforeseen bottlenecks and peak-hour slowdowns delay thousands of daily commuters.',
    },
    {
      step: 2,
      tag: 'ABOUT MARGAMETRA',
      icon: Navigation,
      title: 'What is MargaMetra?',
      description:
        'An AI-driven Intelligent Urban Traffic & Congestion Management System built for arterial highways.',
    },
    {
      step: 3,
      tag: 'REAL-TIME DETECTION',
      icon: Eye,
      title: 'Continuous Optical Surveillance',
      description:
        'Analyzes lane density and flow velocity in real time to detect bottlenecks before gridlock occurs.',
    },
    {
      step: 4,
      tag: 'AUTONOMOUS GUIDANCE',
      icon: Route,
      title: 'Smart Route Guidance & Bypass',
      description:
        'Dynamically redirects vehicles into clear alternative corridors for faster, safer journeys.',
    },
  ];

  const currentStep = stepsMeta[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <motion.div
      id="video-intro-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* ========================================================================= */}
      {/* BACKGROUND VIDEO: 100% Raw, Sharp, Crystal Clear (NO BLUR, NO TINT, NO BOX)*/}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/intro-poster.jpg"
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/intro-10s.mp4" type="video/mp4" />
          <source src="/intro-video.mp4" type="video/mp4" />
          <source
            src="https://videos.pexels.com/video-files/2103099/2103099-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* ========================================================================= */}
      {/* TOP HEADER: Brand title and skip button                                   */}
      {/* ========================================================================= */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 pt-6">
        <div className="flex items-center gap-2.5 [text-shadow:_0_2px_6px_rgba(0,0,0,1)]">
          <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/20 flex items-center justify-center text-white">
            <Navigation className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="text-sm font-black tracking-widest text-white uppercase block leading-none">
              MargaMetra
            </span>
            <span className="text-[10px] text-white/80 font-mono tracking-wider">
              AI TRAFFIC INTELLIGENCE
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFinish}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 hover:bg-black/85 active:scale-95 text-white text-xs font-semibold border border-white/30 transition-all cursor-pointer shadow-lg"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </button>
      </header>

      {/* ========================================================================= */}
      {/* PURE TEXT PRESENTATION: ZERO BACKGROUND BOX, ZERO BLUR, PURE CLARITY      */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-end pb-10 sm:pb-16 px-6 sm:px-12 text-center pointer-events-none">
        <div className="w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`intro-step-${step}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col items-center text-center space-y-2 [text-shadow:_0_2px_8px_rgba(0,0,0,1),_0_0_2px_rgba(0,0,0,1),_0_4px_16px_rgba(0,0,0,0.95)]"
            >
              {/* Category Label (Pure clean text, NO BOX) */}
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-white uppercase">
                <StepIcon className="w-3.5 h-3.5 text-white" />
                <span>{currentStep.tag}</span>
                <span className="text-white/40">|</span>
                <span>0{step} OF 04</span>
              </div>

              {/* Crystal Clear Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {currentStep.title}
              </h1>

              {/* Informative Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-white font-medium max-w-xl mx-auto leading-relaxed">
                {currentStep.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* BOTTOM FOOTER: Minimal Timeline & Step Dots (NO BOX)                      */}
      {/* ========================================================================= */}
      <footer className="relative z-20 px-6 sm:px-10 pb-5 flex items-center justify-between pointer-events-none font-mono text-xs text-white [text-shadow:_0_2px_4px_rgba(0,0,0,1)]">
        {/* Remaining Time */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-semibold text-white/90">
            {seconds.toFixed(1)}s / 10.0s
          </span>
        </div>

        {/* 4 Clean Step Bars */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {stepsMeta.map((item) => (
            <div
              key={item.step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === item.step
                  ? 'w-8 sm:w-10 bg-white shadow-[0_0_8px_rgba(255,255,255,1)]'
                  : step > item.step
                  ? 'w-3.5 sm:w-4 bg-white/70'
                  : 'w-3.5 sm:w-4 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Step Counter */}
        <div className="font-semibold text-white/90">
          STEP <span className="text-white font-bold">0{step}</span> / 04
        </div>
      </footer>
    </motion.div>
  );
};
