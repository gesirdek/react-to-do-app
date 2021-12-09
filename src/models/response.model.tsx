import TodoItemModel from "./todoItem.model";

export interface IResponseModel {
    results: TodoItemModel[],
    page: number,
    limit: number,
    totalPage: number,
    totalResults: number
}

export interface IDeleteResponse {
    status: string,
    id: string
}

export interface IUpdateResponse {
    prevStatus: string,
    result: TodoItemModel
}
