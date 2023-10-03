"use client";

import { useCallback, useContext, useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { AvatarStateContext } from "@/app/context/avatarState";

// @refresh reset

interface RiveOptionButtonProps {
  artboardName: string;
  optionIdx: number;
}

const STATE_MACHINE_NAME = "State Machine 1";

/**
 * Reusable component for a character feature option button (i.e. mustache and beard for facial hair feature)
 */
export default function RiveOptionButton({
  artboardName,
  optionIdx,
}: RiveOptionButtonProps) {
  const mainName = artboardName.replace("Button", "");

  const {
    state: { riveAvatarSelections },
    setRiveAvatarSelection,
  } = useContext(AvatarStateContext);

  const selectionValue = riveAvatarSelections[mainName];

  const { rive, RiveComponent } = useRive({
    src: "./avatar_demo.riv",
    artboard: artboardName,
    stateMachines: [STATE_MACHINE_NAME],
    autoplay: true,
    shouldDisableRiveListeners: true,
  });

  const isHovered = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "isBoxHover"
  );

  const isIconActive = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "isIconActive",
    selectionValue === optionIdx
  );

  const numOption = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "numOption",
    optionIdx
  );

  useEffect(() => {
    if (rive && numOption && isIconActive) {
      isIconActive.value = selectionValue === numOption.value;
    }
  }, [selectionValue, rive, numOption, isIconActive]);

  const onFocus = useCallback(() => {
    if (rive && isHovered) {
      isHovered.value = true;
    }
  }, [rive, isHovered]);

  const onBlur = useCallback(() => {
    if (rive && isHovered) {
      isHovered.value = false;
    }
  }, [rive, isHovered]);

  const onClick = useCallback(() => {
    if (rive && numOption) {
      setRiveAvatarSelection(mainName, numOption.value);
    }
  }, [rive, numOption, setRiveAvatarSelection, mainName]);

  return (
    <button
      className={`exp-option-button aspect-[21/16] min-w-[150px] opacity-100`}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
    >
      <RiveComponent />
    </button>
  );
}
