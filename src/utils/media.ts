export enum MediaType {
  VIDEO,
  IMAGE,
}

export function checkMediaType(url: string) {
  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|svg|png|webp)/g
  const videoRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:mp4|mov|ogg)/g

  if (imageRegex.test(url)) {
    return MediaType.IMAGE
  }
  if (videoRegex.test(url)) {
    return MediaType.VIDEO
  }
}
