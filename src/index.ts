import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { initDatabase } from './modules/database';
import { initFcmApp } from './modules/fcm';
import { sendPush, sendEmail } from './services';
import { sendSMS } from './services/sms-sender';

(async () => {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  await initDatabase();
  initFcmApp();

  app.post('/', async (req, res) => {
    try {
      const { 
        type, targets, targetType, 
        templateType, notification, data
      } = req.body.data;

      switch (type) {
        case 'PUSH':
          await sendPush({ targets, targetType, notification, data }); 
          break;
        case 'EMAIL':
          await sendEmail({ templateType, targets, notification }); 
          break;
        case 'SMS':
          await sendSMS({ targets, data });
          break;
      }
      
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, err });
    }
  });

  app.listen(3000, () => { console.log('notification worker app starting successful') });
})();