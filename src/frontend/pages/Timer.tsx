/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react"
import { NavLink } from "react-router"

const PomodoroTimerStep = {
    work: 'work',
    shortBreak: 'shortBreak',
    longBreak: 'longBreak'
} as const

type PomodoroStepType = (typeof PomodoroTimerStep)[keyof typeof PomodoroTimerStep]

type Pomodoro = {
    title: string,
    timers: {
        work: number,
        shortBreak: number,
        longBreak: number
    },
    numberOfSessions: number
}


const fallbackData = {
    title: 'fallback',
    timers: {
        work: 7,
        shortBreak: 3,
        longBreak: 4
    },
    numberOfSessions: 2
}

let pomodoroParams: Pomodoro = fallbackData
const sessionData: string | null = sessionStorage.getItem('pomodoro-params')
pomodoroParams = sessionData && JSON.parse(sessionData)


export default function Timer() {
    const [timer, setTimer] = useState({'minutes': 0, 'seconds': 0})
    const [isRunning, setIsRunning] = useState(false)
    const timerId : React.RefObject<null | NodeJS.Timeout> = useRef(null)
    
    const [sesssionsDone, setSessionsDone] = useState(0)
    const [currentStep, setCurrentStep] = useState<PomodoroStepType>(PomodoroTimerStep.work)

    function handlePlay() {
        setIsRunning(true)    
    }

    function handlePause() {
        setIsRunning(false)
    }

    function handleReset() {
        setIsRunning(false)
        setTimer((prev) => ({...prev, seconds: pomodoroParams.timers[PomodoroTimerStep[currentStep]]}))
    }

    useEffect(() => {
        window.tray.onTrayAction((action: string) => {
            switch (action) {
                case 'play':
                    handlePlay()
                    break
                
                case 'pause':
                    handlePause()
                    break
                
                case 'reset':
                    handleReset()
                    break
            }
        })
    }, [])

    useEffect(() => {
        window.tray.setTimerValue(timer.minutes, timer.seconds)
    }, [isRunning, timer])

    useEffect(() => {
        handleReset()
    }, [currentStep])


    useEffect(() => {
        if (isRunning) {
            timerId.current = setInterval(() => {
                setTimer(prev => {
                    const values = prev
                    
                    if (values.minutes === 0 && values.seconds === 0) {
                        window.appWindowHandler.setFocus()
                        switch (currentStep) {
                            case PomodoroTimerStep.work:
                                if (sesssionsDone === pomodoroParams.numberOfSessions) {
                                    setCurrentStep(PomodoroTimerStep.longBreak)
                                }

                                else {
                                    setCurrentStep(PomodoroTimerStep.shortBreak)
                                }
                                break
                            
                            case PomodoroTimerStep.shortBreak:
                                setSessionsDone(num => num + 0.5)
                                setCurrentStep(PomodoroTimerStep.work)
                                break
                            
                            case PomodoroTimerStep.longBreak:
                                break
                        }
                    }

                    else if (values.seconds === 0) {
                        values.seconds = 59
                    }

                    else {
                        values.seconds -= 0.5
                    }

                    return {...values}
                })
            }, 1000)
        }

        else if (timerId.current) {
            clearInterval(timerId.current)
        }

        return (() => {
            if (timerId.current) {
                clearInterval(timerId.current)
            }
        })
    }, [isRunning])

    return (
        <>
            <div>
                <h1>timer</h1>
                <div>
                    <span>{timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes}</span>
                    <span>:</span>
                    <span>{timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}</span>
                </div>
                <span>number of sessions done : {sesssionsDone}</span>
                <div>
                    <div>
                        {
                            ! isRunning ?
                            <button onClick={handlePlay}>play</button>
                            :
                            <button onClick={handlePause}>pause</button>
                        }
                        <button onClick={handleReset}>reset</button>
                    </div>
                    
                    <NavLink to="/">cancel</NavLink>
                </div>

            </div>
        </>
    )
}