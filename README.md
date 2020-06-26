# GraphQL Subscriptions Chat App

**🧰 Tools Used**

- https://www.typescriptlang.org/
- https://reactjs.org/
- https://material-ui.com/
- https://github.com/graphql/graphql-js
- https://github.com/apollographql/apollo-client
- https://github.com/apollographql/apollo-server

## How to run

- 1. Start the server
  - 1A. `cd server`
  - 1B. `npm ci`
  - 1C. `npm start`
2. Start the client
  - 2A. `cd client`
  - 2B. `npm ci`
  - 2C. `npm start`

## Important files

### Server

**resolvers.ts**

`server/resolvers.ts:10-19` Sets up the resolver for the `messageAdded` subscription that subscribes to the event `MESSAGE_ADDED`.

```ts
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGE_ADDED]),
        ({ messageAdded }: { messageAdded: Message }, args: { conversationId: string }) => {
          return messageAdded.conversation.id === args.conversationId
        },
      )
    }
  },
```

`server/resolvers.ts:79` Publishes the event `MESSAGE_ADDED`.

```ts
pubsub.publish(MESSAGE_ADDED, { messageAdded: message })
```

---

**subscriptions.ts**

`server/subscriptions.ts:4` Creates a `PubSub` instance used to track publish and subscription events.

```ts
export const pubsub = new PubSub();
```

---

**typeDefs.ts**

`server/typeDefs.ts:31-33` Creates the GraphQL subscription `messageAdded` to the schema.

```
type Subscription {
  messageAdded(conversationId: String!): Message!
}
```

### Client

**ApolloClient/index.ts**

`client/src/utils/ApolloClient/index.ts:13-18` Creates the WebSocket link to the Subscriptions server.

```ts
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
})
```

`client/src/utils/ApolloClient/index.ts:20-31` Configures the client to send subscription operations to the `wsLink` and other operations to the `httpLink`.

```ts
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink,
)
```

---

**client/src/components/Conversation**

`client/src/components/Conversation/hooks.ts:88-118` Creates a custom hook to wrap the `useSubscription` hook from Apollo, this hook subscribes to the `messageAdded` GraphQL subscription.

```ts
const MESSAGE_ADDED = gql`
  subscription MessageAdded($conversationId: String!) {
    messageAdded(conversationId: $conversationId) {
      id
      body
      createdAt
      author {
        id
        name
      }
      conversation {
        id
      }
    }
  }
`
type MessageAddedData = {
  messageAdded: Pick<Message, "id" | "body" | "createdAt"> & {
    author: Pick<Author, "id" | "name">
    conversation: Pick<Conversation, "id">
  }
}

export function useMessageAddedSubscription(conversationId: string) {
  return useSubscription<MessageAddedData, { conversationId: string }>(
    MESSAGE_ADDED,
    {
      variables: { conversationId },
    },
  )
}
```

`client/src/components/Conversation/index.tsx:34` Using the custom `useMessageAddedSubscription` hook.

```ts
const { data: subscriptionData } = useMessageAddedSubscription(conversationId)
```

`client/src/components/Conversation/index.tsx:40-45` Pushing data from the subscription as it comes in to a local state array.

```ts
useEffect(() => {
  if (subscriptionData?.messageAdded?.id) {
    setNewMessages([...newMessages, subscriptionData.messageAdded])
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [subscriptionData])
```


## Resources Used

### Server

- https://www.apollographql.com/docs/graphql-subscriptions
- https://www.apollographql.com/docs/apollo-server/data/subscriptions/
- https://github.com/apollographql/graphql-subscriptions

### Client

- https://www.apollographql.com/docs/react/data/subscriptions/