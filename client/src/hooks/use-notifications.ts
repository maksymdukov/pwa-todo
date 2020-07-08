import { useState, useCallback, useEffect } from "react";
import { urlBase64ToUint8Array } from "utils/url-base64-to-uint8";
import { config } from "config/config";
import { usersService } from "services/users.service";
import { IWebSubscription } from "models/IWebSubscription";
import { ConnectionStatus } from "store/tech/tech.reducer";

const getSubscription = async () => {
  const swReg = await navigator.serviceWorker.ready;
  const subscription = await swReg.pushManager.getSubscription();
  return { swReg, subscription };
};

const configurePushSub = async (remove?: boolean) => {
  try {
    const { subscription, swReg } = await getSubscription();
    if (subscription === null) {
      const resp = await swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.VAPID_PUBLIC_KEY!),
      });
      await usersService.addPushSubscription(resp.toJSON() as IWebSubscription);
    } else {
      // we already have subscription
      console.log("already have subscription");
      if (remove) {
        await subscription.unsubscribe();
        return await usersService.removePushSubscription(
          subscription.toJSON() as IWebSubscription
        );
      }
      await usersService.addPushSubscription(
        subscription.toJSON() as IWebSubscription
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export const useNotifications = ({
  connectionStatus,
}: {
  connectionStatus: ConnectionStatus;
}) => {
  const [notificationsState, setNotificationsState] = useState({
    switch: false,
    loading: false,
  });

  const handleSwitch = useCallback(async () => {
    if (notificationsState.switch) {
      // unsubscribe api
      setNotificationsState((prevState) => ({
        ...prevState,
        loading: true,
      }));

      await configurePushSub(true);

      setNotificationsState((prevState) => ({
        ...prevState,
        loading: false,
        switch: false,
      }));
    } else {
      // subscribe api
      setNotificationsState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const result = await Notification.requestPermission();
      console.log("User Choice", result);
      if (result !== "granted") {
        console.log("No notification permission granted!");
      } else {
        await configurePushSub();
        setNotificationsState((prevState) => ({
          ...prevState,
          switch: true,
        }));
      }
      setNotificationsState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, [notificationsState]);

  useEffect(() => {
    if (connectionStatus === ConnectionStatus.offline) {
      return;
    }
    if (Notification.permission === "granted") {
      (async () => {
        const swReg = await navigator.serviceWorker.ready;
        const subscription = await swReg.pushManager.getSubscription();
        if (subscription) {
          setNotificationsState((prevState) => ({
            ...prevState,
            loading: true,
          }));
          await usersService.checkPushSubscription(subscription.endpoint);
          setNotificationsState((prevState) => ({
            ...prevState,
            switch: true,
            loading: false,
          }));
        }
      })();
    }
  }, [connectionStatus]);

  const getSwitchProps = useCallback(
    () => ({
      checked: notificationsState.switch,
      onChange: handleSwitch,
      disabled:
        connectionStatus === ConnectionStatus.offline ||
        notificationsState.loading,
    }),
    [
      handleSwitch,
      notificationsState.switch,
      connectionStatus,
      notificationsState.loading,
    ]
  );

  return {
    getSwitchProps,
  };
};
