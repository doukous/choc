import { useState } from "react"
import { useNavigate } from "react-router"

export default function Home() {
  const navigate = useNavigate()
  const [workTime, setWorkTime] = useState(25)
  const [shortBreakTime, setShortBreakTime] = useState(5)
  const [longBreakTime, setLongBreakTime] = useState(15)
  const [sessionsNumber, setSessionsNumber] = useState(4)


  function goToTimer() {
    const data = {
      title: 'default',
      timers: {
        work: workTime,
        shortBreak: shortBreakTime,
        longBreak: longBreakTime,
      },
      numberOfSessions: sessionsNumber
    }

    sessionStorage.setItem('pomodoro-params', JSON.stringify(data))
    
    navigate("/timer")
  }

  return (
    <>
      <div>
        <label htmlFor="work-time">work time : </label>
        <input 
          type="range" 
          min='5' 
          max='120' 
          value={workTime}
          onChange={e => setWorkTime(parseInt(e.target.value))}
          name="work-time"
        />
        <span>{workTime} min</span>

        <label htmlFor="short-break-time">short break time : </label>
        <input 
          type="range" 
          min='1' 
          max='30' 
          value={shortBreakTime}
          onChange={e => setShortBreakTime(parseInt(e.target.value))}
          name="work-time"
        />
        <span>{shortBreakTime} min</span>

        <label htmlFor="long-break-time">long break time : </label>
        <input 
          type="range" 
          min='5' 
          max='60' 
          value={longBreakTime}
          onChange={e => setLongBreakTime(parseInt(e.target.value))}
          name="long-break-time"
        />
        <span>{longBreakTime} min</span>

        <label htmlFor="num-of-sessions">number of sessions : </label>
        <input 
          type="range" 
          min='2' max='8' 
          value={sessionsNumber}
          onChange={e => setSessionsNumber(parseInt(e.target.value))}
          name="num-of-sessions"
        />
        <span>{sessionsNumber} sessions</span>
      </div>

      <button onClick={goToTimer}>launch pomodoro</button>
    </>
  )
}