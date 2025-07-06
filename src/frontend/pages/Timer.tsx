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
        setTimer((prev) => ({...prev, minutes: pomodoroConfig.timers[PomodoroTimerStep[currentStep]]}))
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
                                break
                        }
                    }

                    else if (values.seconds === 0) {
                        values.seconds = 59
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

                <div>
                    <span className="text-5xl">{timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes}</span>
                    <span>{timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}</span>
                </div>

                <span>{sesssionsDone} / {pomodoroConfig.numberOfSessions} sessions</span>

                <div className="flex flex-col items-stretch gap-y-4 w-48">
                    <div className="flex justify-between gap-x-4">
                        {
                            ! isRunning ?
                            <Button onClick={handlePlay}>Play</Button>
                            :
                            <Button onClick={handlePause}>Pause</Button>
                        }
                        <Button onClick={handleReset}>Reset</Button>
                    </div>
                    <Button onClick={() => navigate('/')}>Cancel</Button>
                </div>
            </div>
        </div>
    )
}