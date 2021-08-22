import _ from 'lodash';

export type  SocialMediaConfigObj = {
  [key: string]: {
    name: string
    profile_url_prefix?: string
    icon_svg: string
  }
}

export function isSocialMediaConfigObj(val: unknown): val is SocialMediaConfigObj {
  const socialMediaConfig = val as SocialMediaConfigObj;

  const result = inspectSocialMediaConfig(socialMediaConfig);
  if (result) throw new Error(result);

  return true;
}

function inspectSocialMediaConfig(socialMediaConfig: SocialMediaConfigObj) {
  if (typeof socialMediaConfig !== 'object')
    return 'social-media is not map';
  if (Object.keys(socialMediaConfig).some(x => typeof x !== 'string'))
    return 'social-media has a key that is not string';
  if (_.some(socialMediaConfig, (v, _k) => Object.keys(v)
                                                 .some(x => !(['name', 'profile_url_prefix', 'icon_svg'].includes(x)))))
    return 'social-media has a wrong key';
  if (_.some(socialMediaConfig, (v, _k) => _.some(v, (v, _k) => typeof v !== 'string')))
    return 'any map in social-media has a key that is not string';

  return '';
}
