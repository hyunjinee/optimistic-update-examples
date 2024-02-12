import { useState } from "react"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { delay } from "./utils"
import { v4 as uuid } from "uuid"
import axios from "axios"
import { css } from "@emotion/react"

type Todo = {
  id: string
  title: string
}

const useTodoQuery = () =>
  useSuspenseQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      await delay(2000)
      const response = await axios.get("http://localhost:3000/todos")

      return response.data
    },
  })

const useTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (todo: string) => {
      await delay(3000)
      const response = await axios.post("http://localhost:3000/todos", {
        title: todo,
        id: uuid(),
      })

      return response.data
    },
    onMutate: async (todo: string) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] })

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"])

      queryClient.setQueryData<Todo[]>(["todos"], (prev) => {
        if (prev) {
          return [...prev, { title: todo, id: uuid() }]
        }

        return [{ title: todo, id: uuid() }]
      })

      return { previousTodos }
    },
    onError: (err, todo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(["todos"], context.previousTodos)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  })
}

function App() {
  const [input, setInput] = useState("")

  const { data: todos } = useTodoQuery()

  const { mutate } = useTodoMutation()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(input)
  }

  return (
    <div
      css={css`
        /* width: 100%; */
        /* height: 100%; */
        /* display: "flex";
        justify-content: "center";
        align-items: "center"; */
      `}
    >
      {todos.map((todo) => (
        <div key={todo.id}>{todo.title}</div>
      ))}

      <form onSubmit={onSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
      </form>

      {/* <FixedBottomCTA>할 일 추가하기</FixedBottomCTA> */}
    </div>
  )
}

export default App
