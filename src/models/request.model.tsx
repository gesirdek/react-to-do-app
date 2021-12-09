export interface IUpdateByStatusRequest {
    status: string,
    prevStatus: string,
    id: string
}

export interface IUpdateByIdRequest {
    prevStatus?: string,
    status: string,
    title: string,
    description: string,
    id: string
}

export interface IAddRequest {
    status: string,
    title: string,
    description: string
}

export interface IDeleteRequest {
    status: string,
    id: string
}