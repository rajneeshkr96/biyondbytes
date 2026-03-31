"use client"
import useFcmToken from '@/tools/useFcmToken';
import axios from 'axios';
import { useEffect, useState } from 'react';

const PushNotification = () => {
  const { wait,fcmToken, notificationPermissionStatus,setNotificationPermissionStatus } = useFcmToken();
  const [hide,setHide] = useState(false);
  const saveToken = async (token: string) => {

    await axios.post("/api/pushNotification", { token: token});
  };
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.log('Service Worker registration failed:', err);
        });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (notificationPermissionStatus === 'granted') {
        if (fcmToken) saveToken(fcmToken);
      }
    }
  }, [fcmToken, notificationPermissionStatus]);

  const allowNotification = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        setNotificationPermissionStatus('granted');
      }
    });
    setHide(true);
  };
  return (
    <>
      {notificationPermissionStatus==="default" && wait && !hide && <div onScroll={allowNotification} onTouchStart={allowNotification}  onTouchMove={allowNotification} onTouchEnd={allowNotification} onClick={allowNotification}  className='w-screen h-screen fixed top-0 left-0'>

        </div>}
    </>

  ); // This component is primarily for handling foreground notifications
};

export default PushNotification;
