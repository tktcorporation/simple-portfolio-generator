import {ReposObj}           from '@src/types/repos-obj.type';
import {SkillsObj}          from '@src/types/skill-obj.type';
import {TitlesObj}          from '@src/types/config-obj.type';
import Subtitle             from '@src/components/main-col/subtitle';
import Repo                 from '@src/components/main-col/repo';
import Skill                from '@src/components/main-col/skill';
import ReactMarkdown        from 'react-markdown';
import {SkillLogoConfigObj} from '@src/types/skill-logo-obj.type';

const mainColClassName = 'col-md-7 col-lg-8 col-xl-9 px-5 py-6 border-top border-md-top-0 bg-gray-light';
type MainColProps = {repos: ReposObj, skills: SkillsObj, skillLogoConfig: SkillLogoConfigObj, history: string, others: string, titles: TitlesObj, sort_repos_by: string}

const MainCol = ({
                   repos, skills, skillLogoConfig, history, others, titles, sort_repos_by
                 }: MainColProps): JSX.Element => {
  return (
    <div className={mainColClassName}>
      <div className="mx-auto" style={{maxWidth: 960}}>
        <h2>{titles.repos || 'My Projects'}</h2>
        <Subtitle configTitle={titles.repos_sub}
                  defaultTitle="GitHub repositories that I've built."/>

        <div className="d-flex flex-wrap gutter-condensed mb-4">
          {Object.entries(repos)
                 .sort((a, b) => {
                   if (sort_repos_by === 'star')
                     return b[1].stargazers_count - a[1].stargazers_count;
                   else
                     return Date.parse(b[1].pushed_at) - Date.parse(a[1].pushed_at);
                 })
                 .map(r => <Repo repo={r[1]} key={r[0]}/>)}
        </div>

        <h2>{titles.skills || 'My Skills'}</h2>
        <Subtitle configTitle={titles.skills_sub}
                  defaultTitle="Languages that I can use well."/>

        <div className="d-flex flex-wrap gutter-condensed mb-4">
          {skills.map(s => <Skill name={s[0]} desc={s[1]} logo={skillLogoConfig[s[0]]} key={s[0]}/>)}
        </div>

        {history &&
        <>
          <h2>{titles.history || 'My History'}</h2>
          <Subtitle configTitle={titles.history_sub}
                    defaultTitle="A brief work history."/>

          {<ReactMarkdown children={history} className="bg-white f4 border border-gray-light px-4 pt-2 mb-4"/>}
        </>}

        {others &&
        <>
          <h2>{titles.others || 'Others'}</h2>
          <Subtitle configTitle={titles.others_sub}
                    defaultTitle=""/>

          {<ReactMarkdown children={others} className="bg-white f4 border border-gray-light px-4 pt-2"/>}
        </>}
      </div>
    </div>
  );
};

export default MainCol;
