import React from "react";
import Image from "next/image";

interface Props {
  ImageData: string;
}

const ImageAuth: React.FC<Props> = ({ ImageData }) => {
  return (
    <div className="">
      <Image className="drop-shadow-xl max-w-full w-[500px]" src={ImageData} alt="login" />
    </div>
  );
};

export default ImageAuth;
