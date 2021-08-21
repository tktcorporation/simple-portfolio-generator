export type UserObj = {
  login: string
  name: string | null
  avatar_url: string
  gravatar_id: string
  bio: string | null
  html_url: string
  email: string | null
  company: string | null
  location: string | null
  social_media: {[key: string]: string}
}
