"use client";

import { useEffect, useContext } from "react";
import {
  useRive,
  useStateMachineInput,
  Layout,
  Alignment,
} from "@rive-app/react-canvas";
import { AvatarStateContext } from "@/app/context/avatarState";

// @refresh reset

const STATE_MACHINE_NAME = "State Machine 1";

/**
 * Component for the actual Avatar character preview. It listens to the global state context
 * to listen to when users select new character feature options and updates the avatar state
 * machine accordingly
 */
export default function RiveAvatarComponent() {
  const { rive, RiveComponent } = useRive({
    src: "./avatar_demo.riv",
    artboard: "Avatar",
    stateMachines: [STATE_MACHINE_NAME],
    layout: new Layout({
      alignment: Alignment.TopCenter,
    }),
    autoplay: true,
  });

  const {
    state: { riveAvatarSelections },
  } = useContext(AvatarStateContext);

  const numBodyColor = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "numBodyColor"
  );
  const numBodySize = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "numBodySize"
  );
  const numBodyEyes = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "numBodyEyes"
  );
  const numBodyHair = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "numBodyHair"
  );
  const numBodyFaceHair = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "numBodyFaceHair"
  );
  const numBackgroundColor = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "numBackgroundColor"
  );

  const changesTrigger = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "changes"
  );

  /**
   * Set new user-selected character features on the state machine and fire a trigger input
   * to visually show the new selection on the avatar
   */
  useEffect(() => {
    if (
      rive &&
      numBodyColor &&
      numBodySize &&
      numBodyEyes &&
      numBodyHair &&
      numBodyFaceHair &&
      numBackgroundColor &&
      changesTrigger
    ) {
      numBodyColor!.value = riveAvatarSelections["BodyColor"];
      numBodySize!.value = riveAvatarSelections["BodySize"];
      numBodyEyes!.value = riveAvatarSelections["BodyEyes"];
      numBodyHair!.value = riveAvatarSelections["BodyHair"];
      numBodyFaceHair!.value = riveAvatarSelections["BodyFaceHair"];
      numBackgroundColor!.value = riveAvatarSelections["BackgroundColor"];
      changesTrigger!.fire();
    }
  }, [
    rive,
    numBodyColor,
    numBodySize,
    numBodyEyes,
    numBodyHair,
    numBodyFaceHair,
    riveAvatarSelections,
    numBackgroundColor,
    changesTrigger,
  ]);

  return (
    <RiveComponent className="bg-[#090909] w-full h-full shadow-[10px_0_#000]" />
  );
}
