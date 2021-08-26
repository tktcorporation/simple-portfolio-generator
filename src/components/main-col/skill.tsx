const cardClassName     = 'github-component position-relative height-full no-underline d-flex flex-column flex-justify-center text-center border border-gray-light rounded-1 bg-white p-5';
const imageTmpClassName = 'bg-blue-light f4 text-gray-light text-bold rounded-1 flex-shrink-0 text-center mx-auto mb-3';

type SkillProps = {name: string, desc: string, logo: string}

const Skill = ({name, desc, logo}: SkillProps) => {
  return (
    <div className="col-6 col-md-12 col-lg-6 col-xl-4 mb-3">
      <div className={cardClassName}>
        {logo ? <img src={logo} width="64" height="64" className="mx-auto rounded-1 mb-3" alt={name}/>
              : <div className={imageTmpClassName} style={{width: 64, height: 64, lineHeight: '64px'}}>
           {'\n        #\n      '}
         </div>}

        <p className="f3 lh-condensed text-center mb-0 mt-1">{name}</p>

        {desc && <p className="f5 text-gray text-center mb-0 mt-1 break-text">{desc}</p>}
      </div>
    </div>
  );
};

export default Skill;
