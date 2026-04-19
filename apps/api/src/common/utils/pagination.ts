import { PaginationQueryDto } from '../dto/pagination-query.dto';

export function getPagination(query: PaginationQueryDto) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function toPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
) {
  return {
    data: items,
    meta: {
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize) || 1,
    },
  };
}

