"use client";
import { Button, DatePicker, Input, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { add, format, parse } from "date-fns";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { FaCamera } from "react-icons/fa6";
import { ADD_SUBSCRIBER } from "../fetchApi/subscriber/addSubscriber";
import { Toast } from "../utils/smAlert";
import { useRouter } from "next/navigation";
import { DOMAIN_NAME } from "../utils/domainName";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import SipnnerCom from "../components/sipnner/SipnnerCom";

const AddSubscriber = () => {
  const [name, setName] = useState<string>("");
  const [job, setJob] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [subStart, setSubStart] = useState<string>("");
  const [subEnd, SetSubEnd] = useState<string>("");
  const [subDuration, setSubDuration] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  // the type of subscription if day or month
  const [typeOfsubscription, setTypeOfSubscription] = useState("");

  // get the subscriptionInfo id
  const [subscriptionId, setSubscriptionId] = useState<any>();

  const router = useRouter();

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

  // Get The Url Of Image
  const [imageUrl, setImageUrl] = useState<string>("");
  const handleUploadSuccess = (result: any) => {
    if (result.event === "success") {
      setImageUrl(result.info.secure_url);
    }
  };

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
      setPageLoading(true);

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
    setPageLoading(false);
  };

  // Run Funciton To Get Subscription Data
  useEffect(() => {
    getAllSubscriptionInfo();
  }, []);

  // Handle Add A New Subscriber
  const handleAddSub = async () => {
    setLoading(true);
    const message: any = await ADD_SUBSCRIBER(
      name,
      job,
      address,
      tel,
      subStart,
      String(subDuration),
      subEnd,
      imageUrl.length > 0 ? imageUrl : undefined,
      subscriptionId
    );

    // While Successful
    if (message.request.status == 200) {
      Toast.fire({
        title: message.data.message,
        icon: "success",
      });
      router.replace(`${DOMAIN_NAME}/allSubscriptions`);

      // While Error
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
    setLoading(false);
  };

  return (
    <div className="py-[40px]  page-height">
      {pageLoading ? (
        <SipnnerCom />
      ) : (
        <>
          {allSubscriptionInfo?.length ? (
            <>
              <h2 className="text-2xl font-bold text-center">إضافة مشترك جديد</h2>
              <div className="container pt-[20px]">
                <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    className="w-[400px] max-w-full"
                    type="text"
                    label="الاسم"
                    placeholder="ادخل اسم المشترك"
                  />
                  <Input
                    onChange={(e) => setJob(e.target.value)}
                    className="w-[400px] max-w-full"
                    type="text"
                    label="المهنة"
                    placeholder="ادخل مهنة المشترك"
                  />
                </div>

                <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                  <Input
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-[400px] max-w-full"
                    type="text"
                    label="العنوان"
                    placeholder="ادخل عنوان المشترك"
                  />
                  <Input
                    onKeyDown={(e) => {
                      if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      setTel(e.target.value);
                    }}
                    className="w-[400px] max-w-full"
                    type="number"
                    label="رقم الهاتف"
                    placeholder="ادخل رقم هاتف المشترك"
                  />
                </div>

                <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                  <div className="w-[400px] max-w-full">
                    <DatePicker
                      onChange={(e) => {
                        const datee = parse(`${e.year}/${e.day}/${e.month}`, "yyyy/dd/MM", new Date());

                        const formattedDate = datee.toString();
                        setSubStart(formattedDate);
                      }}
                      description={`تاريخ اليوم هو ${format(new Date(), "d-MM-yyyy")}`}
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
                          // console.log(e.target.value);
                          // console.log(allSubscriptionInfo[parseInt(e.target.value)]?.id);
                          // console.log(allSubscriptionInfo[parseInt(e.target.value)]?.typeOfDuration);
                          // console.log(allSubscriptionInfo[parseInt(e.target.value)]?.duration);
                        }}
                        label="اختر مدة الإشتراك"
                        className="w-full"
                        description="القيمة الافتراضية هي شهر واحد"
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
                    <Input onChange={(e) => SetSubEnd(e.target.value)} className="w-full" disabled label="تاريخ انتهاء الاشتراك" value={subEnd} />
                  </div>
                </div>

                {!imageUrl && (
                  <div className="mt-5">
                    <CldUploadWidget
                      uploadPreset="ml_default"
                      options={{
                        language: "ar",
                        sources: ["camera", "local"],
                        multiple: false,
                        singleUploadAutoClose: false,
                      }}
                      onSuccess={handleUploadSuccess}
                    >
                      {({ open }) => {
                        return (
                          <Button
                            variant="faded"
                            size="lg"
                            className="w-[300px] mx-auto flex justify-center items-center max-w-full"
                            color="warning"
                            type="button"
                            onClick={() => open()}
                          >
                            التقاط صورة للمشترك <FaCamera />
                          </Button>
                        );
                      }}
                    </CldUploadWidget>
                  </div>
                )}

                {imageUrl && (
                  <div className="mx-auto w-fit mt-5 flex flex-col justify-center items-center gap-3 border rounded-xl p-3 shadow-xl">
                    <h3 className="text-xl">صورة المشترك</h3>
                    <Image className="rounded-xl max-w-full block object-cover" width={300} height={300} src={imageUrl} alt="صورة المشترك" />
                  </div>
                )}

                <div className="mt-5">
                  <Button
                    variant="shadow"
                    isLoading={loading}
                    onClick={handleAddSub}
                    size="lg"
                    color="primary"
                    className="w-[300px] max-w-full mx-auto flex justify-center items-center "
                  >
                    إضافة المشترك
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="absolute-center flex justify-center items-center flex-col">
                <h2 className="text-xl font-bold opacity-50 text-center mb-5">يجب عليك اضافة معلومات الاشتراكات في البداية </h2>
                <Button color="primary" variant="shadow" as={Link} href="/manageSubscriptions">
                  اضافة معلومات الاشتراكات
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AddSubscriber;
