import { css } from "@emotion/react"
import { ButtonHTMLAttributes, Ref, forwardRef, useId } from "react"

import { colors } from "../constants/colors"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
}

export const Button = (props: Props) => {
  const { fullWidth = true, children, ...rest } = props

  return (
    <button
      css={css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: ${fullWidth ? "100%" : "auto"};
        height: 56px;
        border: 0 solid transparent;
        border-radius: 16px;
        background-color: ${colors.blue500};
        color: ${colors.white};
        font-size: 17px;
        font-weight: 600;
      `}
      {...rest}
    >
      <span>{children}</span>
    </button>
  )
}
