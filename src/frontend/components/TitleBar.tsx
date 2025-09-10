import { useTitleBarVisibilityStore } from "@/store";
import type { CSSProperties } from "react";
import { Button } from "./ui/button";
import { Square, X, Minus } from "lucide-react";

export default function TitleBar() {
  const { titleBarVisibility } = useTitleBarVisibilityStore();
  return (
    titleBarVisibility && (
      <div
        className="h-8 border-b-1 border-black px-2 flex justify-end items-center"
        style={{ WebkitAppRegion: "drag" } as CSSProperties}
      >
        <div className="flex gap-x-4" style={{ WebkitAppRegion: "no-drag" } as CSSProperties}>
          <Button
            onClick={() => window.appWindowHandler.minimize()}
            size="icon"
            variant="ghost"
            className="size-6"
          >
            <Minus />
          </Button>
          <Button
            onClick={() => window.appWindowHandler.toggleSize()}
            size="icon"
            variant="ghost"
            className="size-6"
          >
            <Square />
          </Button>
          <Button
            onClick={() => window.appWindowHandler.close()}
            size="icon"
            variant="ghost"
            className="size-6"
          >
            <X />
          </Button>
        </div>
      </div>
    )
  );
}
