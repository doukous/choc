import { create } from "zustand";

type PomodoroStore = {
  pomodoroConfig: Pomodoro;
  changeConfig: (newConfig: Pomodoro) => void;
};

export const usePomodoroStore = create<PomodoroStore>((set) => ({
  pomodoroConfig: {
    title: "fallback",
    timers: {
      work: 25,
      shortBreak: 5,
      longBreak: 15,
    },
    numberOfSessions: 4,
  },

  changeConfig: (newConfig: Pomodoro) => set({ pomodoroConfig: newConfig }),
}));

type TitleBarVisibilityStore = {
  titleBarVisibility: boolean;
  showTitleBar: () => void;
  hideTitleBar: () => void;
};

export const useTitleBarVisibilityStore = create<TitleBarVisibilityStore>(
  (set) => ({
    titleBarVisibility: true,
    showTitleBar: () =>
      set(state => ({...state, titleBarVisibility: true })),
    hideTitleBar: () =>
      set(state => ({ ...state, titleBarVisibility: false })),
  })
);
