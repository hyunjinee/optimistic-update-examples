import { css } from "@emotion/react"
import { PropsWithChildren } from "react"
import { colors } from "ui"

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div
      css={css`
        max-width: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
        height: auto;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      {children}
    </div>
  )
}
