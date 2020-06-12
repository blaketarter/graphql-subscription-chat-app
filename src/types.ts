export interface Author {
  id: string
  name: string
  conversations: Conversation[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  author: Author
  body: string
  conversation: Conversation
  createdAt: Date
}

export interface Conversation {
  id: string
  name: string
  participants: Author[]
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}
