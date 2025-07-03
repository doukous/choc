export {}

declare global {
  interface Window {
    appWindowHandler: {
      setFocus: () => void
    }

    tray: {
      setTimerValue: (minute: number, second: number) => void
      onTrayAction: (callback: (action: string) => void) => void
    }
  }
}
