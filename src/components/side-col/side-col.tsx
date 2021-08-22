import {UserObj} from '@src/types/user-obj.type';

const SideCol = ({user}: {user: UserObj}): JSX.Element => {
  return (
    <div
      className="flex-self-stretch border-md-right border-gray-light bg-white col-md-5 col-lg-4 col-xl-3 px-4 px-md-6 px-lg-7 py-6">

    </div>
  );
};

export default SideCol;
