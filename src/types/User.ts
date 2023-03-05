import { DefaultSocialLinks, SocialLinks } from "./SocialLinks"

export interface User {
  accessToken?: string
  userId?: string
  userTag?: string
  description?: string
  profilePhoto?: string
  coverPhoto?: string
  socialLinks?: SocialLinks
}

export const DefaultUser: User = {
  accessToken: "",
  userId: "",
  userTag: "",
  description: "",
  profilePhoto: "",
  coverPhoto: "",
  socialLinks: DefaultSocialLinks,
}
