/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react"
import { usePomodoroStore } from "../store"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

const PomodoroTimerStep = {
    work: 'work',
    shortBreak: 'shortBreak',
    longBreak: 'longBreak'
} as const

type PomodoroStepType = (typeof PomodoroTimerStep)[keyof typeof PomodoroTimerStep]

export default function Timer() {
    const { pomodoroConfig } = usePomodoroStore()
    const navigate = useNavigate()

    const [timer, setTimer] = useState({'minutes': 0, 'seconds': 0})
    const [isRunning, setIsRunning] = useState(false)
    const timerId : React.RefObject<null | NodeJS.Timeout> = useRef(null)
    
    const [sesssionsDone, setSessionsDone] = useState(1)
    const [currentStep, setCurrentStep] = useState<PomodoroStepType>(PomodoroTimerStep.work)
    const [pomodoroFinished, setPomodoroFinished] = useState(false)

    function handlePlay() {
        setIsRunning(true)    
    }

    function handlePause() {
        setIsRunning(false)
    }

    function handleSkip() {
        switch (currentStep) {
            case "work":
                if (sesssionsDone < pomodoroConfig.numberOfSessions)
                    setCurrentStep('shortBreak')
                else
                    setCurrentStep('longBreak')
                break
            case "shortBreak":
                setSessionsDone(prev => prev + 1)
                setCurrentStep('work')
                break
            case "longBreak":
                setPomodoroFinished(true)
                break
        }
    }

    function handleReset() {
        setIsRunning(false)
        setTimer(() => ({minutes: pomodoroConfig.timers[PomodoroTimerStep[currentStep]], seconds: 0}))
    }

    function handleRestart() {
        setPomodoroFinished(false)
        setSessionsDone(1)
        setCurrentStep('work')
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
        window.tray.initStartingTimerTray(timer.minutes, timer.seconds)
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
                                if (sesssionsDone === pomodoroConfig.numberOfSessions) {
                                    setCurrentStep(PomodoroTimerStep.longBreak)
                                }

                                else {
                                    setCurrentStep(PomodoroTimerStep.shortBreak)
                                }
                                break
                            
                            case PomodoroTimerStep.shortBreak:
                                setSessionsDone(num => num + 1)
                                setCurrentStep(PomodoroTimerStep.work)
                                break
                            
                            case PomodoroTimerStep.longBreak:
                                setPomodoroFinished(true)
                                break
                        }
                    }

                    else if (values.seconds === 0) {
                        values.seconds = 59
                        values.minutes -= 1
                    }

                    else {
                        values.seconds -= 1
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
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex flex-col items-center gap-y-6">
                <h1>Timer</h1>
                {
                    ! pomodoroFinished ?
                
                    <>
                        <div>
                            <span className="text-5xl">{timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes}</span>
                            <span>{timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}</span>
                        </div>

                        <span>{sesssionsDone} / {pomodoroConfig.numberOfSessions} sessions</span>

                        <div className="flex flex-col items-stretch gap-y-4 w-64">
                            <div className="flex justify-between gap-x-4">
                                {
                                    ! isRunning ?
                                    <Button onClick={handlePlay}>Play</Button>
                                    :
                                    <Button onClick={handlePause}>Pause</Button>
                                }
                                <Button onClick={handleReset}>Reset</Button>
                                <Button onClick={handleSkip}>Skip</Button>
                            </div>
                            <Button onClick={() => navigate('/')}>Cancel</Button>
                        </div>
                    </>
                    :
                    <>
                        <h2>Session completed !</h2>
                        <Button onClick={handleRestart}>Restart</Button>
                        <Button onClick={() => navigate('/')}>Quit</Button>
                    </>
                }
            </div>
        </div>
    )
}