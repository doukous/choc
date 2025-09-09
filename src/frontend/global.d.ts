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
  }
}
