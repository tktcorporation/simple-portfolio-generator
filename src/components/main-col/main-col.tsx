import {ReposObj}  from '@src/types/repos-obj.type';
import {SkillsObj} from '@src/types/skill-obj.type';

type MainColProps = {repos: ReposObj, skills: SkillsObj, history: string, others: string}

const MainCol = ({repos, skills, history, others}: MainColProps): JSX.Element => {
  return (
    <div
      className="col-md-7 col-lg-8 col-xl-9 px-4 py-6 px-lg-7 border-top border-md-top-0 bg-gray-light">

    </div>
  );
};

export default MainCol;
