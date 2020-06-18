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
  const [joinConversation] = useMutation(JOIN_CONVERSATION)

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

            if (result?.data?.joinConversation?.id) {
              refetch()
              setId("")
            }
          }
        }}
      >
        <DialogContent>
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
            Join the Conversation
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
