import React from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { Paper, Typography, withStyles } from '@material-ui/core'
import { TodoForm, Todos } from './Todos'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

const styles = {
  root: {
    padding: 30,
    maxWidth: 500,
    margin: 'auto'
  }
}

const App = ({ classes }) =>
  <ApolloProvider client={client}>
    <Paper
      elevation={4}
      className={classes.root}
    >
      <Typography
        gutterBottom
        variant='display1'
      >
        Todos
      </Typography>

      <TodoForm />

      <Todos />
    </Paper>
  </ApolloProvider>

export default withStyles(styles)(App)
