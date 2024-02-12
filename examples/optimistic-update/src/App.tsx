import { useState } from "react";
import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { delay } from "./utils";
import { v4 as uuid } from "uuid";
import axios from "axios";

type Todo = {
  id: string;
  title: string;
};

const useTodoQuery = () =>
  useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      await delay(2000);
      const response = await axios.get("http://localhost:3000/todos");

      return response.data;
    },
    suspense: true,
  });

const useTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todo: string) => {
      await delay(3000);
      const response = await axios.post("http://localhost:3000/todos", {
        title: todo,
        id: uuid(),
      });

      return response.data;
    },
    onMutate: async (todo: string) => {
      await queryClient.cancelQueries(["todos"]);

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData<Todo[]>(["todos"], (prev) => {
        if (prev) {
          return [...prev, { title: todo, id: uuid() }];
        }

        return [{ title: todo, id: uuid() }];
      });

      return { previousTodos };
    },
    onError: (err, todo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(["todos"], context.previousTodos);
      }
    },
    onSettled: () => queryClient.invalidateQueries(["todos"]),
  });
};

function App() {
  const [input, setInput] = useState("");

  const { data: todos } = useTodoQuery();

  const { mutate } = useTodoMutation();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(input);
  };

  return (
    <div className="App">
      {todos?.map((todo) => (
        <div key={todo.id}>{todo.title}</div>
      ))}

      <form onSubmit={onSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
      </form>
    </div>
  );
}

export default App;
