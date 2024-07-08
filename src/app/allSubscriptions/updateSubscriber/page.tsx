"use client";

import PageTitle from "@/app/components/pageTitle/PageTitle";
import SipnnerCom from "@/app/components/sipnner/SipnnerCom";
import { GET_SINGLE_SUBSCRIBER } from "@/app/fetchApi/subscriber/getSingleSubscriber";
import { UPDATE_SUBSCRIBER } from "@/app/fetchApi/subscriber/updateSubscriber";
import { DOMAIN_NAME } from "@/app/utils/domainName";
import { Toast } from "@/app/utils/smAlert";
import { Button, DatePicker, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import { add, format, parse } from "date-fns";
import { getURL } from "next/dist/shared/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const UpdateSubscriber = () => {
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

  // data of player
  const [originalData, setOriginalData] = useState<Data>();

  // playerToken from url
  const [playerToken, setPlayerToken] = useState("");

  // player id from url
  const [playerId, setPlayerId] = useState("");

  // Player Data
  const [name, setName] = useState<string>("");
  const [job, setJob] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [subStart, setSubStart] = useState<string>("");
  const [subEnd, SetSubEnd] = useState<string>("");
  const [subDuration, setSubDuration] = useState<number>();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  const router = useRouter();

  const getPlayerInfo = async () => {
    const urlForPage = new URL(`${DOMAIN_NAME}${getURL()}`);
    const token = urlForPage.searchParams.get("token") as string;
    const id = urlForPage.searchParams.get("id") as string;
    setPlayerId(id);
    setPlayerToken(token);

    // get the player info
    const message: any = await GET_SINGLE_SUBSCRIBER(id, token);

    // while true
    if (message.request.status == 200) {
      setOriginalData(message.data);

      // Set States To Default Data
      setName(message.data.name);
      setJob(message.data.job);
      setAddress(message.data.address);
      setTel(message.data.tel);
      setSubDuration(message.data.subDuration);
      setSubStart(message.data.subStart);
      setSubDuration(parseInt(message.data.subDuration));
      SetSubEnd(message.data.subEnd);
      // setRemainingSessions(parseInt(message.data.remainingSessions));

      // While Error
    } else if (message.request.status == 404) {
      // Run Alert
      Swal.fire({
        title: "فشل التحميل",
        text: message.response.data.message,
        icon: "error",
      });
    }
    // Hide Loading
    setLoading(false);
  };

  // Run Get Player Info
  useEffect(() => {
    getPlayerInfo();
  }, []);

  // fix

  // the type of subscription if day or month
  const [typeOfsubscription, setTypeOfSubscription] = useState("");

  // get the subscriptionInfo id
  const [subscriptionId, setSubscriptionId] = useState<any>();

  // Get All Subscription Info From Database To Anble Admin Choose From It
  interface SubscriptionInfo {
    id: number;
    duration: number;
    name: string;
    price: number;
    typeOfDuration: string;
  }
  // data of subscriptionInfo
  const [allSubscriptionInfo, setAllSubscriptionInfo] = useState<SubscriptionInfo[]>();

  // function to handle get all subscription info
  const getAllSubscriptionInfo = async () => {
    try {
      // loading the page
      // setPageLoading(true);

      // fetching the url
      const res: any = await axios.get(`/api/subscriptionInfo`);

      // while true
      if (res.request.status == 200) {
        setAllSubscriptionInfo(res.data);

        // while false
      } else {
        Swal.fire({
          title: "خطأ",
          titleText: res.response.data.message,
          icon: "error",
        });
      }

      // while server error
    } catch (error) {
      console.log(error);
    }

    // stop loading the page
    // setPageLoading(false);
  };

  // Run Funciton To Get Subscription Data
  useEffect(() => {
    getAllSubscriptionInfo();
  }, []);
  // fix

  // Check if data has changed
  const isDataChanged = () => {
    return (
      name !== originalData?.name ||
      job !== originalData?.job ||
      address !== originalData?.address ||
      tel !== originalData?.tel ||
      subStart !== originalData?.subStart ||
      String(subDuration) !== originalData?.subDuration ||
      subEnd !== originalData?.subEnd
      // ||
      // String(remainingSessions) !== originalData?.remainingSessions
    );
  };

  // Update Data Handler
  const updateHandler = async () => {
    setLoadingUpdate(true);

    const message: any = await UPDATE_SUBSCRIBER(
      playerId,
      playerToken,
      name,
      job,
      address,
      tel,
      subStart,
      subDuration,
      subEnd,
      // remainingSessions,
      subscriptionId
    );

    // While Success
    if (message.request.status == 200) {
      // Run An Alert
      Toast.fire({
        title: "تمت تعديل البيانات بنجاح",
        icon: "success",
      });

      // Route The User To The Player Info Page
      router.replace(`${DOMAIN_NAME}/allSubscriptions/${message.data.id}?token=${message.data.qrCode}`);

      // while error
    } else {
      // Run An Alert
      Swal.fire({
        title: "فشل التعديل",
        text: message.response.data.message,
        icon: "error",
      });
    }
    setLoadingUpdate(false);
  };

  // Confirm To Save The Updates
  const confirmUpdate = () => {
    if (isDataChanged()) {
      Swal.fire({
        title: "هل انت متأكد",
        text: "بتعديل البيانات لا يمكن الرجوع للبيانات السابقة",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "تعديل",
        cancelButtonText: "إلغاء",
      }).then((result) => {
        if (result.isConfirmed) {
          updateHandler();
        }
      });
    } else {
      Swal.fire({
        title: "لا يوجد تغييرات",
        text: " لم تقم بإجراء أي تغييرات على البيانات.",
        // confirmButtonText: "تمام",
        icon: "info",
      });
    }
  };

  // This To Calc The End Of Subscription
  useEffect(() => {
    if (subStart) {
      if (typeOfsubscription == "day") {
        const result = add(subStart, {
          days: subDuration,
        });

        const formatEndOfSub = format(result, "yyyy-MM-dd");

        SetSubEnd(formatEndOfSub);
      } else {
        const result = add(subStart, {
          months: subDuration,
        });

        const formatEndOfSub = format(result, "yyyy-MM-dd");
        SetSubEnd(formatEndOfSub);
      }
    }
  }, [subDuration, subStart, typeOfsubscription]);




  return (
    <div className="page-height py-[40px]">
      {loading ? (
        <SipnnerCom />
      ) : (
        <div>
          <h2 className="w-fit mx-auto text-3xl font-bold text-center text-warning">تعديل بيانات اللاعب {originalData?.name}</h2>
          <Divider className="w-1/2 mx-auto mt-2 mb-2" />
          <Divider className="w-1/2 mx-auto mt-2 mb-2" />
          <PageTitle titleText="معلومات اللاعب"></PageTitle>
          {originalData?.name ? (
            <div className="container">
              <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                <Input
                  defaultValue={originalData.name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-[400px] max-w-full"
                  type="text"
                  label="الاسم"
                  placeholder="ادخل اسم المشترك"
                  description={`اسم المشترك الحالي (${originalData.name})`}
                />
                <Input
                  defaultValue={originalData.job}
                  onChange={(e) => setJob(e.target.value)}
                  className="w-[400px] max-w-full"
                  type="text"
                  label="المهنة"
                  placeholder="ادخل مهنة المشترك"
                  description={`القيمة الحالية (${originalData.job})`}
                />
              </div>

              <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                <Input
                  defaultValue={originalData.address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-[400px] max-w-full"
                  type="text"
                  label="العنوان"
                  placeholder="ادخل عنوان المشترك"
                  description={`القيمة الحالية (${originalData.address})`}
                />
                <Input
                  defaultValue={originalData.tel}
                  onKeyDown={(e) => {
                    if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => setTel(e.target.value)}
                  className="w-[400px] max-w-full"
                  type="number"
                  label="رقم الهاتف"
                  placeholder="ادخل رقم هاتف المشترك"
                  description={`القيمة الحالية (${originalData.tel})`}
                />
              </div>

              <div>
                <Divider className="my-5" />
                <Divider className="my-5" />
              </div>

              <PageTitle titleText="معلومات الاشتراك"></PageTitle>

              <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                <div className="w-[400px] max-w-full">
                  <DatePicker
                    onChange={(e) => {
                      const datee = parse(`${e.year}/${e.day}/${e.month}`, "yyyy/dd/MM", new Date());

                      const formattedDate = datee.toString();
                      setSubStart(formattedDate);
                    }}
                    description={`تاريخ الحالي للمشترك ${format(originalData.subStart, "d-MM-yyyy")}`}
                    label="تاريخ بدأ الإشتراك"
                    className="w-full"
                  />
                </div>

                <div className="w-[400px] max-w-full">
                  {allSubscriptionInfo && (
                    <Select
                      onChange={(e) => {
                        setSubscriptionId(allSubscriptionInfo[parseInt(e.target.value)]?.id);
                        setTypeOfSubscription(allSubscriptionInfo[parseInt(e.target.value)]?.typeOfDuration);
                        setSubDuration(allSubscriptionInfo[parseInt(e.target.value)]?.duration);
                      }}
                      label="اختر مدة الإشتراك"
                      className="w-full"
                      description={`القيمة الحالية للمشترك هي ${originalData.subscriptionInfo.duration} ${
                        originalData.subscriptionInfo.typeOfDuration == "day" ? "يوم" : "شهر"
                      }`}
                    >
                      {allSubscriptionInfo.map((duration, i) => (
                        <SelectItem key={String(i)}>{duration.name}</SelectItem>
                      ))}
                    </Select>
                  )}
                </div>
              </div>

              <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                <div className="w-[400px] max-w-full">
                  <Input
                    onChange={(e) => SetSubEnd(e.target.value)}
                    className="w-full"
                    isDisabled
                    label="تاريخ انتهاء الاشتراك"
                    value={subEnd}
                    description={`القيمة الحالية (${originalData.subEnd})`}
                  />
                </div>
                <div className="w-[400px] max-w-full">
                  <Input
                    isDisabled
                    // onKeyDown={(e) => {
                    //   if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                    //     e.preventDefault();
                    //   }
                    // }}
                    // onChange={(e) => {
                    //   setRemainingSessions(parseInt(e.target.value));
                    // }}
                    // min={"0"}
                    // // type="number"
                    value={
                      typeOfsubscription == "day" && subDuration
                        ? String(subDuration * 1)
                        : typeOfsubscription == "month" && subDuration
                        ? String(subDuration * 30)
                        : ""
                    }
                    variant="faded"
                    label="عدد الحصص المتبقية"
                    description={`القيمة الحالية (${originalData.remainingSessions})`}
                  />
                </div>
              </div>

              <Button
                isLoading={loadingUpdate}
                onClick={confirmUpdate}
                size="lg"
                color="success"
                className="mt-5 w-fit mx-auto font-bold flex justify-center items-center"
              >
                حفظ البيانات
              </Button>
              <Button
                as={Link}
                href={`/allSubscriptions/${originalData.id}?token=${originalData.qrCode}`}
                size="lg"
                className="mt-5 w-fit mx-auto font-bold flex justify-center items-center"
              >
                إلغاء
              </Button>
            </div>
          ) : (
            <div className="absolute-center">
              <div>
                <h3 className="mt-3 text-7xl text-center font-extrabold text-danger">404 Error</h3>
              </div>
              <h2 className="text-2xl font-bold opacity-50 w-fit mt-3 text-center">لا يوجد مشترك بهذا ال ID</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateSubscriber;
