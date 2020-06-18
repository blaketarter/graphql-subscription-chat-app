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

const CREATE_CONVERSATION = gql`
  mutation CreateConversation($name: String!, $authorId: String!) {
    createConversation(name: $name, authorId: $authorId) {
      name
      id
    }
  }
`

export function DialogCreateConversation({ authorId, open, refetch }: Props) {
  const [name, setName] = useState("")
  const [createConversation] = useMutation(CREATE_CONVERSATION)

  return (
    <Dialog open={open} onClose={() => refetch()}>
      <DialogTitle>Start a new Conversation</DialogTitle>
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          if (name.trim().length) {
            const result = await createConversation({
              variables: { authorId, name },
            })

            if (result?.data?.createConversation?.id) {
              refetch()
              setName("")
            }
          }
        }}
      >
        <DialogContent>
          <TextField
            autoFocus
            label="What do you want to call it?"
            name="name"
            onChange={(e) => setName(e.currentTarget.value)}
            fullWidth={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={refetch}>Cancel</Button>
          <Button variant="contained" color="primary" type="submit">
            Start the Conversation
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
