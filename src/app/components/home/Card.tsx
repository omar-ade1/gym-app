import { Button, CardFooter, Divider, Card, CardHeader, CardBody } from "@nextui-org/react";
import React, { ReactElement } from "react";
import LinkNext from "next/link";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";

interface Props {
  title: string;
  icon: ReactElement;
  linkTitle: string;
  linkHref: string;
}

const CardHome:React.FC<Props> = ({ title, icon, linkTitle, linkHref }) => {
  return (
    <Card className="py-4" isFooterBlurred>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h3 className="text-xl uppercase font-bold">{title}</h3>
      </CardHeader>
      <CardBody className="overflow-visible p-4">
        <div className="w-fit mx-auto text-5xl shadow-xl p-3 bordre-t rounded-xl">
          {icon}
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-center items-center">
        <Button variant="shadow" color="primary" as={LinkNext} href={linkHref}>
          {linkTitle}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardHome;
