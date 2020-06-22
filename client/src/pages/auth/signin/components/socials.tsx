import React, { useCallback, useEffect, useRef } from 'react';
import { Button } from '@material-ui/core';
import { GoogleIcon } from 'components/icons/google';
import { FacebookIcon } from 'components/icons/facebook';
import { config } from 'config/config';
import { useDispatch } from 'react-redux';
import { socialLogin } from 'store/user/actions';

type LoginProviders = 'google' | 'facebook';

const Socials = () => {
  const dispatch = useDispatch();
  const popupRef = useRef<Window | null>();
  const loginSuccessHandler = useCallback(
    (event: MessageEvent) => {
      if (popupRef.current === event.source) {
        dispatch(socialLogin(JSON.parse(event.data)));
        console.log(JSON.parse(event.data));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener('message', loginSuccessHandler);
    return () => {
      window.removeEventListener('message', loginSuccessHandler);
    };
  }, [loginSuccessHandler]);

  const openPopup = (provider: LoginProviders) => {
    const width = 500;
    const height = 500;
    const left = window.screenX + window.outerWidth / 2 - width / 2;
    const top = window.outerHeight / 2 - height / 2;
    popupRef.current = window.open(
      `${config.BASE_API_URL}/auth/${provider}/start`,
      'Authorization',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, left=${left}, top=${top}`
    );
  };

  return (
    <>
      <Button variant="outlined" onClick={() => openPopup('google')}>
        <GoogleIcon />
        Login with Google
      </Button>
      <br />
      <Button variant="outlined" onClick={() => openPopup('facebook')}>
        <FacebookIcon />
        Login with Facebook
      </Button>
    </>
  );
};

export default Socials;
