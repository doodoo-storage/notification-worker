import axios from 'axios';
import env from 'env-var';
import { URLSearchParams } from 'url';

type Notification = {
  body: string;
}

type SendParam = {
  userId: string;
  phone: string;
  verificationCode: string;
  accessToken: string;
}

type Data = {
  phone: string;
  verificationCode: string;
}

const gabiaApiToken = env.get('GABIA_API_TOKEN').required().asString();

const getGabiaApiAccessToken = async () => {
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');

  const res = await axios({
    url: 'https://sms.gabia.com/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${gabiaApiToken}`
    },    
    data
  });
  return res.data.access_token;
}

const send = async (param: SendParam) => {
  const { userId, phone, verificationCode, accessToken } = param;
  
  const data = new URLSearchParams();
  data.append('phone', phone);
  data.append('callback', 'your-phone-number');
  data.append('message', verificationCode);
  data.append('refkey', `${userId}${new Date().getTime()}`);

  const encodedToken = Buffer.from(`app-name:${accessToken}`).toString('base64');
  const res = await axios({
    url: ' https://sms.gabia.com/api/send/sms',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${encodedToken}`
    },
    data
  });
}

export const sendSMS = async ({ targets, data }: {
  targets: string[];
  data: Data;
}) => {
  if (targets.length === 0) return;
  const accessToken = await getGabiaApiAccessToken();
  
  await send({ 
    userId: targets[0],
    phone: data.phone,
    verificationCode: data.verificationCode,
    accessToken 
  });
};