import AsyncStorage from '@react-native-async-storage/async-storage';

import { env } from '../../env';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const AUTHENTICATE = 'AUTHENTICATE';

let timer: any;

export const authenticate = (
  userId: string,
  token: string,
  expirationTime: number
) => {
  return (dispatch: any) => {
    dispatch(setLogoutTimer(expirationTime));
    dispatch({ type: AUTHENTICATE, userId, token });
  };
};

export const signup = (email: string, password: string) => {
  return async (dispatch: any) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${env.firebaseAPIKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;

        console.log(errorId);

        let message = 'Something went wrong!';

        if (errorId === 'EMAIL_EXISTS') {
          message = 'This email exists already.';
        } else if (errorId === 'MISSING_PASSWORD') {
          message = 'Missing password.';
        }

        throw new Error(message);
      }

      const resData = await response.json();

      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          parseInt(resData.expiresIn) * 1000
        )
      );

      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );

      saveDataToStorage(resData.localId, resData.idToken, expirationDate);
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  };
};

export const login = (email: string, password: string) => {
  return async (dispatch: any) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.firebaseAPIKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;

        let message = 'Something went wrong!';

        console.log(errorId);

        if (errorId === 'EMAIL_NOT_FOUND') {
          message = 'This email could not be found.';
        } else if (errorId === 'INVALID_PASSWORD') {
          message = 'This password is not valid.';
        } else if (errorId === 'MISSING_PASSWORD') {
          message = 'Missing password.';
        } else if (errorId === 'EMAIL_NOT_FOUND') {
          message = 'Email was not found.';
        }

        throw new Error(message);
      }

      const resData = await response.json();

      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          parseInt(resData.expiresIn) * 1000
        )
      );

      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );

      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');

  return {
    type: LOGOUT,
  };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime: number) => {
  return (dispatch: any) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (
  userId: string,
  token: string,
  expirationTime: Date
) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      userId,
      token,
      expirationTime: expirationTime.toISOString(),
    })
  );
};
