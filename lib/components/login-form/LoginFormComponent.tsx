import React, {
  useRef,
  useState,
  ChangeEvent,
  SyntheticEvent,
  useEffect,
} from 'react';
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
  UseRiveParameters,
  RiveState,
  StateMachineInput,
} from 'rive-react';
import './LoginFormComponent.css';

const SM_NAME = 'Login Machine';
const LOGIN_PASSWORD = 'teddy';
const LOGIN_TEXT = 'Login';

/**
 * Use case for a simple login experience that incorporates a Rive asset with a
 * state machine to coordinate user interaction with a form
 * @param riveProps
 */
const LoginFormComponent = (riveProps: UseRiveParameters = {}) => {
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
  const [inputLookMultiplier, setInputLookMultiplier] = useState(0);
  const [loginButtonText, setLoginButtonText] = useState(LOGIN_TEXT);
  const inputRef = useRef(null);

  const isCheckingInput: StateMachineInput = useStateMachineInput(
    riveInstance,
    SM_NAME,
    'isChecking'
  );
  const numLookInput: StateMachineInput = useStateMachineInput(
    riveInstance,
    SM_NAME,
    'numLook'
  );
  const trigSuccessInput = useStateMachineInput(
    riveInstance,
    SM_NAME,
    'trigSuccess'
  );
  const trigFailInput: StateMachineInput = useStateMachineInput(
    riveInstance,
    SM_NAME,
    'trigFail'
  );
  const isHandsUpInput = useStateMachineInput(
    riveInstance,
    SM_NAME,
    'isHandsUp'
  );

  // Divide the input width by the max value the state machine looks for in numLook.
  // This gets us a multiplier we can apply for each character typed in the input
  // to help Teddy track progress along the input line
  useEffect(() => {
    if (inputRef?.current && !inputLookMultiplier) {
      setInputLookMultiplier(inputRef.current.offsetWidth / 100);
    }
  }, [inputRef]);

  // As the user types in the username box, update the numLook value to let Teddy know
  // where to look to according to the state machine
  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setUserValue(newVal);
    if (!isCheckingInput.value) {
      isCheckingInput.value = true;
    }
    const numChars = newVal.length;
    numLookInput.value = numChars * inputLookMultiplier;
  };

  // Start Teddy looking in the correct spot along the username input
  const onUsernameFocus = () => {
    isCheckingInput.value = true;
    if (numLookInput.value !== userValue.length * inputLookMultiplier) {
      numLookInput.value = userValue.length * inputLookMultiplier;
    }
  };

  // When submitting, simulate password validation checking and trigger the appropriate input from the
  // state machine
  const onSubmit = (e: SyntheticEvent) => {
    setLoginButtonText('Checking...');
    setTimeout(() => {
      setLoginButtonText(LOGIN_TEXT);
      passValue === LOGIN_PASSWORD
        ? trigSuccessInput.fire()
        : trigFailInput.fire();
    }, 1500);
    e.preventDefault();
    return false;
  };

  return (
    <div className="login-form-component-root">
      <div>
        <div className="rive-wrapper">
          <RiveComponent className="rive-container" />
        </div>
        <div className="form-container">
          <form onSubmit={onSubmit}>
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
                ref={inputRef}
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
            <button className="login-btn">{loginButtonText}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginFormComponent;
