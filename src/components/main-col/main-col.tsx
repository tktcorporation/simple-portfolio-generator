import {ReposObj}  from '@src/types/repos-obj.type';
import {SkillsObj} from '@src/types/skill-obj.type';
import {TitlesObj} from '@src/types/config-obj.type';
import Subtitle    from '@src/components/main-col/subtitle';
import Repo        from '@src/components/main-col/repo';

const mainColClassName = 'col-md-7 col-lg-8 col-xl-9 px-5 py-6 border-top border-md-top-0 bg-gray-light';
type MainColProps = {repos: ReposObj, skills: SkillsObj, history: string, others: string, titles: TitlesObj}

const MainCol = ({repos, skills, history, others, titles}: MainColProps): JSX.Element => {
  return (
    <div className={mainColClassName}>
      <div className="mx-auto" style={{maxWidth: 960}}>
        <h2>{titles.repos || 'My Projects'}</h2>
        <Subtitle configTitle={titles.repos_sub}
                  defaultTitle="GitHub repositories that I've built."/>

        <div className="d-flex flex-wrap gutter-condensed mb-4">
          {Object.entries(repos).map((r) => <Repo repo={r[1]} key={r[0]}/>)}
        </div>

        <h2>{titles.skills || 'My Skills'}</h2>
        <Subtitle configTitle={titles.skills_sub}
                  defaultTitle="Languages that I can use well."/>

        {/*<Skills/>*/}

        {history &&
        <>
          <h2>{titles.history || 'My History'}</h2>
          <Subtitle configTitle={titles.history_sub}
                    defaultTitle="A brief work history."/>

          {/*<Markdown/>*/}
        </>}

        {others &&
        <>
          <h2>{titles.others || 'Others'}</h2>
          <Subtitle configTitle={titles.others_sub}
                    defaultTitle=""/>

          {/*<MarkDown/>*/}
        </>}
      </div>
    </div>
  )
    ;
};

export default MainCol;
