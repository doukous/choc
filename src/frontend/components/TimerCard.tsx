import { useState, useRef, useEffect } from "react";
import type { Dispatch, SetStateAction, CSSProperties } from "react";
import type { NavigateFunction } from "react-router";
import { usePomodoroStore, useTitleBarVisibilityStore } from "../store";
import {
  Play,
  Pause,
  Expand,
  Grip,
  RotateCcw,
  SkipForward,
  Shrink,
} from "lucide-react";

const PomodoroTimerStep = {
  work: "work",
  shortBreak: "shortBreak",
  longBreak: "longBreak",
} as const;

const stepDisplay = {
  work: "work",
  shortBreak: "short break",
  longBreak: "long break",
} as const;

type PomodoroStepType =
  (typeof PomodoroTimerStep)[keyof typeof PomodoroTimerStep];

interface CardProps {
  setPomodoroFinished: Dispatch<SetStateAction<boolean>>;
  sessionsDone: number;
  setSessionsDone: Dispatch<SetStateAction<number>>;
  currentStep: PomodoroStepType;
  setCurrentStep: Dispatch<SetStateAction<PomodoroStepType>>;
  navigate: NavigateFunction;
}

export default function TimerCard({
  setPomodoroFinished,
  sessionsDone,
  setSessionsDone,
  currentStep,
  setCurrentStep,
  navigate,
}: CardProps) {
  const { pomodoroConfig } = usePomodoroStore();
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const timerId: React.RefObject<null | NodeJS.Timeout> = useRef(null);

  const { showTitleBar, hideTitleBar } = useTitleBarVisibilityStore();
  const [isShrinked, setIsShrinked] = useState(false);

  function toggleShrinking() {
    setIsShrinked(prev => !prev);

    if (isShrinked) {
      window.appWindowHandler.extend();
      showTitleBar();
    }

    else {
      window.appWindowHandler.shrink()
      hideTitleBar();  
    };
  }

  function handlePlay() {
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleSkip() {
    switch (currentStep) {
      case "work":
        if (sessionsDone < pomodoroConfig.numberOfSessions)
          setCurrentStep("shortBreak");
        else setCurrentStep("longBreak");
        break;
      case "shortBreak":
        setSessionsDone((prev) => prev + 1);
        setCurrentStep("work");
        break;
      case "longBreak":
        setPomodoroFinished(true);
        break;
    }
  }

  function handleReset() {
    setIsRunning(false);
    setTimer(() => ({
      minutes: pomodoroConfig.timers[PomodoroTimerStep[currentStep]],
      seconds: 0,
    }));
  }

  useEffect(() => {
    handleReset();
  }, [currentStep]);

  useEffect(() => {
    if (isRunning) {
      timerId.current = setInterval(() => {
        setTimer(prev => {
          const values = { ...prev };

          if (values.minutes === 0 && values.seconds === 0) {
            window.appWindowHandler.setFocus();
            setIsShrinked(false)
            window.appWindowHandler.extend()
            showTitleBar()
            
            switch (currentStep) {
              case PomodoroTimerStep.work:
                if (sessionsDone === pomodoroConfig.numberOfSessions) {
                  setCurrentStep(PomodoroTimerStep.longBreak);
                } else {
                  setCurrentStep(PomodoroTimerStep.shortBreak);
                }
                break;

              case PomodoroTimerStep.shortBreak:
                setSessionsDone(num => num + 1);
                setCurrentStep(PomodoroTimerStep.work);
                break;

              case PomodoroTimerStep.longBreak:
                setPomodoroFinished(true);
                break;
            }
          } else if (values.seconds === 0) {
            values.seconds = 59;
            values.minutes -= 1;
          } else {
            values.seconds -= 1;
          }

          return { ...values };
        });
      }, 1000);
    } else if (timerId.current) {
      clearInterval(timerId.current);
    }

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, [isRunning]);

  return isShrinked ? (
    <div className="p-2 flex gap-x-2 justify-between">
      <div className="flex gap-x-1 items-center">
        <span className="badge ring-1 ring-gray-200 text-xs text-center font-semibold w-24 h-full">{stepDisplay[currentStep]}</span>
        <div>
          <span className="text-4xl">
            {timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes}
          </span>
          <span>
            {timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
          </span>
        </div>
      </div>
      <div className="flex gap-x-2 items-center">
        {!isRunning ? (
          <button className="btn p-2 size-9 rounded-xl" onClick={handlePlay}>
            <Play size={14} />
          </button>
        ) : (
          <button className="btn p-2 size-9 rounded-xl" onClick={handlePause}>
            <Pause size={14}  />
          </button>
        )}
        <button className="btn p-2 size-9 rounded-xl" onClick={toggleShrinking}>
          <Expand size={14} />
        </button>
        <button className="btn p-2 size-9 rounded-xl" style={{ WebkitAppRegion: "drag" } as CSSProperties}>
          <Grip size={14} />
        </button>
      </div>
    </div>
  ) 
  : 
  (
    <div className="flex-1 flex flex-col justify-center items-center gap-y-6">
      <span className="ring-1 ring-gray-400 px-3 py-0.2 rounded-xl">{stepDisplay[currentStep]}</span>
      <div>
        <span className="text-5xl">
          {timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes}
        </span>
        <span>{timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}</span>
      </div>

      <span>
        {sessionsDone} / {pomodoroConfig.numberOfSessions} sessions
      </span>
      <div className="grid grid-cols-3 gap-4">
        {!isRunning ? (
          <button className="btn" onClick={handlePlay}>
            <Play />
          </button>
        ) : (
          <button className="btn" onClick={handlePause}>
            <Pause />
          </button>
        )}
        <button className="btn" onClick={handleReset}>
          <RotateCcw />
        </button>
        <button className="btn" onClick={handleSkip}>
          <SkipForward />
        </button>
        <button className="btn" onClick={toggleShrinking}>
          <Shrink />
        </button>
        <button className="col-span-2 btn btn-error" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
}
