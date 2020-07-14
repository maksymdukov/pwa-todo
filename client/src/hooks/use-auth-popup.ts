import { useRef, useState, useCallback, useEffect } from "react";
import { AuthData } from "pages/auth/signin/types";

export enum LoginProviders {
  google = "google",
  facebook = "facebook",
}

interface UseAuthPopupProps {
  onSuccess: (data: AuthData) => void;
}

export const useAuthPopup = ({ onSuccess }: UseAuthPopupProps) => {
  const popupRef = useRef<Window | null>();
  const [error, setError] = useState("");

  const loginSuccessHandler = useCallback(
    (event: MessageEvent) => {
      if (popupRef.current === event.source) {
        const authData: AuthData = JSON.parse(event.data);
        if (authData.error) {
          return setError(authData.error);
        }
        onSuccess(authData);
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    window.addEventListener("message", loginSuccessHandler);
    return () => {
      window.removeEventListener("message", loginSuccessHandler);
    };
  }, [loginSuccessHandler]);

  const openPopup = useCallback(
    (
      provider: LoginProviders,
      getSocialLink: (provider: LoginProviders) => string
    ) => {
      setError("");
      const width = 500;
      const height = 500;
      const left = window.screenX + window.outerWidth / 2 - width / 2;
      const top = window.outerHeight / 2 - height / 2;
      popupRef.current = window.open(
        getSocialLink(provider),
        "Authorization",
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, left=${left}, top=${top}`
      );
    },
    [setError]
  );

  return {
    openPopup,
    error,
  };
};
