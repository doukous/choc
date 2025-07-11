export {}

declare global {
  interface Pomodoro {
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
      initStartingTimerTray: (minute: number, second: number) => void
      setTimerValue: (minute: number, second: number) => void
      onTrayAction: (callback: (action: string) => void) => void
      setMainIcon: () => void
    }
  }
}
