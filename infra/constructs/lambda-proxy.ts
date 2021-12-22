import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Construct } from '@aws-cdk/core';
import { IRole } from '@aws-cdk/aws-iam';
import { Runtime } from '@aws-cdk/aws-lambda';
import { resolve } from 'path';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';

interface LambdaProps {
  functionName: string;
  account: string;
  queueName: string;
  role: IRole
}

export class LambdaProxyConstruct extends Construct {
  private _lambdaProxy: LambdaProxyIntegration;
  private _lambdaFunc: NodejsFunction;

  constructor(scope: Construct, id: string, private props: LambdaProps) {
    super(scope, id);

    this._lambdaFunc = new NodejsFunction(this, 'LambdaFunc', {
      functionName: this.props.functionName,
      runtime: Runtime.NODEJS_14_X,
      entry: resolve(__dirname, `../lambda-functions/${this.props.functionName}/index.ts`),
      bundling: {
        nodeModules: ['lodash'],
        externalModules: ['lodash'],
        minify: true,
        sourceMap: true,
        target: 'es2018',
        define: {
          'process.env.QUEUE_URL': JSON.stringify(`https://sqs.ap-northeast-2.amazonaws.com/${props.account}/${props.queueName}`)
        }
      },
      role: props.role
    });

    const lambdaProxy = new LambdaProxyIntegration({ handler: this._lambdaFunc });
    this._lambdaProxy = lambdaProxy;
  }

  get lambdaProxy() { return this._lambdaProxy };
  get lambdaFunc() { return this._lambdaFunc };
}