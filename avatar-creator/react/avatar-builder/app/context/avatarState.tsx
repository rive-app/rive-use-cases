"use client";

import {
  createContext,
  useCallback,
  useReducer,
  PropsWithChildren,
  Context,
} from "react";

/**
 * Initial state for Avatar Builder.
 * - `activeIcon` - Name correlates to the currently selected icon in the sidebar, and should match
 *                  a pattern in the artboard name from the `.riv` file
 *                  (i.e. `BodyColor` for `BodyColorIcon` artboard)
 * - `riveAvatarSelections` - Object that holds the current selection for each character feature. The
 *                            number correlates to the state machine input value for `numOption` input
 *                            for the option button state machines in the `.riv` file
 *
 */
const initialState = {
  activeIcon: "BodyColor",
  riveAvatarSelections: {
    BodyColor: 0,
    BodySize: 0,
    BodyEyes: 0,
    BodyHair: 0,
    BodyFaceHair: 0,
    BackgroundColor: 0,
  },
};

const actions = {
  SET_ACTIVE_ICON: "SET_ACTIVE_ICON",
  SET_RIVE_AVATAR_SELECTION: "SET_RIVE_AVATAR_SELECTION",
};

export interface Action<T, P> {
  readonly type: T;
  readonly payload?: P;
}

/**
 * Reducer function that updates state given a specific action and payload
 */
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actions.SET_ACTIVE_ICON:
      return {
        ...state,
        activeIcon: action.activeIcon,
      };
    case actions.SET_RIVE_AVATAR_SELECTION:
      return {
        ...state,
        riveAvatarSelections: {
          ...state.riveAvatarSelections,
          [action.feature]: action.featureValue,
        },
      };
    default:
      return state;
  }
};

export const AvatarStateContext: Context<any> = createContext({});

/**
 * Wraps the app with the AvatarStateContext provider and exposes action functions
 * that child components can call to update the state indirectly
 */
export const AvatarStateProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Sets the active icon in the state when a user clicks a character feature icon
   */
  const setActiveIcon = useCallback(
    (activeIcon: string) => {
      let splicedIconName = activeIcon.replace("Icon", "");
      dispatch({
        type: actions.SET_ACTIVE_ICON,
        activeIcon: splicedIconName,
      });
    },
    [dispatch]
  );

  /**
   * Sets a selection of a character feature in the state when a user clicks on one of the
   * multiple options for that feature (i.e. Mustache for Facial hair)
   */
  const setRiveAvatarSelection = useCallback(
    (feature: string, featureValue: number) => {
      dispatch({
        type: actions.SET_RIVE_AVATAR_SELECTION,
        feature,
        featureValue,
      });
    },
    []
  );

  const value = {
    state,
    setActiveIcon,
    setRiveAvatarSelection,
  };

  return (
    <AvatarStateContext.Provider value={value}>
      {children}
    </AvatarStateContext.Provider>
  );
};
