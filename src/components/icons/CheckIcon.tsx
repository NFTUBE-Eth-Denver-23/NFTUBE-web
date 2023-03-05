import React from "react"

export default function CheckIcon({
  color,
  size = "15",
}: {
  color: "green" | "red" | string
  size?: string | number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={"0 0 15 17"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.26208 13.3763L1.5145 12.9376L1.26208 13.3763L6.23792 16.2594C7.0189 16.7119 7.98111 16.7119 8.76208 16.2594L13.7379 13.3763C14.5189 12.9238 15 12.0875 15 11.1825V5.41631C15 4.51129 14.5189 3.675 13.7379 3.22248L8.76208 0.339389C7.98111 -0.113129 7.0189 -0.113129 6.23792 0.339384L1.26208 3.22248C0.481106 3.675 0 4.51129 0 5.41631V11.1825C0 12.0875 0.481106 12.9238 1.26208 13.3763Z"
        fill={getColor(color)}
      />
      <path
        fillRule="evenodd"
        d="M11.0887 5.88056C11.2859 6.0784 11.2859 6.39921 11.0887 6.59705L7.05008 10.6502C6.85294 10.848 6.53328 10.848 6.33614 10.6502L4.31681 8.62362C4.11966 8.42578 4.11966 8.10497 4.31681 7.90713C4.51396 7.70929 4.83361 7.70929 5.03075 7.90713L6.69311 9.57545L10.3748 5.88056C10.5719 5.68272 10.8916 5.68272 11.0887 5.88056Z"
        fill="white"
      />
    </svg>
  )
}

function getColor(color: "green" | "red" | string) {
  switch (color) {
    case "green":
      return "#45B26B"
    case "red":
      return "#B24545"
    default:
      return color
  }
}
