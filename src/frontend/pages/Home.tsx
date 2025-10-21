import { useState } from "react";
import { useNavigate } from "react-router";
import { usePomodoroStore } from "../store";

export default function Home() {
  const navigate = useNavigate();
  const { changeConfig, pomodoroConfig } = usePomodoroStore();

  const [workTime, setWorkTime] = useState(pomodoroConfig.timers.work);
  const [shortBreakTime, setShortBreakTime] = useState(
    pomodoroConfig.timers.shortBreak
  );
  const [longBreakTime, setLongBreakTime] = useState(
    pomodoroConfig.timers.longBreak
  );
  const [sessionsNumber, setSessionsNumber] = useState(
    pomodoroConfig.numberOfSessions
  );

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
              value={workTime}
              onChange={(event) => setWorkTime(Number(event.target.value))}
              className="w-90 range range-xs"
              name="work-time"
              id="work-time"
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
              value={shortBreakTime}
              onChange={(event) =>
                setShortBreakTime(Number(event.target.value))
              }
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
              value={longBreakTime}
              onChange={(event) => setLongBreakTime(Number(event.target.value))}
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
              value={sessionsNumber}
              onChange={(event) =>
                setSessionsNumber(Number(event.target.value))
              }
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
