import { colors } from "constants/colors"
import React from "react"

export default function AddIcon({ ...props }) {
  const { color } = props
  return (
    <svg {...props} viewBox="0 0 38 37" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M37.5 20.1394H20.6087V37H17.3913V20.1394H0.5V16.9279H17.3913V0H20.6087V16.9279H37.5V20.1394Z"
        fill={color ? color : colors.black}
      />
    </svg>
  )
}
