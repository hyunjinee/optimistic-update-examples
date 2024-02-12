import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "react-hot-toast"
import { Layout } from "./components/Layout"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 0,
      // retry: 0,
      // refetchOnWindowFocus: true,
    },
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Suspense fallback={<>Loading</>}>
          <App />
        </Suspense>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    <Toaster />
  </React.StrictMode>
)
