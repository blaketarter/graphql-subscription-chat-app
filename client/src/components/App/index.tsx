import { ApolloProvider } from "@apollo/react-hooks"
import { Box } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { client } from "../../utils/ApolloClient"
import { Conversations } from "../Conversations"
import { CreateAuthor } from "../CreateAuthor"

export function App() {
  const [userId, setUserId] = useState<string | null>(
    sessionStorage.getItem("userId"),
  )

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem("userId", userId)
    } else {
      sessionStorage.removeItem("userId")
    }
  }, [userId])

  console.log(userId)

  return (
    <Box
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <ApolloProvider client={client}>
        <Router>
          {userId ? (
            <Conversations userId={userId} setUserId={setUserId} />
          ) : (
            <CreateAuthor setUserId={setUserId} />
          )}
        </Router>
      </ApolloProvider>
    </Box>
  )
}
