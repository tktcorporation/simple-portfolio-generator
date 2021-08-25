export type ReposObj = {
  [key: string]: RepoObj
}

export type RepoObj = {
  html_url: string
  ogp_url: string
  bg_color: string
  description: string
  language?: string | null
  stargazers_count: number
  pushed_at: string
}
