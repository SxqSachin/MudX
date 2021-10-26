import { AsyncDataProcessCallback, DataProcessCallback } from "../types";
import { Subscriber, Publisher } from "./subscribe"

export type MessageData = {
  timestamp: number;
  msg: string;
}
const subscribe = new Subscriber<'MSG', MessageData>();
const publisher = new Publisher<'MSG', MessageData>();

export const Message = {
  subscribe(callback: AsyncDataProcessCallback<MessageData>){
    return subscribe.subscribe(publisher, 'MSG', callback);
  },

  push(msg: string) {
    publisher.publish("MSG", { timestamp: Date.now(), msg });
  },
}