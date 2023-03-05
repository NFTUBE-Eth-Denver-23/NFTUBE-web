import { colors } from "constants/colors"
import React from "react"

export default function EditIcon({ ...props }) {
  const { color } = props
  return (
    <svg {...props} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M33.8508 12.8072L29.0698 8.02623C28.4458 7.44011 27.6281 7.10381 26.7723 7.08129C25.9165 7.05877 25.0823 7.3516 24.4284 7.90409L8.72439 23.6081C8.16038 24.1768 7.8092 24.9223 7.7298 25.7194L6.9795 32.9956C6.956 33.2511 6.98916 33.5088 7.07662 33.75C7.16409 33.9913 7.30371 34.2103 7.48552 34.3915C7.64856 34.5532 7.84192 34.6811 8.05452 34.768C8.26711 34.8548 8.49475 34.8988 8.72439 34.8975H8.88143L16.1576 34.2344C16.9547 34.155 17.7002 33.8039 18.2689 33.2399L33.9729 17.5359C34.5824 16.8919 34.9118 16.0327 34.8889 15.1463C34.866 14.2599 34.4927 13.4188 33.8508 12.8072ZM27.9182 18.6351L23.2419 13.9588L26.6444 10.4691L31.4079 15.2326L27.9182 18.6351Z"
        fill={color ? color : colors.white}
      />
    </svg>
  )
}
