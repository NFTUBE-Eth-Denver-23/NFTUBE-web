import { createPresignedURL } from "api/generic"
import axios from "axios"
import { Asset } from "types/Asset"

export async function getS3SignedUrl(params: {
  userId: string
  assets: Array<Asset>
}) {
  try {
    const { userId, assets } = params
    return await createPresignedURL({
      userId,
      assets,
    })
  } catch (err) {
    console.log(err)
  }
}

export async function uploadFileToPresignedUrl(
  presignedUrl: string,
  file: File,
  type: string
) {
  try {
    const buffer = await readFile(file)

    const response = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": type,
        "x-amz-acl": "public-read",
      },
      body: buffer,
    })

    return response.url.split("?")[0]
  } catch (err) {
    console.log(err)
  }
}

export function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        resolve(reader.result as ArrayBuffer)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsArrayBuffer(file)
  })
}
