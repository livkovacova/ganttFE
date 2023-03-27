export interface PageData<T> {
    totalItems: number;
    totalPages: number;
    pageData: Array<T>;
}