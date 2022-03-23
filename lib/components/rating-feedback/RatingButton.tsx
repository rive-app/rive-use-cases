import React from 'react';
import { useRive, useStateMachineInput } from 'rive-react';
import './RatingButton.css';

interface RatingButtonProps {
  className?: string;
  riveStateMachineName: string;
  onButtonTrigger(smName: string): void;
}

const RatingButton: React.FC<RatingButtonProps> = ({
  riveStateMachineName,
  onButtonTrigger,
  className,
}) => {
  const { rive: riveInstance, RiveComponent } = useRive({
    src: 'https://public.rive.app/community/runtime-files/2334-4627-thumbs-updown.riv',
    // Here, the state machine name happens to match the artboard name, but this may not always be the case!
    artboard: riveStateMachineName,
    autoplay: true,
    stateMachines: riveStateMachineName,
  });

  const trigOnTapInput = useStateMachineInput(
    riveInstance,
    riveStateMachineName,
    'onTap'
  );

  const onClick = () => {
    trigOnTapInput!.fire();
    onButtonTrigger(riveStateMachineName);
  };

  return (
    <>
      <button onClick={onClick} className={`${className} rating-button`}>
        <RiveComponent />
      </button>
    </>
  );
};

export default RatingButton;
