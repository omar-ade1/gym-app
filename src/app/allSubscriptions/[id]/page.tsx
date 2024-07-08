"use client";
import PageTitle from "@/app/components/pageTitle/PageTitle";
import React, { useEffect, useState } from "react";
import { GET_SINGLE_SUBSCRIBER } from "@/app/fetchApi/subscriber/getSingleSubscriber";
import SipnnerCom from "@/app/components/sipnner/SipnnerCom";
import Swal from "sweetalert2";
import { Button, Divider, Input } from "@nextui-org/react";
import { format } from "date-fns";
import QRCodeComponent from "@/app/components/Barcode";
import Image from "next/image";
import { getURL } from "next/dist/shared/lib/utils";
import { DOMAIN_NAME } from "@/app/utils/domainName";
import Link from "next/link";
import { DELETE_SUBSCRIBER } from "@/app/fetchApi/subscriber/deleteSubscriber";
import { Toast } from "@/app/utils/smAlert";
import { useRouter } from "next/navigation";
import { UPDATE_SUBSCRIBER } from "@/app/fetchApi/subscriber/updateSubscriber";

interface Props {
  params: {
    id: string;
  };
}

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

const Profile: React.FC<Props> = ({ params }) => {
  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [playerToken, setPlayerToken] = useState("");

  const [reload, setReload] = useState(false);
  const router = useRouter();

  const getPlayerInfo = async () => {
    const ff = new URL(`${DOMAIN_NAME}${getURL()}`);
    const token = ff.searchParams.get("token") as string;
    setPlayerToken(token);

    const message: any = await GET_SINGLE_SUBSCRIBER(params.id, token);
    if (message.request.status == 200) {
      setData(message.data);
    } else if (message.request.status == 404) {
      Swal.fire({
        title: "غير موجود",
        text: message.response.data.message,
        icon: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    getPlayerInfo();
  }, [reload]);

  const handleDelete = async () => {
    if (data?.id && data.qrCode) {
      const message: any = await DELETE_SUBSCRIBER(data?.id, data?.qrCode);
      if (message.request.status == 200) {
        Toast.fire({
          title: message.data.message,
          icon: "success",
        });
        router.replace(`${DOMAIN_NAME}/allSubscriptions`);
      } else {
        Toast.fire({
          title: message.response.data.message,
          icon: "error",
        });
      }
    }
  };

  // Confirm To Delete The Data (Player)
  const confirmDelete = () => {
    Swal.fire({
      title: "هل انت متأكد",
      text: "سيتم حذف هذه البيانات بكل كلي من النظام !!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "حذف",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };

  // fix
  const logAttendance = async () => {
    if (data?.id && data?.qrCode) {
      if (parseInt(data.remainingSessions) > 0) {
        const message = await UPDATE_SUBSCRIBER(
          String(data?.id),
          data?.qrCode,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          parseInt(data.subDuration),
          undefined,
          data.subscriptionInfo.id,
          1
        );

        Toast.fire({
          title: "تم تسجيل حضور اللاعب بنجاح",
          icon: "success",
        });

        router.refresh();
        setReload(!reload);
      } else {
        Swal.fire({
          title: "انتهى الاشتراك",
          text: "هذا اللاعب انتهى اشتراكه لا يمكن تسجيل حضور له",
          icon: "error",
        });
      }
    }
  };
  // fix

  const confirmLog = () => {
    Swal.fire({
      title: "تسجيل حضور",
      text: "هل تريد تسجيل حضور للاعب",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "تسجيل",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        logAttendance();
      }
    });
  };

  return (
    <div className="page-height py-[40px]">
      {loading ? (
        <SipnnerCom />
      ) : (
        <div>
          <PageTitle titleText="معلومات اللاعب"></PageTitle>

          {data?.name ? (
            <div className="container">
              <div
                className={` ${
                  parseInt(data.remainingSessions) <= 5 && parseInt(data.remainingSessions) > 0
                    ? "text-warning"
                    : parseInt(data.remainingSessions) <= 0
                    ? "text-danger"
                    : ""
                } text-xl w-fit mx-auto my-5`}
              >
                {parseInt(data.remainingSessions) <= 5 && parseInt(data.remainingSessions) > 0
                  ? "اشتراك اللاعب على وشك الانتهاء"
                  : parseInt(data.remainingSessions) <= 0
                  ? "لقد انتهى اشتراك هذا اللاعب"
                  : ""}
              </div>
              <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                <Input className="w-[400px] max-w-full" isDisabled type="text" value={data.name} variant="bordered" label="اسم اللاعب" />
                <Input className="w-[400px] max-w-full" isDisabled type="text" value={data.job} variant="bordered" label="الوظيفة" />
              </div>

              <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                <Input className="w-[400px] max-w-full" isDisabled type="text" value={data.address} variant="bordered" label="العنوان" />
                <Input className="w-[400px] max-w-full" isDisabled type="text" value={data.tel} variant="bordered" label="رقم الهاتف" />
              </div>

              <div>
                <Divider className="my-5" />
              </div>

              <PageTitle titleText="الأدوات"></PageTitle>

              <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col print:hidden">
                <div className="grid gap-3">
                  <Button onClick={confirmLog} className="block" color="success">
                    تسجيل حضور
                  </Button>
                </div>
                <div className="grid gap-3">
                  <Button
                    as={Link}
                    href={`/allSubscriptions/updateSubscriber?id=${data.id}&token=${playerToken}`}
                    className="flex justify-center items-center"
                    color="warning"
                  >
                    تعديل البيانات
                  </Button>
                  <Button onClick={confirmDelete} className="block" color="danger">
                    حذف اللاعب
                  </Button>
                </div>
              </div>

              <div>
                <Divider className="my-5" />
              </div>

              <PageTitle titleText="معلومات الاشتراك"></PageTitle>

              <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                <Input
                  className="w-[400px] max-w-full"
                  isDisabled
                  type="text"
                  value={format(data.subStart, "yyyy-MM-dd")}
                  variant="bordered"
                  label="تاريخ بدأ الاشتراك"
                />
                <Input className="w-[400px] max-w-full" isDisabled type="text" value={data.subEnd} variant="bordered" label="تاريخ انتهاء الاشتراك" />
              </div>

              <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                <Input
                  className="w-[400px] max-w-full"
                  isDisabled
                  type="text"
                  value={`${data.subDuration} ${data.subscriptionInfo.typeOfDuration == "day" ? "يوم" : "شهر"}`}
                  variant="bordered"
                  label="مدة الاشتراك"
                />
                <Input
                  className="w-[400px] max-w-full"
                  isDisabled
                  type="text"
                  value={data.remainingSessions}
                  variant="bordered"
                  label="عدد الحصص المتبقية"
                />
              </div>

              <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                <Input
                  className="w-[400px] max-w-full"
                  isDisabled
                  type="text"
                  value={`${data.subscriptionInfo.name}`}
                  variant="bordered"
                  label="اسم الاشتراك"
                />
                <Input
                  className="w-[400px] max-w-full"
                  isDisabled
                  type="text"
                  value={`${String(data.subscriptionInfo.price)} جنية`}
                  variant="bordered"
                  label="سعر الاشتراك $"
                />
              </div>

              <div>
                <Divider className="my-5" />
              </div>

              <div className="flex flex-col justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
                <PageTitle titleText="الباركود" />
                <div className="bg-white p-5 max-w-full rounded-xl">
                  <QRCodeComponent value={data.qrCode} />
                </div>
              </div>

              <div>
                <Divider className="my-5" />
              </div>

              {data.imageUrl ? (
                <div>
                  {showImage && (
                    <div className="my-5 w-fit mx-auto print:hidden">
                      <Image width={250} height={250} className="!max-w-full block rounded-xl" src={data.imageUrl} alt="صورة اللاعب"></Image>
                    </div>
                  )}
                  <Button
                    onClick={() => setShowImage(!showImage)}
                    variant="faded"
                    color="warning"
                    className="block w-fit mx-auto font-bold print:hidden"
                  >
                    {showImage ? "اخفاء الصورة" : "عرض صورة اللاعب"}
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold w-fit mx-auto opacity-50">لا يوجد صورة لهذا اللاعب</h3>
                </div>
              )}
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

export default Profile;
