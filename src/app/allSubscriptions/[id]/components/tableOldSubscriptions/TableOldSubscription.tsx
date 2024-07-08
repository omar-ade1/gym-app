// "use client";

// import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
// import axios from "axios";
// import React, { useEffect, useState } from "react";

// interface Data {
//   id: number;
//   duration: number;
//   typeOfDuration: string;
//   name: string;
//   price: number;
// }

// const TableOldSubscription = () => {
//   const [data, setData] = useState<Data[]>();

//   const getOldSubscription = async () => {
//     try {
//       const res: any = await axios.get("/api/oldSubscription");
//       if (res.request.status == 200) {
//         setData(res.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getOldSubscription();
//   }, []);

//   return (
//     <Table
//       lang="en"
//       cellPadding={20}
//       aria-label="Example table with dynamic content"
//       shadow="lg"

//       // bottomContent={data?.length > 0 && <PaginationCom pageNumber={pageNumber} count={countSub} setPageNumber={setPageNumber} />}
//     >
//       <TableHeader>
//         <TableColumn className="text-lg">#</TableColumn>
//         <TableColumn className="text-lg">id</TableColumn>
//         <TableColumn className="text-lg">الاسم</TableColumn>
//         <TableColumn className="text-lg">مدة الاشتراك</TableColumn>
//         <TableColumn className="text-lg">عدد الحصص</TableColumn>
//         <TableColumn className="text-lg">تاريخ بدأ الاشتراك</TableColumn>
//         <TableColumn className="text-lg">تاريخ انتهاء الاشتراك</TableColumn>
//         <TableColumn className="text-lg">السعر</TableColumn>
//       </TableHeader>

//       <TableBody
//         emptyContent={"لم يتم العثور اشتراكات سابقة"}
//         // loadingContent={<Spinner />} loadingState={loadingTable ? "loading" : "idle"}
//       >
//         {data
//           ? data.map((item, i) => {
//               return (
//                 <TableRow key={item.id}>
//                   <TableCell className="p-5">{i + 1}</TableCell>
//                   <TableCell className="p-5">{item.id}</TableCell>
//                   <TableCell className="p-5">{item.name}</TableCell>
//                   <TableCell className="p-5">{item.name}</TableCell>
//                   <TableCell className="p-5">{item.name}</TableCell>
//                   <TableCell className="p-5">{item.name}</TableCell>
//                   <TableCell className="p-5">{item.name}</TableCell>
//                   <TableCell className="p-5">{item.name}</TableCell>
//                 </TableRow>
//               );
//             })
//           : []}
//       </TableBody>
//     </Table>
//   );
// };

// export default TableOldSubscription;
