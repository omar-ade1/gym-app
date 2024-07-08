"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@nextui-org/react";
import PageTitle from "../../components/pageTitle/PageTitle";
import { z } from "zod";
import { DOMAIN_NAME } from "../../utils/domainName";
import useSound from "use-sound";
import Link from "next/link";
import axios from "axios";
import { format } from "date-fns";
import { Toast } from "@/app/utils/smAlert";
import { UPDATE_SUBSCRIBER } from "@/app/fetchApi/subscriber/updateSubscriber";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const QrScan: React.FC = () => {
  // For The Qr Result
  const [result, setResult] = useState<any>("");

  // To Start Scan Again
  const [again, setAgain] = useState(false);

  // Run The Successful Sound
  const [playSoundCorrect] = useSound("./aduio/correct.wav");

  // Run The Failed Sound
  const [playSoundError] = useSound("./aduio/error.wav");

  // For Check If Player Is Exsist Or Not
  const [isPlayerExsist, setIsPlayerExsist] = useState(false);

  // For Buttons To Run Sounds
  const buttonRefCorrect = useRef<HTMLButtonElement | null>(null);
  const buttonRefError = useRef<HTMLButtonElement | null>(null);

  const router = useRouter();

  // fix
  // fix
  const logAttendance = async () => {
    if (result?.id && result?.qrCode) {
      if (parseInt(result.remainingSessions) > 0) {
        const message = await UPDATE_SUBSCRIBER(
          String(result?.id),
          result?.qrCode,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          parseInt(result.subDuration),
          undefined,
          result.subscriptionInfo.id,
          1
        );

        Toast.fire({
          title: "تم تسجيل حضور اللاعب بنجاح",
          icon: "success",
        });
        router.replace(`/allSubscriptions/${result.id}?token=${result.qrCode}`);
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

  // Scanner Function
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      false
    );

    // Success Function
    const success = async (result: any) => {
      scanner.clear();

      // Schema Of Qr Code Url And Check It
      const schema = z.string();
      const validation = schema.safeParse(result);

      // If False Run Failed Sound
      if (!validation.success) {
        buttonRefError?.current?.click();
        setResult("This Link Is Not Available");
        setIsPlayerExsist(false);
      } else {
        // If No Token
        if (!result) {
          setResult("هذا الرابط غير صالح");
          buttonRefError?.current?.click();
          return setIsPlayerExsist(false);
        }

        try {
          const response = await axios.get(`${DOMAIN_NAME}/api/qrCode?token=${result}`);

          // If The Scan Qr Code Find The Subscriber
          if (response.status === 200) {
            buttonRefCorrect?.current?.click();
            setIsPlayerExsist(true);
            setResult(response.data);

            // If No Subscriber
          } else {
            setResult("هذا الرابط غير صالح");
            buttonRefError?.current?.click();
            setIsPlayerExsist(false);
          }
        } catch (error) {
          console.log(error);
          setResult("حدث خطأ أثناء التحقق من الرمز");
          buttonRefError?.current?.click();
          setIsPlayerExsist(false);
        }

        //fix
      }
    };

    const error = (err: any) => {
      console.warn(err);
    };

    scanner.render(success, error);

    // Clear The Scanner When Exit Of The Page
    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear scanner:", error);
      });
    };

    // Run The Scanner Again When Again Value Is Changed
  }, [again]);

  return (
    <div className="page-height py-[40px]">
      <div className="container">
        <div>
          <PageTitle titleText="التحقق ب الباركود" />
        </div>
        {result ? (
          <div className="rounded-xl !p-5">
            <div className="flex flex-col border p-4 rounded-xl shadow-xl">
              {isPlayerExsist ? (
                <div className="flex justify-center items-center flex-col">
                  <h2 className="text-3xl font-bold my-5 text-success">اللاعب موجود بالفعل</h2>
                  <h3
                    className={` ${
                      parseInt(result.remainingSessions) <= 5 && parseInt(result.remainingSessions) > 0
                        ? "text-warning"
                        : parseInt(result.remainingSessions) <= 0
                        ? "text-danger"
                        : ""
                    } text-xl w-fit mx-auto my-5`}
                  >
                    {parseInt(result.remainingSessions) <= 5 && parseInt(result.remainingSessions) > 0
                      ? "اشتراك اللاعب على وشك الانتهاء"
                      : parseInt(result.remainingSessions) <= 0
                      ? "لقد انتهى اشتراك هذا اللاعب"
                      : ""}
                  </h3>
                  <div>
                    <h2 className="text-xl my-5 text-green-600">
                      اسم اللاعب : <span className="dark:text-white font-bold">{result.name}</span>
                    </h2>
                    <h3 className="text-xl my-5 text-green-600">
                      عدد الحصص المتبقية : <span className="dark:text-white font-bold">{result.remainingSessions}</span>
                    </h3>
                    <h3 className="text-xl my-5 text-green-600">
                      تاريخ بدأ الاشتراك :{" "}
                      <span className="dark:text-white font-bold" dir="ltr">
                        {format(result.subStart, "yyyy/MM/dd")}
                      </span>
                    </h3>
                    <h3 className="text-xl my-5 text-green-600">
                      تاريخ انتهاء الاشتراك :{" "}
                      <span className="dark:text-white font-bold" dir="ltr">
                        {result.subEnd}
                      </span>
                    </h3>
                    <h3 className="text-xl my-5 text-green-600">
                      مدة الاشتراك: <span className="dark:text-white font-bold">{result.subDuration} شهر</span>
                    </h3>
                  </div>
                  <Button
                    as={Link}
                    href={`${DOMAIN_NAME}/allSubscriptions/${result.id}?token=${result.qrCode}`}
                    variant="shadow"
                    color="success"
                    className="flex justify-center items-center"
                  >
                    عرض بروفايل للاعب
                  </Button>
                  <Button onClick={confirmLog} variant="shadow" color="primary" className="flex justify-center items-center mt-5">
                    تسجيل حضور اللاعب
                  </Button>
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl font-bold my-5 text-danger">اللاعب غير موجود</h2>
                </div>
              )}
            </div>

            <Button
              color="warning"
              variant="ghost"
              className="mt-5 block mx-auto"
              onClick={() => {
                setResult("");
                setAgain(!again);
              }}
            >
              المحاولة مرة اخرى
            </Button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-[700px] max-w-full mx-auto rounded-xl shadow-xl p-5" id="reader"></div>
        )}
        <Button
          className="hidden"
          ref={buttonRefCorrect}
          onClick={() => {
            playSoundCorrect();
          }}
        >
          play
        </Button>
        <Button
          className="hidden"
          ref={buttonRefError}
          onClick={() => {
            playSoundError();
          }}
        >
          play
        </Button>
      </div>
    </div>
  );
};

export default QrScan;
