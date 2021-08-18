export type UserObj = {
  login: string,
  name: string | null,
  avatarUrl: string,
  gravatarId: string,
  bio: string | null,
  htmlUrl: string,
  email: string | null,
  company: string | null,
  location: string | null,
  socialMedia: {[key: string]: string}
}
