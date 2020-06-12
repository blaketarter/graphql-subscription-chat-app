import { PubSub } from "apollo-server";
import { Config } from "apollo-server"

export const pubsub = new PubSub();

export const MESSAGE_ADDED = 'MESSAGE_ADDED'

export const subscriptionsConfig: Config["subscriptions"] = {
  onConnect: (connectionParams, webSocket, context) => {
    // console.log(connectionParams, webSocket, context)
  },
  onDisconnect: (webSocket, context) => {
    // console.log(webSocket, context)
  }
};