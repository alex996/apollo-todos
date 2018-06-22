import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { TextField, Button, withStyles } from '@material-ui/core'

const CREATE_TODO = gql`
  mutation createTodo($text: String!) {
    createTodo(text: $text) {
      id
      text
      complete
    }
  }
`

const GET_TODOS = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`

const styles = {
  form: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between'
  },
  field: {
    margin: '5px 20px 20px 0',
    flex: 1
  }
}

class TodoForm extends Component {
  state = {
    text: ''
  }

  handleChange = ({ target: { value: text } }) =>
    this.setState({
      text
    })

  render() {
    const { classes } = this.props
    const { text } = this.state

    return <Mutation
      mutation={CREATE_TODO}
      update={(cache, { data: { createTodo } }) => {
        const { todos } = cache.readQuery({ query: GET_TODOS });
        cache.writeQuery({
          query: GET_TODOS,
          data: {
            todos: [...todos, createTodo]
          }
        });
      }}
    >
      {createTodo =>
        <form
          className={classes.form}
          onSubmit={e => {
            e.preventDefault()

            const { text } = this.state

            if (text) {
              createTodo({
                variables: { text }
              })

              this.setState({ text: '' })
            }
          }}
        >
          <TextField
            value={text}
            label='Type anything...'
            margin='normal'
            className={classes.field}
            onChange={this.handleChange}
          />
          <Button
            type='submit'
            color='primary'
            variant='raised'
          >
            Create
          </Button>
        </form>
      }
    </Mutation>
  }
}

export default withStyles(styles)(TodoForm)
