export interface Message {
  id: string
  author: string
  body: string
  conversation: Conversation
  createdAt: Date
}

export interface Conversation {
  id: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}
