"use client";

import { useContext, useCallback, useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { AvatarStateContext } from "@/app/context/avatarState";

// @refresh reset

interface RiveIconButtonProps {
  artboardName: string;
}

const STATE_MACHINE_NAME = "State Machine 1";

/**
 * Reusable component for the character feature icons that users can click to see
 * a list of options for that feature (i.e. Facial Hair, Body Color, etc.)
 */
export default function RiveIconButton({ artboardName }: RiveIconButtonProps) {
  const {
    state: { activeIcon, riveAvatarSelections },
    setActiveIcon,
  } = useContext(AvatarStateContext);

  const { rive, RiveComponent } = useRive({
    src: "./avatar_demo.riv",
    artboard: artboardName,
    stateMachines: [STATE_MACHINE_NAME],
    autoplay: true,
    shouldDisableRiveListeners: true,
  });

  const strippedDownName = artboardName.replace("Icon", "");

  const isHovered = useStateMachineInput(rive, STATE_MACHINE_NAME, "isHover");
  const isIconActive = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "isIconActive",
    activeIcon === strippedDownName
  );

  const numOption = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    `num${strippedDownName}`
  );

  /**
   * The icon graphic should update to reflect the chosen feature option for that icon
   * and so this listens for user selections in the options and updates accordingly
   */
  useEffect(() => {
    if (rive && numOption) {
      numOption.value = riveAvatarSelections[strippedDownName];
    }
  }, [rive, numOption, riveAvatarSelections, strippedDownName]);

  /**
   * When a user clicks on an icon, we want to set the isIconActive flag on the state machine input
   * to true for that icon, and false for all other icons
   */
  useEffect(() => {
    if (rive && isIconActive) {
      if (activeIcon === strippedDownName) {
        isIconActive.value = true;
      } else {
        isIconActive.value = false;
      }
    }
  }, [rive, activeIcon, isIconActive, strippedDownName]);

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
    if (rive && isIconActive) {
      isIconActive.value = true;
      setActiveIcon(artboardName);
    }
  }, [rive, isIconActive, artboardName, setActiveIcon]);

  return (
    <button
      className="aspect-square h-full"
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
    >
      <RiveComponent />
    </button>
  );
}
