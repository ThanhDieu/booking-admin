interface BaseAPIResponse<R = unknown, E = unknown> {
  data: R;
  success: boolean;
  message: string;
  errors: E;
  meta?: MetaData;
}

interface ErrorField {
  field: string;
  message: string;
}

interface BaseAPIError {
  errors: ErrorField[];
  message: string;
}

interface MetaData {
  totalPages: number;
  limit: number;
  total: number;
  page: number;
}
interface DataConfigType<T> {
  loading: boolean;
  ready: boolean;
  status: STATUS;
  data: AxiosResponse<BaseAPIResponse<T[], unknown>, unknown> | null;
  error: BaseAPIError | BaseAPIResponse;
}

interface PaginationType {
  perPage: number;
  currentPage: number;
  total: number;
}

interface DataResponseType<T> {
  data: T[];
  pagination?: PaginationType;
}

interface ResponseConfigType<T> {
  data: {
    data: DataResponseType<T>;
    code: number;
  };
}
