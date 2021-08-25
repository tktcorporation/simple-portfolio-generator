type subtitleProps = {configTitle: string | undefined, defaultTitle: string}

const Subtitle = ({configTitle, defaultTitle}: subtitleProps): JSX.Element => {
  return (
    <p className="f4 mb-4 text-gray">
      {configTitle || defaultTitle}
    </p>
  );
};

export default Subtitle;
