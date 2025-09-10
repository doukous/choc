import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import TimerCard from "@/components/timer/TimerCard";

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
          <Button onClick={handleRestart}>Restart</Button>
          <Button onClick={() => navigate("/")}>Quit</Button>
        </div>
      )}
    </>
  );
}
