import { Spinner } from "@nextui-org/react";
import React from "react";

const SipnnerCom = () => {
  return (
    <div className="absolute-center">
      <Spinner size="lg" label="يتم التحميل ..." labelColor="primary" />
    </div>
  );
};

export default SipnnerCom;
