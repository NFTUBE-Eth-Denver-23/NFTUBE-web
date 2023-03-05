type urls = string | string[]
export default async function imagePreloader(urls: urls) {
  const promises = []
  if (typeof urls === "string") {
    const task = new Promise((resolve) => {
      const image = new Image()
      image.src = urls
      image.onload = () => {
        resolve(true)
      }
    })
    promises.push(task)
  } else {
    for (const url of urls) {
      const task = new Promise((resolve) => {
        const image = new Image()
        image.src = url
        image.onload = () => {
          resolve(true)
        }
      })
      promises.push(task)
    }
  }
  return await Promise.all(promises)
}
