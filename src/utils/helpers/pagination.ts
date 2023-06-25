import { Pagination } from "@utils/api/response";

interface PaginatedData {
    result: any[];
    pagination: Pagination;
}

const buildPagination = (
    data: any[],
    currentPage: number = 1,
    limit: number = 10
) => {
    // const result: PaginatedData = {result: data, pagination: };
    // return result;
};

export { buildPagination };
