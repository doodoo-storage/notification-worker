import { initializeApp, credential, app } from 'firebase-admin';

let fcmApp: app.App;

export const initFcmApp = () => {
  const privateKey = process.env.FCM_PRIVATE_KEY as string;

  fcmApp = fcmApp ? fcmApp : initializeApp({
    credential: credential.cert({
      projectId: process.env.FCM_PROJECT_ID,
      clientEmail: process.env.FCM_CLIENT_EMAIL,
      privateKey: privateKey.replace(/\\n/g, '\n')
    })
  });
}

export const getFcmApp = () => fcmApp;

