import React, { useState } from 'react';
import { useRive, useStateMachineInput, UseRiveParameters } from 'rive-react';
import RatingButton from './RatingButton';
import BrowserSVG from './BrowserBG';
import './RatingFeedback.css';

const STATE_MACHINE_NAME = 'avatar';
const THUMBS_UP_BUTTON_STATE_MACHINE = 'thumbsUp';
const THUMBS_DOWN_BUTTON_STATE_MACHINE = 'thumbsDown';
const LEFT_TRANSITION_CLASS = 'rating-btn-left';
const RIGHT_TRANSITION_CLASS = 'rating-btn-right';
const RATINGS_DEFAULT_TEXT = 'How did we do?';

const RatingFeedbackComponent: React.FC<UseRiveParameters> = (riveProps) => {
  const { rive: riveInstance, RiveComponent: AvatarComponent } = useRive({
    src: 'https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv',
    artboard: 'Avatar 1',
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    ...riveProps,
  });

  const [emoteOutState, setEmoteOutState] = useState('');
  const [ratingsHeader, setRatingsHeader] = useState(RATINGS_DEFAULT_TEXT);

  const isHappyInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'isHappy'
  );
  const isSadInput = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    'isSad'
  );

  const onButtonTrigger = (stateMachineName: string) => {
    if (stateMachineName === THUMBS_UP_BUTTON_STATE_MACHINE) {
      isHappyInput!.value = true;
      isSadInput!.value = false;
      setEmoteOutState(THUMBS_DOWN_BUTTON_STATE_MACHINE);
      setRatingsHeader('Lovely, thanks!');
      setTimeout(() => {
        setRatingsHeader(RATINGS_DEFAULT_TEXT);
        setEmoteOutState('');
        isHappyInput!.value = false;
      }, 3000);
    } else if (stateMachineName === THUMBS_DOWN_BUTTON_STATE_MACHINE) {
      isHappyInput!.value = false;
      isSadInput!.value = true;
      setEmoteOutState(THUMBS_UP_BUTTON_STATE_MACHINE);
      setRatingsHeader('Sorry to hear!');
      setTimeout(() => {
        setRatingsHeader(RATINGS_DEFAULT_TEXT);
        setEmoteOutState('');
        isSadInput!.value = false;
      }, 3000);
    }
  };

  return (
    <div className="container">
      <BrowserSVG className="browser-shell" />
      <div className="centered-content">
        <p className="rating-prompt">{ratingsHeader}</p>
        <div className="avatar-container">
          <AvatarComponent />
        </div>
        <div className="rating-button-container btn-container-isolated">
          <RatingButton
            className={`rating-btn ${
              emoteOutState === THUMBS_UP_BUTTON_STATE_MACHINE
                ? LEFT_TRANSITION_CLASS
                : ''
            }`}
            riveStateMachineName="thumbsUp"
            onButtonTrigger={onButtonTrigger}
          />
          <RatingButton
            className={`rating-btn ${
              emoteOutState === THUMBS_DOWN_BUTTON_STATE_MACHINE
                ? RIGHT_TRANSITION_CLASS
                : ''
            }`}
            riveStateMachineName="thumbsDown"
            onButtonTrigger={onButtonTrigger}
          />
        </div>
      </div>
    </div>
  );
};

export default RatingFeedbackComponent;
