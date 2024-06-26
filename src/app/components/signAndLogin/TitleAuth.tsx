import React from "react";

interface Props {
  titleText: string;
}

const TitleAuth: React.FC<Props> = ({ titleText }) => {
  return (
    <div className="title max-w-full">
      <h2 className="text-2xl font-extrabold mx-auto mb-5 w-[300px] max-w-full bg-blue-600 p-3 rounded-xl text-white flex items-center justify-center">
        {titleText}
      </h2>
    </div>
  );
};

export default TitleAuth;
