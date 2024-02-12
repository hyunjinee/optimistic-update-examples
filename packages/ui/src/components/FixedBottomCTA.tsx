import { css } from "@emotion/react"
import { Button } from "./Button"
import { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const FixedBottomCTA = (props: Props) => {
  return (
    <div
      css={css`
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
      `}
    >
      <div
        css={css`
          padding: 0 20px 18px;
        `}
      >
        <Button {...props} />
      </div>
    </div>
  )
}
