import { useTitleBarVisibilityStore } from "../store";
import type { CSSProperties } from "react";
import { Square, X, Minus } from "lucide-react";

export default function TitleBar() {
  const { titleBarVisibility } = useTitleBarVisibilityStore();
  return (
    titleBarVisibility && (
      <div
        className="h-8 border-b-2 border-gray-200 px-2 flex justify-end items-center"
        style={{ WebkitAppRegion: "drag" } as CSSProperties}
      >
        <div
          className="flex gap-x-4"
          style={{ WebkitAppRegion: "no-drag" } as CSSProperties}
        >
          <button
            onClick={() => window.appWindowHandler.minimize()}
            className="size-5 btn p-0 pt-1"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => window.appWindowHandler.toggleSize()}
            className="size-5 btn p-0"
          >
            <Square size={14} />
          </button>
          <button
            onClick={() => window.appWindowHandler.close()}
            className="size-5 btn p-0"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    )
  );
}
