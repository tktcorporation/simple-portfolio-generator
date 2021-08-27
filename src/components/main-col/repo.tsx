import {RepoObj}     from '@src/types/repos-obj.type';
import ReactMarkdown from 'react-markdown';

const cardClassName = 'github-component position-relative height-full d-flex flex-column justify-center bg-white border border-gray-light rounded-1';

type reposProps = {repo: RepoObj}

const Repo = ({repo}: reposProps): JSX.Element => {
  let cardStyle;
  if (repo.bg_color) {
    cardStyle = {backgroundColor: repo.bg_color};
  } else {
    cardStyle =
      repo.ogp_url.startsWith('https://opengraph.githubassets.com/')
      ? {backgroundColor: 'white'}
      : {backgroundImage: `url(${repo.ogp_url})`, backgroundSize: '100%'};
  }

  let body = '';
  if (repo.description) body = repo.description.startsWith('#') ? repo.description
                                                                : `### Description\n${repo.description}`;
  if (repo.language) body = (body || '') + `\n### Language\n${repo.language}`;

  return (
    <div className="col-6 col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-4 mb-3">
      <div className={cardClassName}>
        <div className="border-bottom hover-grow" style={cardStyle}>
          <a href={repo.html_url}>
            <img src={repo.ogp_url} className="d-block mx-auto rounded-1"
                 width="100%" style={{maxWidth: 324, maxHeight: 153.66}}/>
          </a>
        </div>
        <ReactMarkdown children={body} className="repo-card-md"/>
      </div>
    </div>
  );
};

export default Repo;
