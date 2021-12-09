import TodoItemModel from "./todoItem.model";

export default interface ITaskModel {
    key: string,
    value: TodoItemModel[]
}