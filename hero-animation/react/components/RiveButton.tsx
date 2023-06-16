import { useCallback } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export default function RiveButton() {
  const { rive, RiveComponent } = useRive({
    src: "/hero_use_case.riv",
    artboard: "Button",
    stateMachines: "State Machine 1",
    autoplay: true,
    shouldDisableRiveListeners: true,
  });

  const isHoverInput = useStateMachineInput(rive, "State Machine 1", "isHover");

  const onButtonActivate = useCallback(() => {
    if (rive && isHoverInput) {
      isHoverInput.value = true;
    }
  }, [rive, isHoverInput]);

  const onButtonDeactivate = useCallback(() => {
    if (rive && isHoverInput) {
      isHoverInput.value = false;
    }
  }, [rive, isHoverInput]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <h1
        className="text-white text-5xl lg:text-6xl pb-2"
        style={{ textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)" }}
      >
        Explore
      </h1>
      <div className="rive-button-container relative w-3/4 pt-[37.88%] mx-auto">
        <div className="absolute top-0 left-0 bottom-0 right-0">
          <a
            href="https://rive.app"
            aria-label="Start now; explore the Rive.app homepage"
            className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center w-full h-full bg-transparent text-white text-sm lg:text-lg"
            style={{ textShadow: "1px 1px 1px rgba(0, 0, 0, 0.5)" }}
            onMouseEnter={onButtonActivate}
            onMouseLeave={onButtonDeactivate}
            onFocus={onButtonActivate}
            onBlur={onButtonDeactivate}
          >
            START NOW
          </a>
          <RiveComponent aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
