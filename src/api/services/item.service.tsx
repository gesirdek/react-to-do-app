import TodoItemModel from "../../models/todoItem.model";
import http from "../http-common";

const createItem = async (item: TodoItemModel) => {
    const query = `/items`;
    delete item.id;
    return await http.post(query, item);
};

const queryItems = async (status: string) => {
    const query = `/items?status=${status}&sortBy=updatedAt:desc`;
    return await http.get(query, {
        data: {
            status
        }
    });
};

const updateItemStatus = async (id: string, status: string) => {
    const query = `/items/${id}`;
    return await http.patch(query, { status });
};

const updateItemById = async (id: string, item: TodoItemModel) => {
    const query = `/items/${id}`;
    delete item.id;

    return await http.put(query, { ...item });
};

const deleteItemById = async (id: string) => {
    const query = `/items/${id}`;
    return await http.delete(query);
}

export {
    createItem,
    queryItems,
    updateItemStatus,
    updateItemById,
    deleteItemById
}