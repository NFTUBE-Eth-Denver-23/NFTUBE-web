import toast from "react-hot-toast"
import { DefaultToastOptions } from "react-hot-toast/dist"

type ErrorOptions = DefaultToastOptions["error"]
type SuccessOptions = DefaultToastOptions["success"]
// same as success but keeping own type for explicitness
type InfoOptions = DefaultToastOptions["blank"]

const errorToastOptions: ErrorOptions = {
  position: "bottom-center",
  duration: 2000,
  style: {
    fontFamily: "Gilroy",
  },
}

const successToastOptions: SuccessOptions = {
  position: "bottom-center",
  duration: 2000,
  style: {
    fontFamily: "Gilroy",
  },
}

const infoToastOptions: InfoOptions = {
  position: "bottom-center",
  duration: 2000,
  style: {
    fontFamily: "Gilroy",
  },
}

const errorToast = (text: string) => toast.error(text, errorToastOptions)
const successToast = (text: string) => toast.success(text, successToastOptions)
const infoToast = (text: string) => toast(text, infoToastOptions)

// export toast options
export { errorToastOptions, successToastOptions, infoToastOptions }
// export toast functions
export { errorToast, successToast, infoToast }

export namespace Toast {
  export const success = successToast
  export const error = errorToast
  export const info = infoToast
}
