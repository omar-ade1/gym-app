"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "../components/pageTitle/PageTitle";
import axios from "axios";
import Swal from "sweetalert2";
import SipnnerCom from "../components/sipnner/SipnnerCom";
import { Button, Divider, Input, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { Toast } from "../utils/smAlert";

const MangeSubscriptions = () => {
  // interface Data {
  //   id: number;
  //   name: string;
  //   job: string;
  //   address: string;
  //   tel: string;
  //   subStart: string;
  //   subDuration: string;
  //   subEnd: string;
  //   remainingSessions: string;
  //   imageUrl: string;
  //   createdAt: string;
  //   updatedAt: string;
  // }

  // const [data, setData] = useState<Data[]>();
  // const [isLoading, setIsLoading] = useState(true);

  // Get All Players
  // const handleGetAllPlayer = async () => {
  //   const res: any = await axios.get("/api/allSubscribers");
  //   if (res.request.status == 200) {
  //     setData(res.data);
  //   } else {
  //     Swal.fire({
  //       title: "خطأ في البيانات",
  //       text: res.response?.data.message,
  //       icon: "error",
  //     });
  //   }

  //   setIsLoading(false);
  // };

  // useEffect(() => {
  //   handleGetAllPlayer();
  // }, []);

  interface SubscriptionInfo {
    id: number;
    duration: number;
    name: string;
    price: number;
    typeOfDuration: string;
    subscribers: [
      {
        id: number;
        name: string;
      }
    ];
  }

  const [allSubscriptionInfo, setAllSubscriptionInfo] = useState<SubscriptionInfo[]>();
  const [duration, setDuration] = useState<number>();
  const [typeOfDuration, setTypeOfDuration] = useState<string>("month");
  const [name, setName] = useState<string>();
  const [price, setPrice] = useState<number>();

  const [reload, setReload] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const getAllSubscriptionInfo = async () => {
    try {
      setIsLoading(true);
      const res: any = await axios.get(`/api/subscriptionInfo`);
      if (res.request.status == 200) {
        setAllSubscriptionInfo(res.data);
      } else {
        Swal.fire({
          title: "خطأ",
          titleText: res.response.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllSubscriptionInfo();
  }, [reload]);

  const addNewSubscription = async () => {
    try {
      const res: any = await axios.post(`/api/subscriptionInfo`, {
        duration,
        name,
        price,
        typeOfDuration,
      });
      console.log(true);

      if (res.request.status == 200) {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
        setReload(!reload);
      } else {
        console.log(res);
        Swal.fire({
          title: "خطأ",
          titleText: res.response.data.message,
          icon: "error",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "خطأ",
        titleText: error.response.data.message,
        icon: "error",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res: any = await axios.delete(`/api/subscriptionInfo/${id}`);
      if (res.request.status == 200) {
        Toast.fire({
          title: res.data.message,
          icon: "success",
        });
        setReload(!reload);
      } else {
        Toast.fire({
          title: res.response.data.message,
          icon: "error",
        });
      }
    } catch (error: any) {
      console.log(error);
      Toast.fire({
        title: error.response.data.message,
        icon: "error",
      });
    }
  };

  // Confirm To Delete The Data (Player)
  const confirmDelete = (id: number) => {
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
        handleDelete(id);
      }
    });
  };

  return (
    <div className="page-height py-[40px]">
      {/* {isLoading ? (
        <SipnnerCom />
      ) : ( */}
      <div>
        <PageTitle titleText="إدارة الاشتراكات" />
        <Divider className="w-1/2 mx-auto" />
        <div className="container mt-10">
          <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
            <Input
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-[400px] max-w-full"
              label="مدة الاشتراك"
              placeholder="ادخل مدة الاشتراك"
              endContent={
                <div className="flex items-center">
                  <label className="sr-only" htmlFor="currency">
                    Currency
                  </label>
                  <select
                    onChange={(e) => setTypeOfDuration(e.target.value)}
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                    id="currency"
                    name="currency"
                  >
                    <option value="month">شهر</option>
                    <option value="day">يوم</option>
                  </select>
                </div>
              }
              type="number"
            />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-[400px] max-w-full"
              type="text"
              label="اسم الاشتراك"
              placeholder="ادخل اسم الاشتراك"
            />
          </div>

          <div className="flex justify-around items-center w-[900px] max-w-full gap-5 mx-auto mb-5 xxsm:flex-col">
            <Input
              onChange={(e) => setPrice(parseInt(e.target.value))}
              className="w-[400px] max-w-full"
              type="number"
              label="سعر الاشتراك"
              placeholder="ادخل سعر الاشتراك"
            />
          </div>
          <Button onClick={() => addNewSubscription()} color="primary" className="w-fit block mx-auto">
            اضافة
          </Button>

          <div className="mt-5">
            <Divider className="mt-5" />
            <Divider className="mt-5" />
          </div>

          <div className="mt-5">
            <PageTitle titleText="الاشتراكات الحالية" />
            <p className="w-fit text-center mx-auto mb-5 text-warning">يرجى العلم انه لا يمكن حذف اشتراك اذا كان هناك لاعبين مسجيل في هذا الاشتراك</p>
            <div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>الاسم</TableColumn>
                  <TableColumn>مدة الاشتراك</TableColumn>
                  <TableColumn>السعر</TableColumn>
                  <TableColumn>عدد المشتركين</TableColumn>
                  <TableColumn>الأدوات</TableColumn>
                </TableHeader>
                <TableBody isLoading={isLoading} loadingContent={<Spinner label="جاري التحميل" />} emptyContent="لا يوجد بيانات">
                  {allSubscriptionInfo
                    ? allSubscriptionInfo.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            {item.duration} {item.typeOfDuration == "month" ? "شهر" : "يوم"}
                          </TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>{item.subscribers.length}</TableCell>
                          <TableCell>
                            <Button onClick={() => confirmDelete(item.id)} color="danger" variant="flat">
                              حذف الاشتراك
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    : []}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangeSubscriptions;
