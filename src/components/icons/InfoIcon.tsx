import { colors } from "constants/colors"
import React from "react"

export default function InfoIcon({ ...props }) {
  const { color } = props
  return (
    <svg
      {...props}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5344 5.36937V5.35938"
        stroke={color ? color : colors.black}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5344 15.3594V8.35938"
        stroke={color ? color : colors.black}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5344 19.3594C15.505 19.3594 19.5344 15.33 19.5344 10.3594C19.5344 5.38881 15.505 1.35938 10.5344 1.35938C5.56386 1.35938 1.53442 5.38881 1.53442 10.3594C1.53442 15.33 5.56386 19.3594 10.5344 19.3594Z"
        stroke={color ? color : colors.black}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
