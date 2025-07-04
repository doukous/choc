import { create } from "zustand"

type PomodoroStore = {
    pomodoroConfig: Pomodoro,
    changeConfig: (newConfig: Pomodoro) => void
}

export const usePomodoroStore = create<PomodoroStore>((set) => ({
        pomodoroConfig: {
            title: 'fallback',
            timers: {
                work: 7,
                shortBreak: 3,
                longBreak: 4
            },
            numberOfSessions: 2
        },

        changeConfig: (newConfig: Pomodoro) => set({pomodoroConfig: newConfig})
    })
)