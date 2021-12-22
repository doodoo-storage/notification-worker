import { config, SES, SharedIniFileCredentials } from 'aws-sdk';

type Notification = {
  title: string;
  body: string;
}

const sendHtmlEmail = async ({ targets, notification }: {
  targets: string[];
  notification: Notification;
}) => {
  const ses = new SES({ region: 'ap-northeast-2' });
  const result = await ses.sendEmail({
    Destination: {
      ToAddresses: targets
    },
    Message: {
      Body: {
        Html: {
          Data: notification.body,
          Charset: 'utf-8'
        }
      },
      Subject: {
        Data: notification.title,
        Charset: 'utf-8'
      }
    },
    Source: 'your@email.com'
  }).promise();
}

const sendTextEmail = async ({ targets, notification }: {
  targets: string[];
  notification: Notification;
}) => {
  const ses = new SES({ region: 'ap-northeast-2' });

  const result = await ses.sendEmail({
    Destination: {
      ToAddresses: targets
    },
    Message: {
      Body: {
        Text: {
          Data: notification.body,
          Charset: 'utf-8'
        }
      },
      Subject: {
        Data: notification.title,
        Charset: 'utf-8'
      }
    },
    Source: 'your@email.com'
  }).promise();
}

export const sendEmail = async ({ templateType, targets, notification }: {
  templateType: 'HTML' | 'TEXT';
  targets: string[];
  notification:  Notification;
}) => {
  const func = templateType === 'HTML' ? 
    sendHtmlEmail : sendTextEmail;

  await func({ targets, notification });
};