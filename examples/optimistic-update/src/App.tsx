import { useState } from "react"
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { delay } from "./utils"
import { v4 as uuid } from "uuid"
import axios from "axios"
import { css } from "@emotion/react"
import toast from "react-hot-toast"

type Todo = {
  id: string
  title: string
}

const useTodosQuery = () =>
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
      toast.error("mutation 실패로 롤백처리")
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(["todos"], context.previousTodos)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  })
}

// function App() {
//   const [input, setInput] = useState("")

//   const { data: todos } = useTodosQuery()
//   const { mutate: 할일추가 } = useTodoMutation()

//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     할일추가(input)
//   }

//   return (
//     <div>
//       {todos.length === 0 ? (
//         <>할 일이 없습니다</>
//       ) : (
//         todos.map((todo) => <div key={todo.id}>{todo.title}</div>)
//       )}

//       <form onSubmit={onSubmit}>
//         <input value={input} onChange={(e) => setInput(e.target.value)} />
//         <button>할 일 추가</button>
//       </form>
//     </div>
//   )
// }

const App = () => {
  const [input, setInput] = useState("")
  const queryClient = useQueryClient()

  const { data: todos } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      await delay(3000)
      const response = await axios.get("http://localhost:3000/todos")

      return response.data
    },
  })
  const { mutate: 할일추가 } = useMutation({
    mutationFn: async (todo: string) => {
      await delay(1000)
      return axios.post("http://localhost:3000/todos", {
        title: todo,
        id: uuid(),
      })
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
      toast.error("mutation 실패로 롤백처리")
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(["todos"], context.previousTodos)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    할일추가(input)
  }

  return (
    <div className="App">
      {!todos || todos?.length === 0 ? (
        <>할 일이 없습니다</>
      ) : (
        todos?.map((todo) => <div key={todo.id}>{todo.title}</div>)
      )}
      <form onSubmit={onSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button>할 일 추가</button>
      </form>
    </div>
  )
}
export default App
