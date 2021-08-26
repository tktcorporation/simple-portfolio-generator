import _             from 'lodash';
import {isAllString} from '@src/module/tsInspect';

export type SkillLogoConfigObj = {
  [key: string]: string
}

export function isSkillLogoConfigObj(val: unknown): val is SkillLogoConfigObj {
  const skillLogoConfig = val as SkillLogoConfigObj;

  const result = (inspectSkillLogoConfig(skillLogoConfig));
  if (result) throw new Error(result);

  return true;
}

function inspectSkillLogoConfig(skillLogoConfig: SkillLogoConfigObj) {
  if (!_.isObject(skillLogoConfig))
    return 'skill-logo is not map';
  if (!isAllString(skillLogoConfig, 'k'))
    return 'skill-logo has a key that is not string';
  if (!isAllString(skillLogoConfig, 'v'))
    return 'skill-logo has a value that is not string';

  return '';
}
