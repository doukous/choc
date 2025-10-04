import { useState } from "react";
import { useNavigate } from "react-router";
import TimerCard from "../components/TimerCard";

const PomodoroTimerStep = {
  work: "work",
  shortBreak: "shortBreak",
  longBreak: "longBreak",
} as const;

type PomodoroStepType =
  (typeof PomodoroTimerStep)[keyof typeof PomodoroTimerStep];

export default function Timer() {
  const [sesssionsDone, setSessionsDone] = useState(1);
  const [currentStep, setCurrentStep] = useState<PomodoroStepType>(
    PomodoroTimerStep.work
  );
  const [pomodoroFinished, setPomodoroFinished] = useState(false);
  const navigate = useNavigate();

  function handleRestart() {
    setPomodoroFinished(false);
    setSessionsDone(1);
    setCurrentStep("work");
  }

  return (
    <>
      {!pomodoroFinished ? (
        <TimerCard
          setPomodoroFinished={setPomodoroFinished}
          sessionsDone={sesssionsDone}
          setSessionsDone={setSessionsDone}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          navigate={navigate}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-y-8">
          <h1>Session completed !</h1>
          <button className="btn" onClick={handleRestart}>Restart</button>
          <button className="btn" onClick={() => navigate("/")}>Quit</button>
        </div>
      )}
    </>
  );
}
