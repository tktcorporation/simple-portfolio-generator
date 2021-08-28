import {UserObj}                                                  from '@src/types/user-obj.type';
import {LocationIcon, MailIcon, MarkGithubIcon, OrganizationIcon} from '@primer/octicons-react';
import _                                                          from 'lodash';
import SocialMediaLink                                            from '@src/components/side-col/social-media-link';
import {SocialMediaConfigObj}                                     from '@src/types/social-media-config-obj.type';

const sideColClassName = 'flex-self-stretch border-md-right border-gray-light bg-white col-md-5 col-lg-4 col-xl-3 px-4 px-md-6 px-lg-7 py-6';
const metadataStyles   = 'd-flex flex-items-center mb-3';

type SideColProps = {user: UserObj, socialMediaConfig: SocialMediaConfigObj}

const SideCol = ({user, socialMediaConfig}: SideColProps): JSX.Element => {
  const email = [user.email?.substr(0, 1), user.email?.substr(1).split('@')].flat();

  return (
    <div className={sideColClassName}>
      <div className="width-full top-6" style={{position: 'sticky'}}>
        <img src={user.gravatar_id || user.avatar_url} className="circle mb-3" style={{maxWidth: 150}}/>
        <h1 className="mb-2 lh-condensed break-text">{user.name || user.login}</h1>

        {user.bio && <p className="mb-3 f5 text-gray break-text">{user.bio}</p>}

        <div className="f4 mb-6">
          <div className={metadataStyles}>
            <MarkGithubIcon className="mr-2 wh-20" verticalAlign="middle" fill="#24292e" aria-label="GitHub"/>
            <a href={user.html_url}>@{user.login}</a>
          </div>

          {user.email &&
          <div className={metadataStyles}>
            <MailIcon className="mr-2 wh-20" verticalAlign="middle" fill="#24292e" aria-label="email"/>
            {email[0]}
            <span className="d-none">shine*spa&m</span>{email[1]}
            <span className="before-at">{email[2]}</span>
          </div>}

          {user.company &&
          <div className={metadataStyles}>
            <OrganizationIcon className="mr-2 wh-20" verticalAlign="middle" fill="#24292e" aria-label="company"/>
            {user.company}
          </div>}

          {user.location &&
          <div className={metadataStyles}>
            <LocationIcon className="mr-2 wh-20" verticalAlign="middle" fill="#24292e" aria-label="location"/>
            {user.location}
          </div>}

          {!_.isEmpty(user.social_media) &&
          <div className="d-flex flex-wrap flex-items-start">
            {Object.entries(user.social_media).map(s => <SocialMediaLink mediaKey={s[0]}
                                                                         mediaVal={s[1]}
                                                                         config={socialMediaConfig}
                                                                         key={s[0]}/>)}
          </div>}
        </div>
      </div>
    </div>
  );
};

export default SideCol;
