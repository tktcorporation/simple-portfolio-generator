import {SocialMediaConfigObj} from '@src/types/social-media-config-obj.type';
import parse                  from 'html-react-parser';

type SocialMediaLinkProps = {mediaKey: string, mediaVal: string, config: SocialMediaConfigObj}

const SocialMediaLink = ({mediaKey, mediaVal, config}: SocialMediaLinkProps): JSX.Element => {
  const service = config[mediaKey];
  if (!service) throw new Error(`${mediaKey} is not defined`);

  return (
    <div className="mr-3 mb-3">
      <a href={service.profile_url_prefix + mediaVal} className="tooltipped tooltipped-se"
         aria-label={`${mediaKey}: ${mediaVal}`}>
        <>{parse(service.icon_svg)}</>
        <span className="d-none">{mediaKey}</span>
      </a>
    </div>
  );
};

export default SocialMediaLink;
