import { cookies } from "next/headers";
import { tokenInfo } from "./utils/tokenVerify";
import { jwtPayLoad } from "./utils/interfaces";
import { Link } from "@nextui-org/react";
import LinkNext from "next/link";
import ImageNext from "next/image";
import forbidenHomePage from "../../public/forbidenHomePage.svg";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import CardHome from "./components/home/Card";
import { ReactElement } from "react";

export default function Home() {
  const token: string | undefined = cookies().get("jwtToken")?.value as string;

  const verfiyToken = tokenInfo() as jwtPayLoad;

  interface Data {
    title: string;
    icon: ReactElement;
    linkTitle: string;
    linkHref: string;
  }

  const data: Data[] = [
    {
      title: "إضافة مشتركين",
      icon: <MdOutlinePersonAddAlt1 />,
      linkTitle: "إضافة مشترك",
      linkHref: "/addSubscriber",
    },
    {
      title: "عرض كل المشتركين",
      icon: <MdOutlinePersonAddAlt1 />,
      linkTitle: "عرض كل المشتركين",
      linkHref: "/allSubscriptions",
    },
    {
      title: "التحقق من مشترك بالباركود",
      icon: <MdOutlinePersonAddAlt1 />,
      linkTitle: "التحقق",
      linkHref: "/barCodeScan",
    },
  ];

  return (
    <main className="page-height relative">
      {!token ? (
        <div className="absolute-center p-5 rounded-xl w-[500px] max-w-full  text-center">
          <ImageNext className="block w-[500px] max-w-full" src={forbidenHomePage} alt="forbiden"></ImageNext>

          <h2 className="text-3xl smT0:text-2xl font-bold ">يجب تسجيل الدخول أولاً</h2>

          <div className="mt-5">
            <Link as={LinkNext} href={"/login"} underline="hover">
              تسجيل الدخول
            </Link>
            <h2>أو</h2>
            <Link as={LinkNext} href={"/sign-up"} underline="hover">
              انشاء حساب
            </Link>
          </div>
        </div>
      ) : (
        <div className="container py-[40px]">
          <div className="boxs grid gap-5 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
            {data.map((item, i) => (
              <CardHome key={i} title={item.title} icon={item.icon} linkTitle={item.linkTitle} linkHref={item.linkHref} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
