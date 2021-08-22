import {ReposObj}  from '@src/types/repos-obj.type';
import {SkillsObj} from '@src/types/skill-obj.type';

const MainCol = ({repos, skills, history, others}
                   : {repos: ReposObj, skills: SkillsObj, history: boolean, others: boolean}): JSX.Element => {
  return (
    <div
      className="col-md-7 col-lg-8 col-xl-9 px-4 py-6 px-lg-7 border-top border-md-top-0 bg-gray-light">

    </div>
  );
};

export default MainCol;
