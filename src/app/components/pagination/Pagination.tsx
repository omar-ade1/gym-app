import { ROW_IN_PAGE } from "@/app/utils/rowsPerPage";
import { Pagination } from "@nextui-org/react";
import React from "react";

interface Props {
  pageNumber: number;
  count: number;
  setPageNumber: (page: number) => void;
}

const PaginationCom: React.FC<Props> = ({ pageNumber, count, setPageNumber }) => {
  return (
    <div className="flex w-full justify-center">
      <Pagination
        dir="ltr"
        isCompact
        showControls
        showShadow
        color="secondary"
        page={pageNumber}
        total={Math.ceil(count / ROW_IN_PAGE)}
        onChange={(page) => setPageNumber(page)}
      />
    </div>
  );
};

export default PaginationCom;
