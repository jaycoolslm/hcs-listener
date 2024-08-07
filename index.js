import * as dotenv from 'dotenv';
dotenv.config();

import { Client, TopicMessageQuery } from '@hashgraph/sdk';

const client = Client.forTestnet().setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);

const handleMessage = (message) => {
  const decodedMessage = Buffer.from(message.contents, "utf8").toString()
}

const main = async () => {
  new TopicMessageQuery()
    .setTopicId(process.env.TOPIC_ID)
    .subscribe(
      client,
      handleMessage
    );
}

main();
