import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { usePomodoroStore } from "../store"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"


export default function Home() {
  const navigate = useNavigate()
  const {  changeConfig } = usePomodoroStore()

  const [workTime, setWorkTime] = useState(25)
  const [shortBreakTime, setShortBreakTime] = useState(5)
  const [longBreakTime, setLongBreakTime] = useState(15)
  const [sessionsNumber, setSessionsNumber] = useState(4)

  function goToTimer() {
    const data: Pomodoro = {
      title: 'default',
      timers: {
        work: workTime,
        shortBreak: shortBreakTime,
        longBreak: longBreakTime,
      },
      numberOfSessions: sessionsNumber
    }

    changeConfig(data)
    navigate("/timer")
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-y-8">
      <div className="flex flex-col w-full gap-y-8">
        <div className="flex flex-col items-center gap-x-16">
          <label htmlFor="work-time">Work time</label>

          <div className="flex items-center w-md gap-x-4 justify-between">
            <Slider 
              min={5} 
              max={120} 
              defaultValue={[workTime]}
              step={1}
              onValueChange={(val) => (setWorkTime(val[0]))}
              className="w-90"
              name="work-time"
            />
            <span>{workTime} min</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="short-break-time">Short break time</label>

          <div className="flex items-center w-md gap-x-4 justify-between">
            <Slider 
              min={1} 
              max={30}
              step={1} 
              defaultValue={[shortBreakTime]}
              onValueChange={(val) => (setShortBreakTime(val[0]))}
              className="w-90"
              name="work-time"
            />
            <span>{shortBreakTime} min</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="long-break-time">Long break time</label>

          <div className="flex items-center w-md gap-x-4 justify-between">
            <Slider 
              min={5} 
              max={60}
              step={1} 
              value={[longBreakTime]}
              onValueChange={(val) => (setLongBreakTime(val[0]))}
              className="w-90"
              name="long-break-time"
            />
            <span>{longBreakTime} min</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label htmlFor="num-of-sessions">Number of sessions</label>

          <div className="flex items-center w-md gap-x-4 justify-between">
            <Slider 
              min={2} 
              max={8} 
              defaultValue={[sessionsNumber]}
              onValueChange={(val) => (setSessionsNumber(val[0]))}
              className="w-90"
              name="num-of-sessions"
            />
            <span>{sessionsNumber} sessions</span>
          </div>
        </div>
      </div>

      <Button onClick={goToTimer}>Start pomodoro</Button>
    </div>
  )
}