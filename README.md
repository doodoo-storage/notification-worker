# alike-server-notification-worker

## project description
알림 전송을 위한 worker.

## project tree
```
.
├── README.md
├── infra
│   ├── cdk.context.json
│   ├── cdk.json
│   ├── constructs
│   │   ├── index.ts
│   │   ├── lambda-proxy.ts
│   │   ├── queue.ts
│   │   └── worker.ts
│   ├── index.ts
│   ├── lambda-functions
│   │   └── send-proxy-func
│   │       ├── index.ts
│   │       └── package.json
├── package-lock.json
├── package.json
├── src
│   ├── index.ts
│   ├── modules
│   │   ├── database
│   │   │   ├── entities
│   │   │   │   ├── index.ts
│   │   │   │   ├── token.ts
│   │   │   │   ├── topic.ts
│   │   │   │   ├── user-has-topic.ts
│   │   │   │   └── user.ts
│   │   │   └── index.ts
│   │   ├── fcm
│   │   │   └── index.ts
│   │   └── index.ts
│   └── services
│       ├── index.ts
│       └── push-sender.ts
└── tsconfig.json
```

## infra
`cdk deploy --profile alike`로 deploy

infra에서 생성하는 resource
- lambda-proxy: api gateway integration을 위한 lambda
- queue: notification 전송을 위한 queue
- worker: queue를 consume하여 해당 notification을 실제로 전송 (beanstalk)

## worker (src)

### install
project root에서 `npm install`

### build
project root에서 `npm run build`

### deploy
github action을 통한 worker beanstalk으로의 배포
