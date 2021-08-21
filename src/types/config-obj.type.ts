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

  const result = inspectConfig(config);

  if (result) throw new Error(result);

  return true;
}

function inspectConfig(config: ConfigObj): string {
  if (Object.keys(config).some(x => !(['username', 'user', 'repos', 'skills', 'history', 'others'].includes(x))))
    return 'config has a wrong key';

  if (typeof config.username !== 'string')
    return 'username is not string';

  if (typeof config.user !== 'object')
    return 'user is not map';
  if (Object.keys(config.user).some(x => !(['bio', 'email', 'company', 'location', 'social_media'].includes(x))))
    return 'user has a wrong key';
  if (config.user.bio !== undefined && typeof config.user.bio !== 'string')
    return 'bio is not string';
  if (config.user.email !== undefined && typeof config.user?.email !== 'string')
    return 'email is not string';
  if (config.user.company !== undefined && typeof config.user?.company !== 'string')
    return 'company is not string';
  if (config.user.location !== undefined && typeof config.user?.location !== 'string')
    return 'location is not string';
  if (config.user.social_media !== undefined && typeof config.user?.social_media !== 'object')
    return 'social_media is not map';
  if (_.some(config.user.social_media, (_v, k) => typeof k !== 'string'))
    return 'social_media has a key that is not string';
  if (_.some(config.user.social_media, (v, _k) => typeof v !== 'string'))
    return 'social_media has a value that is not string';

  if (typeof config.repos !== 'object')
    return 'repos is not map';
  if (_.some(config.repos, (_v, k) => typeof k !== 'string'))
    return 'repos has a key that is not string';
  if (_.some(config.repos, (v, _k) => Object.keys(v).some(x => !(['description', 'language', 'html_url'].includes(x)))))
    return 'any map in repos has a wrong key';
  if (_.some(config.repos, (v, _k) => _.some(v, (v, _k) => typeof v !== 'string')))
    return 'any map in repos has a value that is not string';

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

  return '';
}
