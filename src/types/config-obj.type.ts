import _                                                                              from 'lodash';
import {isAllKeyIncluded, isAllString, isAllStringFromArray, isExistsAnd, isIncluded} from '@src/module/tsInspect';

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
  exclude_skills: Array<string>
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
    ogp_url?: string
    bg_color?: string
    description: string
  }
}

export type SystemConfigObj = {
  max_count_repo_show: number
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
  if (!_.isObject(config))
    return 'config is not map';
  if (!isAllKeyIncluded(config,
                        ['username', 'user', 'repos', 'exclude_repos', 'skills', 'exclude_skills', 'history', 'others',
                         'system']))
    return 'config has a wrong key';
  if (!_.isString(config.username))
    return 'username is not string';

  if (!_.isObject(config.user))
    return 'user is not map';
  if (!isAllKeyIncluded(config.user, ['bio', 'email', 'company', 'location', 'social_media']))
    return 'user has a wrong key';
  for (const val of ['bio', 'email', 'company', 'location']) {
    if (!isExistsAnd(config.user[val as keyof typeof config.user], 'string'))
      return `${val} is not string`;
  }
  if (!isExistsAnd(config.user.social_media, 'object'))
    return 'social_media is not map';
  if (!isAllString(config.user.social_media, 'k'))
    return 'social_media has a key that is not string';
  if (!isAllString(config.user.social_media, 'v'))
    return 'social_media has a value that is not string';

  if (!_.isObject(config.repos))
    return 'repos is not map';
  if (!isAllString(config.repos, 'k'))
    return 'repos has a key that is not string';
  if (!isAllKeyIncluded(Object.values(config.repos), ['description', 'language', 'html_url', 'bg_color', 'ogp_url']))
    return 'any map in repos has a wrong key';
  if (!isAllStringFromArray(Object.values(config.repos), 'v'))
    return 'any map in repos has a value that is not string';

  if (!_.isArray(config.exclude_repos))
    return 'exclude_repos is not array';
  if (!isAllString(config.exclude_repos, 'v'))
    return 'exclude_repos has a value that is not string';

  if (!_.isObject(config.skills))
    return 'skills is not map';
  if (!isAllString(config.skills, 'k'))
    return 'skills has a key that is not string';
  if (!isAllString(config.skills, 'v'))
    return 'skills has a value that is not string';

  if (!_.isArray(config.exclude_skills))
    return 'exclude_skills is not array';
  if (!isAllString(config.exclude_skills, 'v'))
    return 'exclude_skills has a value that is not string';

  if (!_.isBoolean(config.history))
    return 'history is not boolean';
  if (!_.isBoolean(config.others))
    return 'others is not boolean';

  if (!_.isObject(config.system))
    return 'system is not map';
  if (!isAllKeyIncluded(config.system, ['max_count_repo_show', 'sort_repos_by', 'exclude_fork_repo', 'titles']))
    return 'system has a wrong key';
  if (!_.isNumber(config.system.max_count_repo_show))
    return 'max_count_repo_show is not number';
  if (!isIncluded(config.system.sort_repos_by, ['star', 'pushed']))
    return 'sort_repos_by has a wrong value';
  if (!_.isBoolean(config.system.exclude_fork_repo))
    return 'exclude_fork_repo is not boolean';
  if (!_.isObject(config.system.titles))
    return 'titles is not map';
  if (!isAllKeyIncluded(config.system.titles, ['repos', 'repos_sub', 'skills', 'skills_sub', 'history',
                                               'history_sub', 'others', 'others_sub']))
    return 'titles has a wrong key';
  if (!isAllString(config.system.titles, 'v'))
    return 'titles has a value that is not string';

  return '';
}
