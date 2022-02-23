import React, { useState, ChangeEvent } from 'react';
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
  UseRiveParameters,
  RiveState,
} from 'rive-react';
import './LoginFormComponent.css';

const SM_NAME = 'Login Machine';
const LOGIN_PASSWORD = 'teddy';

export default (riveProps: UseRiveParameters = {}) => {
  const { rive: riveInstance, RiveComponent }: RiveState = useRive({
    src: 'login-teddy.riv',
    stateMachines: SM_NAME,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    ...riveProps,
  });
  const [userValue, setUserValue] = useState('');
  const [passValue, setPassValue] = useState('');

  const isCheckingInput = useStateMachineInput(
    riveInstance,
    SM_NAME,
    'isChecking'
  );
  const numLookInput = useStateMachineInput(riveInstance, SM_NAME, 'numLook');
  const trigSuccessInput = useStateMachineInput(
    riveInstance,
    SM_NAME,
    'trigSuccess'
  );
  const trigFailInput = useStateMachineInput(riveInstance, SM_NAME, 'trigFail');
  const isHandsUpInput = useStateMachineInput(
    riveInstance,
    SM_NAME,
    'isHandsUp'
  );

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setUserValue(newVal);
    if (!isCheckingInput.value) {
      isCheckingInput.value = true;
    }
    const numChars = newVal.length;
    numLookInput.value = numChars * 2;
  };

  const onUsernameFocus = () => {
    isCheckingInput.value = true;
    if (numLookInput.value !== userValue.length * 2) {
      numLookInput.value = userValue.length * 2;
    }
  };

  const onSubmit = () => {
    passValue === LOGIN_PASSWORD
      ? trigSuccessInput.fire()
      : trigFailInput.fire();
    return false;
  };

  return (
    <div>
      <div className="rive-container-container">
        <RiveComponent className="rive-container" />
      </div>
      <div className="form-container">
        <form>
          <label>
            <input
              type="text"
              className="form-username"
              name="username"
              placeholder="Username"
              onFocus={onUsernameFocus}
              value={userValue}
              onChange={onUsernameChange}
              onBlur={() => (isCheckingInput.value = false)}
            />
          </label>
          <label>
            <input
              type="password"
              className="form-pass"
              name="password"
              placeholder="Password (shh.. it's 'teddy')"
              value={passValue}
              onFocus={() => (isHandsUpInput.value = true)}
              onBlur={() => (isHandsUpInput.value = false)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassValue(e.target.value)
              }
            />
          </label>
          <div>
            <button type="button" className="login-btn" onClick={onSubmit}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
