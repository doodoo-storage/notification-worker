import { getRepository, In } from 'typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

import { getFcmApp } from '../modules/fcm';
import { UserDeviceToken, Push } from '../modules/database/entities';

dayjs.extend(utc);
dayjs.extend(tz);

type Notification = {
  title?: string;
  body: string;
  imageUrl?: string;
}

type Data = {
  target: string;
  webUrl?: string;
  likeId?: string;
}

const sendMulticast = async ({ tokens, notification, data }: {
  tokens: string[];
  notification: Notification;
  data?: Data;
}) => {
  const app = getFcmApp();

  const result = await app.messaging().sendMulticast({ 
    tokens, 
    notification: {
      title: notification.title,
      body: notification.body,
      imageUrl: notification.imageUrl ? notification.imageUrl : undefined
    }, 
    android: {
      notification: { imageUrl: notification.imageUrl ? notification.imageUrl : undefined }
    },
    apns: {
      payload: { aps: { mutableContent: true } },
      fcmOptions: { imageUrl: notification.imageUrl ? notification.imageUrl : undefined }
    },
    data 
  });
  console.dir(result, { depth: null });
  return result;
}

const sendTopic = async ({ topic, notification, data }: {
  topic: string;
  notification: Notification;
  data?: Data;
}) => {
  const app = getFcmApp();
  return await app.messaging().send({ 
    topic, 
    notification: {
      title: notification.title,
      body: notification.body
    }, 
    android: {
      notification: { imageUrl: notification.imageUrl ? notification.imageUrl : undefined }
    },
    apns: {
      payload: { aps: { mutableContent: true } },
      fcmOptions: { imageUrl: notification.imageUrl ? notification.imageUrl : undefined }
    },
    data
  });
}

const sendByUser = async ({ targets, notification, data }: {
  targets: string[];
  notification: Notification;
  data?: Data;
}) => {
  try {
    const deviceTokens = await getRepository(UserDeviceToken).find({
      where: { userId: In(targets) }
    });

    if (deviceTokens.length === 0) return;

    const result = await sendMulticast({
      tokens: deviceTokens.map(token => token.token),
      notification,
      data
    });

    return result;
  } catch (err) {
    throw err;
  }
}

const sendByTopic = async ({ targets, notification, data }: {
  targets: string[];
  notification: Notification;
  data?: Data;
}) => {
  try {
    if (targets.length === 0) return;
    
    const target = targets[0];
    
    const result = await sendTopic({ topic: target, notification, data });
    console.dir(result, { depth: null });

    return result;
  } catch (err) {
    throw err;
  }
}

export const sendPush = async ({ targetType, targets, notification, data }: {
  targetType: 'USER' | 'TOPIC';
  targets: string[];
  notification:  Notification;
  data?: Data;
}) => {
  const func = targetType === 'USER' ? sendByUser : sendByTopic;

  await func({ targets, notification, data });
}