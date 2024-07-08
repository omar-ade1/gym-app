import { Button } from "@nextui-org/react";
import React from "react";

interface Props {
  loading: boolean;
  btnText: string;
}

const SubmitBtn: React.FC<Props> = ({ loading, btnText }) => {
  return (
    <Button isLoading={loading} variant="shadow" size="lg" fullWidth color="primary" type="submit" className="mt-5 max-w-full">
      {btnText}
    </Button>
  );
};

export default SubmitBtn;
