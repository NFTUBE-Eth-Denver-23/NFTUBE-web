import { differenceInMinutes } from "date-fns"

export namespace TimeFormat {
  export function endsIn(endTime: Date) {
    const diffMinutes = Math.abs(differenceInMinutes(new Date(), endTime))
    const days = Math.floor(diffMinutes / (60 * 24))
    const hours = Math.floor(diffMinutes / 60) % 24
    const minutes = diffMinutes % 60
    return [days && `${days}D`, hours && `${hours}H`, minutes && `${minutes}M`]
      .filter((text) => !!text)
      .join(" ")
  }
}
