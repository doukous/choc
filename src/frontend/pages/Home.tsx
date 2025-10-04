import { useState } from "react";
import { useNavigate } from "react-router";
import { usePomodoroStore } from "../store";

export default function Home() {
  const navigate = useNavigate();
  const { changeConfig } = usePomodoroStore();

  const workTime = useState(25)[0];
  const shortBreakTime = useState(5)[0];
  const longBreakTime = useState(15)[0];
  const sessionsNumber = useState(4)[0];

  function goToTimer() {
    const data: Pomodoro = {
      title: "default",
      timers: {
        work: workTime,
        shortBreak: shortBreakTime,
        longBreak: longBreakTime,
      },
      numberOfSessions: sessionsNumber,
    };

    changeConfig(data);
    navigate("/timer");
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full gap-y-8">
      <div className="flex flex-col w-full gap-y-8">
        <div className="flex flex-col items-center gap-x-16">
          <label htmlFor="work-time">Work time</label>

          <div className="flex items-center w-md gap-x-4 justify-between">
            <input
              type="range"
              min={5}
              max={120}
              step={1}
              className="w-90 range range-xs"
              name="work-time"
            />
            <span>{workTime} min</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="short-break-time">Short break time</label>

          <div className="flex items-center w-md gap-x-4 justify-between">
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              className="w-90 range range-xs"
              name="work-time"
            />
            <span>{shortBreakTime} min</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="long-break-time">Long break time</label>

          <div className="flex items-center w-md gap-x-4 justify-between">
            <input
              type="range"
              min={5}
              max={60}
              step={1}
              className="w-90 range range-xs"
              name="long-break-time"
            />
            <span>{longBreakTime} min</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="num-of-sessions">Number of sessions</label>

          <div className="flex items-center w-md gap-x-4 justify-between">
            <input
              type="range"
              min={2}
              max={8}
              className="w-90 range range-xs"
              name="num-of-sessions"
            />
            <span>{sessionsNumber} sessions</span>
          </div>
        </div>
      </div>

      <button className="btn" onClick={goToTimer}>
        Start pomodoro
      </button>
    </div>
  );
}
