import React from "react"

export function InformationCircleSolidIcon({
  size = 15,
  color = "currentColor",
  ...rest
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        d="M0 10.5C0 4.70101 4.70101 0 10.5 0C16.299 0 21 4.70101 21 10.5C21 16.299 16.299 21 10.5 21C4.70101 21 0 16.299 0 10.5ZM11.7 5.7C11.7 6.36274 11.1628 6.9 10.5 6.9C9.83724 6.9 9.3 6.36274 9.3 5.7C9.3 5.03726 9.83724 4.5 10.5 4.5C11.1628 4.5 11.7 5.03726 11.7 5.7ZM10.5 9C10.997 9 11.4 9.40296 11.4 9.9V15.9C11.4 16.397 10.997 16.8 10.5 16.8C10.003 16.8 9.6 16.397 9.6 15.9V9.9C9.6 9.40296 10.003 9 10.5 9Z"
        fill={color}
      />
    </svg>
  )
}
