import { IQueue, Queue } from '@aws-cdk/aws-sqs';
import { Construct } from '@aws-cdk/core';

interface QueueProps {
  queueName: string;
  deadLetterQueueName: string;
}
export class QueueConstruct extends Construct {
  private _queue: IQueue;
  
  constructor(scope: Construct, id: string, props: QueueProps) {
    super(scope, id);

    const queue = new Queue(this, 'Queue', {
      queueName: props.queueName,
      deadLetterQueue: {
        queue: new Queue(this, 'DeadLetterQueue', {
          queueName: props.deadLetterQueueName
        }),
        maxReceiveCount: 3
      }
    });

    this._queue = queue;
  }

  get queue() { return this._queue };
}