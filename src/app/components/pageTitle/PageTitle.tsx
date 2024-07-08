import React from "react";

interface Props {
  titleText: string;
}

const PageTitle: React.FC<Props> = ({ titleText }) => {
  return <h2 className="text-2xl font-bold text-center mb-5 print:hidden">{titleText}</h2>;
};

export default PageTitle;
