import _                                                     from 'lodash';
import {isAllKeyIncluded, isAllString, isAllStringFromArray} from '@src/module/tsInspect';

export type  SocialMediaConfigObj = {
  [key: string]: {
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
  if (!_.isObject(socialMediaConfig))
    return 'social-media is not map';
  if (!isAllString(socialMediaConfig, 'k'))
    return 'social-media has a key that is not string';
  if (!isAllKeyIncluded(Object.values(socialMediaConfig), ['profile_url_prefix', 'icon_svg']))
    return 'any map in social-media has a wrong key';
  if (!isAllStringFromArray(Object.values(socialMediaConfig), 'v'))
    return 'any map in social-media has a value that is not string';

  return '';
}
