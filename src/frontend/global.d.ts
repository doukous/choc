export {}

declare global {
  type Pomodoro = {
      title: string,
      timers: {
          work: number,
          shortBreak: number,
          longBreak: number
      },
      numberOfSessions: number
  }
  
  interface Window {
    appWindowHandler: {
      setFocus: () => void
    }

    tray: {
      setTimerValue: (minute: number, second: number) => void
      onTrayAction: (callback: (action: string) => void) => void
      setMainIcon: () => void
    }
  }
}
