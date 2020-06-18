import { useMutation } from "@apollo/react-hooks"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import gql from "graphql-tag"
import React, { useState } from "react"
import { Conversation } from "../../types"

interface Props {
  authorId: string
  open: boolean
  refetch: () => unknown
}

const JOIN_CONVERSATION = gql`
  mutation JoinConversation($conversationId: String!, $authorId: String!) {
    joinConversation(conversationId: $conversationId, authorId: $authorId) {
      name
      id
    }
  }
`

export function DialogJoinConversation({ authorId, open, refetch }: Props) {
  const [id, setId] = useState("")
  const [joinConversation] = useMutation<
    {
      joinConversation: Pick<Conversation, "name" | "id">
    },
    { conversationId: string; authorId: string }
  >(JOIN_CONVERSATION)

  return (
    <Dialog open={open} onClose={() => refetch()}>
      <DialogTitle>Join an existing Conversation</DialogTitle>
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          if (id.trim().length) {
            const result = await joinConversation({
              variables: { authorId, conversationId: id },
            })

            if (result?.data?.joinConversation.id) {
              refetch()
              setId("")
            }
          }
        }}
      >
        <DialogContent style={{ width: 500 }}>
          <TextField
            autoFocus
            label="What conversation dp you want to join?"
            name="id"
            onChange={(e) => setId(e.currentTarget.value)}
            fullWidth={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={refetch}>Cancel</Button>
          <Button color="primary" type="submit">
            Join
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
