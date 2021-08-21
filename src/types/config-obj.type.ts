export type ConfigObj = {
  username: string
  user: {
    bio?: string
    email?: string
    company?: string
    location?: string
    social_media?: {
      [key: string]: string
    }
  }
  repos: ReposConfigObj
  skills: {
    [key: string]: string
  }
  history: boolean
  others: boolean
}

export type ReposConfigObj = {
  [key: string]: {
    description: string
    language?: string
  } | {
    html_url: string
    description: string
  }
}

export function isConfigObj(val: unknown): val is ConfigObj {
  const config = val as ConfigObj;

  return (
    typeof config.username === 'string' &&
    typeof config.user === 'object' &&
    typeof config.repos === 'object' &&
    typeof config.skills === 'object' &&
    typeof config.history === 'boolean' &&
    typeof config.others === 'boolean'
  );
}

// 使うかもしれない
// Object.keys(ConfigObj.user).every(x => {
//       return ['bio', 'email', 'company', 'location', 'social_media'].includes(x)
//     }) &&
