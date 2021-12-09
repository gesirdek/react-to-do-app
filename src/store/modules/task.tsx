import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import TaskModel from '../../models/task.model';
import TodoItemModel from '../../models/todoItem.model';
import * as itemService from '../../api/services/item.service';
import { IResponseModel, IDeleteResponse, IUpdateResponse } from '../../models/response.model';
import { WritableDraft } from '@reduxjs/toolkit/node_modules/immer/dist/internal';
import { IAddRequest, IDeleteRequest, IUpdateByIdRequest, IUpdateByStatusRequest } from '../../models/request.model';

interface ITaskState {
    tasks: TaskModel[],
    sortBy: string,
    page: number,
    perPage: number
}

interface ILoadItem {
    status: string,
    result: IResponseModel
}

export const fetchItemsByStatus = createAsyncThunk(
    'items/queryItemsStatus',
    async (status:string, _) : Promise<ILoadItem> => {
        const response = await itemService.queryItems(status);
        return { status: status, result: response.data }
    }
)

export const addNewItem = createAsyncThunk(
    'items/addNewItem',
    async (params: IAddRequest, _) : Promise<TodoItemModel> => {
        const response = await itemService.createItem(params);
        return response.data
    }
)

export const updateItemByStatus = createAsyncThunk(
    'items/updateItemStatus',
    async (params: IUpdateByStatusRequest, _) : Promise<IUpdateResponse> => {
        const response = await itemService.updateItemStatus(params.id, params.status);
        return { prevStatus: params.prevStatus, result: response.data }
    }
)

export const deleteItem = createAsyncThunk(
    'items/deleteItem',
    async (params: IDeleteRequest, _) : Promise<IDeleteResponse> => {
        await itemService.deleteItemById(params.id);
        return { status: params.status, id: params.id }
    }
)

export const updateItemById = createAsyncThunk(
    'items/updateItemById',
    async (params: IUpdateByIdRequest, _) : Promise<IUpdateResponse> => {
        const response = await itemService.updateItemById(params.id, params);
        return { prevStatus: params.prevStatus || params.status, result: response.data }
    }
)

const initialState: ITaskState = { tasks: [
    { key: "open", value:[] },
    { key: "inprogress", value:[] },
    { key: "done", value:[] }], sortBy: '', page: 1, perPage: 10 };


const removeFromPrevList = (state: WritableDraft<ITaskState>, result: IUpdateResponse) => {
     const list = state.tasks.filter(task => task.key === result.prevStatus)[0];
     list.value = list.value.filter(item => item.id !== result.result.id);
}
// unshift is used because lists are ordered based on updatedAt by desc.
export const itemSlice = createSlice({
    name: 'itemParameters',
    initialState,
    reducers: { },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchItemsByStatus.fulfilled, (state, action) => {
            const { status, result } : ILoadItem = action.payload;
            state.tasks.filter(task => task.key === status)[0].value = result.results;
        });
        builder.addCase(addNewItem.fulfilled, (state, action) => {
            const result: TodoItemModel = action.payload;
            const newList = state.tasks.filter(task => task.key === result.status)[0];
            newList.value.unshift(result);
        });
        builder.addCase(deleteItem.fulfilled, (state, action) => {
            const { id, status }: IDeleteResponse = action.payload;

            const list = state.tasks.filter(task => task.key === status)[0];
            list.value = list.value.filter(item => item.id !== id);
        });
        builder.addCase(updateItemByStatus.fulfilled, (state, action) => {
            const result: IUpdateResponse = action.payload;
            // Status changed so remove from prev list
            removeFromPrevList(state, result);
            
            // Add to new list
            const newList = state.tasks.filter(task => task.key === result.result.status)[0];
            newList.value.unshift(result.result);
        });
        builder.addCase(updateItemById.fulfilled, (state, action) => {
            const result: IUpdateResponse = action.payload;
            const newItem:TodoItemModel = {
                title: result.result.title,
                description: result.result.description,
                id: result.result.id,
                status: result.result.status,
                createdAt: result.result.createdAt,
                updatedAt: result.result.updatedAt
            }

            if(result.prevStatus !== result.result.status) {
                // Status changed so remove from prev list
                removeFromPrevList(state, result);
                // Add to new list
                const newList = state.tasks.filter(task => task.key === result.result.status)[0];
                newList.value.unshift(newItem);
            } else {
                const list = state.tasks.filter(task => task.key === result.result.status)[0]; // find related list by status
                const item = list.value.filter(item => item.id === result.result.id)[0];
                item.title = newItem.title;
                item.description = newItem.description;
                item.updatedAt = newItem.updatedAt;

                // need to add a add-remove logic to update store manually because we are watching for the tasks
                list.value = list.value.filter(item => item.id !== result.result.id); 
                list.value.unshift(item);
            }
        });
    }
});

export default itemSlice.reducer