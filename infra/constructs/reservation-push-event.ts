import { Rule, Schedule, RuleTargetInput } from '@aws-cdk/aws-events';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Construct, Duration } from '@aws-cdk/core';
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { Queue } from '@aws-cdk/aws-sqs';

interface PushEventProps {
  lambdaFunc: NodejsFunction;
}

export class ReservationPushEvent extends Construct {
  constructor(scope: Construct, id: string, private props: PushEventProps) {
    super(scope, id);

    const event = new Rule(this, 'ReservationPushRule', {
      schedule: Schedule.expression('rate(1 minute)'),
    });

    const dlQueue = new Queue(this, 'DeadLetterQueue', {
      queueName: 'reservation-push-dl-queue'
    });

    event.addTarget(new LambdaFunction(props.lambdaFunc, {
      event: RuleTargetInput.fromObject({
        body: JSON.stringify({ pushType: 'RESERVATION' })
      }),
      deadLetterQueue: dlQueue,
      retryAttempts: 1,
      maxEventAge: Duration.minutes(5)
    }));
  }
}