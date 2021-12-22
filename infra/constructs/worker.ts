import { Construct } from "@aws-cdk/core";
import { CfnApplication, CfnEnvironment } from '@aws-cdk/aws-elasticbeanstalk';
import { IVpc } from "@aws-cdk/aws-ec2";

interface WorkerProps {
  appicationName: string;
  environmentName: string;
  vpc: IVpc;
  queueName: string;
  account: string;
  database: {
    host: string;
    name: string;
    user: string;
    port: string;
    password: string;
  },
  fcm: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  },
  alikeUserTopic: string;
  gabiaApiToken: string;
}

export class WorkerConstruct extends Construct {

  constructor(scope: Construct, id: string, private props: WorkerProps) {
    super(scope, id);

    const workerApplication = new CfnApplication(this, 'Application', {
      applicationName: this.props.appicationName
    });

    const workerEnvironmentOption: CfnEnvironment.OptionSettingProperty[] = [
      {
        namespace: 'aws:ec2:instances',
        optionName: 'InstanceTypes',
        value: 't3.micro',
      },
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'IamInstanceProfile',
        value: 'aws-elasticbeanstalk-ec2-role',
      },
      {
        namespace: 'aws:elasticbeanstalk:sqsd',
        optionName: 'WorkerQueueURL',
        value: `https://sqs.ap-northeast-2.amazonaws.com/${props.account}/${props.queueName}`
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'PORT',
        value: '3000',
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'DB_HOST',
        value: props.database.host,
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'DB_PORT',
        value: props.database.port,
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'DB_NAME',
        value: props.database.name,
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'DB_USER',
        value: props.database.user,
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'DB_PASSWORD',
        value: props.database.password,
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'FCM_PROJECT_ID',
        value: props.fcm.projectId,
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'FCM_CLIENT_EMAIL',
        value: props.fcm.clientEmail,
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'FCM_PRIVATE_KEY',
        value: props.fcm.privateKey,
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'ALIKE_USER_TOPIC',
        value: props.alikeUserTopic,
      },
      {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: 'GABIA_API_TOKEN',
        value: props.gabiaApiToken
      },
      {
        namespace: 'aws:autoscaling:asg',
        optionName: 'MinSize',
        value: '1'
      },
      {
        namespace: 'aws:autoscaling:asg',
        optionName: 'MaxSize',
        value: '1'
      }
    ]

    const environment = new CfnEnvironment(this, 'Environment', {
      environmentName: this.props.environmentName,
      applicationName: workerApplication.applicationName as string,
      solutionStackName: '64bit Amazon Linux 2 v5.4.0 running Node.js 14',
      optionSettings: workerEnvironmentOption,
      tier: {
        name: 'Worker',
        type: 'SQS/HTTP'
      }
    });

    environment.addDependsOn(workerApplication);
  }
}