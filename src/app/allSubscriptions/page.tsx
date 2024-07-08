"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Input,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { GET_ALL_SUBSCRIBER } from "../fetchApi/subscriber/getAllSubscribers";
import { GET_SUBSCRIBER_COUNT } from "../fetchApi/subscriber/getCountOfSubscribers";
import { ROW_IN_PAGE } from "../utils/rowsPerPage";
import PageTitle from "../components/pageTitle/PageTitle";
import SipnnerCom from "../components/sipnner/SipnnerCom";
import PaginationCom from "../components/pagination/Pagination";
import { BsThreeDotsVertical } from "react-icons/bs";
import Swal from "sweetalert2";
import XLSX from "xlsx";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { DOMAIN_NAME } from "../utils/domainName";

interface Data {
  id: number;
  name: string;
  job: string;
  address: string;
  tel: string;
  subStart: string;
  subDuration: string;
  subEnd: string;
  remainingSessions: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  qrCode: string;

  subscriptionInfo: {
    id: number;
    duration: number;
    typeOfDuration: string;
    name: string;
    price: number;
  };
}

const AllSubscriptions = () => {
  const [isLoading, setIsLoading] = useState(true);

  // To Show Loading In Table While Pagination
  const [loadingTable, setLoadinTable] = useState(false);

  const [data, setData] = useState<Data[]>([]);
  const [searchBy, setSearchBy] = useState<string>("name");
  const [pageNumber, setPageNumber] = React.useState(1);
  const [searchText, setSearchText] = React.useState<string>("");
  const [showCancleSearch, setShowCancleSearch] = useState(false);
  const [token, setToken] = useState<string>("");
  // count of subscirbers
  const [countSub, setCountSub] = useState<number>(1);

  console.log(data);

  // Get All Data
  const handleGetAllSubscribers = async () => {
    try {
      setLoadinTable(true);
      const message: any = await GET_ALL_SUBSCRIBER(pageNumber, searchText, searchBy);

      // Return An Alert Error
      if (message.request.status !== 200) {
        setLoadinTable(false);
        setIsLoading(false);
        return Swal.fire({
          title: "خطأ من المستخدم",
          text: message.response.data.message,
          icon: "error",
        });
      }

      setData(message.data);
      setIsLoading(false);
      setLoadinTable(false);
    } catch (error) {
      Swal.fire({
        title: "خطأ من السيرفر",
        text: "يرجى المحاولة مرة اخرى لاحقا",
        icon: "error",
      });
    }
  };

  const [reload, setReload] = useState<any>(false);

  // Run Get Data Every Time The Page Number Is Changed
  useEffect(() => {
    handleGetAllSubscribers();
  }, [pageNumber, reload]);

  // Get Count Of Subscriber
  useEffect(() => {
    const count = GET_SUBSCRIBER_COUNT(searchText, searchBy).then((res: any) => {
      setCountSub(res.data);
    });
  }, [data]);

  // Handle Function To Export An Excel File From Subscribers Data
  const handleExel = async () => {
    const subscribersFetch = await axios.get("/api/allSubscribers");

    interface Data {
      id: number;
      الاسم: string;
      الوظيفة: string;
      العنوان: string;
      "رقم الهاتف": string;
      "عدد الحصص المتبقة": string;
      "تاريخ بدأ الاشتراك": string;
      "مدة الاشتراك": string;
      "تاريخ انتهاء الاشتراك": string;
    }

    const fanialData: Data[] = [];

    interface Subscriber {
      id: number;
      name: string;
      job: string;
      address: string;
      tel: string;
      remainingSessions: string;
      subStart: string;
      subDuration: string;
      subEnd: string;
    }

    subscribersFetch.data.forEach((subscriber: Subscriber) => {
      const ob = {
        id: subscriber.id,
        الاسم: subscriber.name,
        الوظيفة: subscriber.job,
        العنوان: subscriber.address,
        "رقم الهاتف": subscriber.tel,
        "عدد الحصص المتبقة": subscriber.remainingSessions,
        "تاريخ بدأ الاشتراك": format(new Date(subscriber.subStart), "yyyy-MM-dd"),
        "مدة الاشتراك": `${subscriber.subDuration} شهر`,
        "تاريخ انتهاء الاشتراك": subscriber.subEnd,
      };
      fanialData.push(ob);
    });

    const worksheet = XLSX.utils.json_to_sheet(fanialData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ورقة 1");

    // Write workbook to Excel file
    XLSX.writeFile(workbook, "المشتركين.xlsx");
  };

  return (
    <div className="py-[40px] page-height">
      <PageTitle titleText="كل المشتركين" />

      <div className="container">
        {isLoading ? (
          <SipnnerCom />
        ) : (
          <>
            {data.length ? (
              <>
                {/* Input Search */}
                <div className="my-5">
                  <Input
                    value={searchText}
                    onKeyDown={(e) => {
                      if (searchBy !== "name") {
                        if (e.key == "e" || e.key == "E" || e.key == "+" || e.key == "-") {
                          e.preventDefault();
                        }
                      }
                    }}
                    type={`${searchBy !== "name" ? "number" : "text"}`}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                    label={`${
                      searchBy == "name" ? "ابحث عن طريق اسم اللاعب" : searchBy == "id" ? "ابحث عن طريق ID اللاعب" : "ابحث عن طريق رقم هاتف اللاعب"
                    }`}
                  />
                  <Button
                    isDisabled={!searchText}
                    className="mt-5 w-[300px] max-w-full mx-auto block"
                    variant="shadow"
                    color="secondary"
                    onClick={() => {
                      handleGetAllSubscribers();
                      setPageNumber(1);
                      setShowCancleSearch(true);
                    }}
                  >
                    بحث
                  </Button>

                  <RadioGroup
                    onChange={(e) => {
                      setSearchBy(e.target.value);
                      setSearchText("");
                      setTimeout(() => {
                        setShowCancleSearch(true);
                      }, 0);
                    }}
                    value={searchBy}
                    description="القيمة الافتراضية (عن طريق الاسم)"
                    defaultValue={"name"}
                    className="mt-5"
                    label="اختر طريقة البحث"
                  >
                    <Radio value="name">عن طريق الاسم</Radio>
                    <Radio value="id">عن طريق ال ID</Radio>
                    <Radio value="tel">عن طريق رقم الهاتف</Radio>
                  </RadioGroup>
                </div>
              </>
            ) : (
              ""
            )}

            {showCancleSearch && (
              <Button
                color="danger"
                className="block mx-auto text-center my-5"
                onClick={() => {
                  setSearchBy("name");
                  setSearchText("");

                  setPageNumber(1);
                  setReload(!reload);
                  setShowCancleSearch(false);
                }}
              >
                إلغاء البحث و عرض كل المشتركين
              </Button>
            )}

            <Table
              lang="en"
              cellPadding={20}
              aria-label="Example table with dynamic content"
              bottomContent={data?.length > 0 && <PaginationCom pageNumber={pageNumber} count={countSub} setPageNumber={setPageNumber} />}
            >
              <TableHeader>
                <TableColumn>#</TableColumn>
                <TableColumn>id</TableColumn>
                <TableColumn>الاسم</TableColumn>
                <TableColumn>مدة الاشتراك</TableColumn>
                <TableColumn>الحصص المتبقية</TableColumn>
                <TableColumn>تاريخ بدأ الاشتراك</TableColumn>
                <TableColumn>تاريخ انتهاء الاشتراك</TableColumn>
                <TableColumn>الأدوات</TableColumn>
              </TableHeader>

              <TableBody emptyContent={"لم يتم العثور على مشتركين"} loadingContent={<Spinner />} loadingState={loadingTable ? "loading" : "idle"}>
                {data?.map((subscriber, i) => (
                  <TableRow
                    key={subscriber.id}
                    className={`${
                      parseInt(subscriber.remainingSessions) <= 5 && parseInt(subscriber.remainingSessions) > 0
                        ? "bg-warning-100"
                        : parseInt(subscriber.remainingSessions) <= 0
                        ? "bg-danger-100"
                        : ""
                    }`}
                  >
                    <TableCell className="p-5">{1 + i + ROW_IN_PAGE * (pageNumber - 1)}</TableCell>
                    <TableCell className="p-5">{subscriber.id}</TableCell>
                    <TableCell className="p-5">{subscriber.name}</TableCell>
                    <TableCell className="p-5">
                      {subscriber.subDuration} {subscriber.subscriptionInfo.typeOfDuration == "day" ? "يوم" : "شهر"}
                    </TableCell>
                    <TableCell className="p-5 ">{subscriber.remainingSessions}</TableCell>
                    <TableCell className="p-5">{format(subscriber.subStart, "yyyy-MM-dd")}</TableCell>
                    <TableCell className="p-5">{subscriber.subEnd}</TableCell>
                    <TableCell className="p-5">
                      <Dropdown backdrop="blur">
                        <DropdownTrigger>
                          <Button variant="faded" color="secondary">
                            <BsThreeDotsVertical className="text-xl" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu variant="solid" aria-label="Static Actions">
                          <DropdownItem
                            as={Link}
                            href={`${DOMAIN_NAME}/allSubscriptions/${subscriber.id}?token=${subscriber.qrCode}`}
                            showDivider
                            key="view"
                          >
                            عرض اللاعب
                          </DropdownItem>
                          <DropdownItem
                            as={Link}
                            href={`${DOMAIN_NAME}/allSubscriptions/updateSubscriber?id=${subscriber.id}&token=${subscriber.qrCode}`}
                            key="edit"
                            className="text-warning"
                            color="warning"
                          >
                            تعديل اللاعب
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {data.length ? (
              <Button
                size="lg"
                className="mt-5 font-bold block mx-auto"
                color="warning"
                variant="faded"
                onClick={() => {
                  handleExel();
                }}
              >
                تصدير كل المشتركين كملف Excel
              </Button>
            ) : (
              <Button as={Link} href="/addSubscriber" color="primary" className="flex justify-center items-center w-fit mt-5 mx-auto">
                اضافة مشترك جديد
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllSubscriptions;
