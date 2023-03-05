import { colors } from "constants/colors"
import React from "react"

export default function AddCircleIcon({ ...props }) {
  const { color } = props
  return (
    <svg
      {...props}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0368 7.46289V14.6113"
        stroke={color ? color : colors.black}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6146 11.038H7.45883"
        stroke={color ? color : colors.black}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.29999 11.0376C1.29999 3.73552 3.73472 1.30078 11.0368 1.30078C18.3389 1.30078 20.7737 3.73552 20.7737 11.0376C20.7737 18.3397 18.3389 20.7745 11.0368 20.7745C3.73472 20.7745 1.29999 18.3397 1.29999 11.0376Z"
        stroke={color ? color : colors.black}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
