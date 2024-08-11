import * as dotenv from 'dotenv';
dotenv.config();

import { Client, TopicMessageQuery, TransferTransaction } from '@hashgraph/sdk';

const client = Client.forTestnet().setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);

const COMPLETE_LIST = "complete";

const handleMessage = async (message) => {
  const decodedMessage = Buffer.from(message.contents, "utf8").toString()
  const { accountId, amount, cardId, newList } = JSON.parse(decodedMessage);
  console.log(`Card: ${cardId} moved to ${newList} list.`)
  // if moved to complete handle payment
  if (newList.trim().toLowerCase() === COMPLETE_LIST) {
    const tx = new TransferTransaction()
      .addHbarTransfer(accountId, amount)
      .addHbarTransfer(process.env.ACCOUNT_ID, -amount)

    const submitResponse = await tx.execute(client);
    const receipt = await submitResponse.getReceipt(client);
    console.log(`Sent ${amount} HBAR to ${accountId} with transaction status: ${receipt.status.toString()}`);
  }
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
