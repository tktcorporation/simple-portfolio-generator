import _ from 'lodash';

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
  exclude_repos: Array<string>
  skills: {
    [key: string]: string
  }
  history: boolean
  others: boolean
  system: SystemConfigObj
}

export type ReposConfigObj = {
  [key: string]: {
    description: string
    bg_color?: string
    language?: string
  } | {
    html_url: string
    bg_color?: string
    description: string
  }
}

export type SystemConfigObj = {
  limit_of_auto_get: number
  exclude_fork_repo: boolean
  sort_repos_by: 'star' | 'pushed'
  titles: TitlesObj
}

export type TitlesObj = {
  repos?: string
  repos_sub?: string
  skills?: string
  skills_sub?: string
  history?: string
  history_sub?: string
  others?: string
  others_sub?: string
}

export function isConfigObj(val: unknown): val is ConfigObj {
  const config = val as ConfigObj;

  const result = inspectConfig(config);

  if (result) throw new Error(result);

  return true;
}

function inspectConfig(config: ConfigObj): string {
  if (typeof config !== 'object')
    return 'config is not map';
  if (Object.keys(config)
            .some(x => !(['username', 'user', 'repos', 'exclude_repos', 'skills', 'history', 'others',
                          'system'].includes(x))))
    return 'config has a wrong key';

  if (typeof config.username !== 'string')
    return 'username is not string';

  if (typeof config.user !== 'object')
    return 'user is not map';
  if (Object.keys(config.user).some(x => !(['bio', 'email', 'company', 'location', 'social_media'].includes(x))))
    return 'user has a wrong key';
  if (config.user.bio !== undefined && typeof config.user.bio !== 'string')
    return 'bio is not string';
  if (config.user.email !== undefined && typeof config.user.email !== 'string')
    return 'email is not string';
  if (config.user.company !== undefined && typeof config.user.company !== 'string')
    return 'company is not string';
  if (config.user.location !== undefined && typeof config.user.location !== 'string')
    return 'location is not string';
  if (config.user.social_media !== undefined && typeof config.user.social_media !== 'object')
    return 'social_media is not map';
  if (_.some(config.user.social_media, (_v, k) => typeof k !== 'string'))
    return 'social_media has a key that is not string';
  if (_.some(config.user.social_media, (v, _k) => typeof v !== 'string'))
    return 'social_media has a value that is not string';

  if (typeof config.repos !== 'object')
    return 'repos is not map';
  if (_.some(config.repos, (_v, k) => typeof k !== 'string'))
    return 'repos has a key that is not string';
  if (_.some(config.repos, (v, _k) => Object.keys(v).some(x => !(['description', 'language', 'html_url',
                                                                  'bg_color'].includes(x)))))
    return 'any map in repos has a wrong key';
  if (_.some(config.repos, (v, _k) => _.some(v, (v, _k) => typeof v !== 'string')))
    return 'any map in repos has a value that is not string';

  if (!(_.isArray(config.exclude_repos)))
    return 'exclude_repos is not array';
  if (config.exclude_repos.some(x => typeof x !== 'string'))
    return 'exclude_repos has a value that is not string';

  if (typeof config.skills !== 'object')
    return 'skills is not map';
  if (_.some(config.skills, (_v, k) => typeof k !== 'string'))
    return 'skills has a key that is not string';
  if (_.some(config.skills, (v, _k) => typeof v !== 'string'))
    return 'skills has a value that is not string';

  if (typeof config.history !== 'boolean')
    return 'history is not boolean';
  if (typeof config.others !== 'boolean')
    return 'others is not boolean';

  if (typeof config.system !== 'object')
    return 'system is not map';
  if (Object.keys(config.system)
            .some(x => !(['limit_of_auto_get', 'sort_repos_by', 'exclude_fork_repo', 'titles'].includes(x))))
    return 'system has a wrong key';
  if (typeof config.system.limit_of_auto_get !== 'number')
    return 'limit_of_auto_get is not number';
  if (!['star', 'pushed'].includes(config.system.sort_repos_by))
    return 'sort_repos_by has a wrong value';
  if (typeof config.system.exclude_fork_repo !== 'boolean')
    return 'exclude_fork_repo is not boolean';
  if (typeof config.system.titles !== 'object')
    return 'titles is not map';
  if (Object.keys(config.system.titles)
            .some(x => !(['repos', 'repos_sub', 'skills', 'skills_sub', 'history', 'history_sub', 'others',
                          'others_sub'].includes(x))))
    return 'titles has a wrong key';
  if (_.some(config.system.titles, (v, _k) => typeof v !== 'string'))
    return 'titles has a value that is not string';

  return '';
}
