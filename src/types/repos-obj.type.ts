export type ReposObj = {
  [key: string]: {
    html_url: string
    ogp_url: string
    description: string
    language?: string | null
  }
}
