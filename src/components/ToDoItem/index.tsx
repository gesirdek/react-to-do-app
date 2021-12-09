import { useDrag } from 'react-dnd'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import UpdateIcon from '@mui/icons-material/Update';
import ClearIcon from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';
import TodoItemModel from '../../models/todoItem.model';
import { useState } from 'react';
import ItemForm from '../ItemForm';
import styles from './ToDoItem.module.scss';
import { useAppDispatch } from '../../store';
import IUploadStatusModel from '../../models/uploadItem.model';
import { Divider, IconButton, Tooltip } from '@mui/material';
import OkCancelDialog from '../OKCancelDialog';
import { deleteItem, updateItemById, updateItemByStatus } from '../../store/modules/task';
import { IUpdateByIdRequest } from '../../models/request.model';

interface IToDoItem {
    todoItem: TodoItemModel
}

interface DropResult {
    name: string,
}

function ToDoItem(props:IToDoItem) {
    const dispatch = useAppDispatch();

    const [,drag] = useDrag({
        type: "BOX",
        end: (_, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>();
            const dropResultName = dropResult && dropResult.name;
            const stateParams: IUploadStatusModel = { 
                id: props.todoItem.id || '',
                status: dropResultName || '', 
                prevStatus: props.todoItem.status
            };

            const updateItem = async () => {
                const itemUpdated = await dispatch(updateItemByStatus(stateParams)).unwrap();
            }

            updateItem();
        }
    });

    const [updateform, setUpdateForm] = useState<boolean>();
    const [okCancel, setOkCancel] = useState<boolean>();

    const deleteConfirm = () => {
        const deleteItemById = async () => {
            await dispatch(deleteItem({ status: props.todoItem.status, id: props.todoItem.id || ''})).unwrap();
        }

        deleteItemById();
        setOkCancel(false);
    };

    const saveUpdateForm = (item: TodoItemModel) => {
        item.id = props.todoItem.id;
        item.status = props.todoItem.status;
        const params:IUpdateByIdRequest = {
            description: item.description,
            id: props.todoItem.id || '',
            status: props.todoItem.status,
            title: item.title
        }

        const updateItem = async () => {
            await dispatch(updateItemById(params)).unwrap();
        }

        updateItem();

        setUpdateForm(false);
    }

    return (
        <div ref={drag} key={props.todoItem.id}>
            <Card className={styles['top-space']}>
                <CardActions className={`${styles['action-container']}`} >
                    <Tooltip title="Drag and Drop to change the status">
                        <IconButton>
                            <HelpOutlineIcon className={`${styles['icon']} ${styles['icon-info']}`} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Update">
                        <IconButton onClick={() => setUpdateForm(true)}>
                            <UpdateIcon className={`${styles['icon']}`} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => setOkCancel(true)}>
                            <ClearIcon className={`${styles['icon']} ${styles['icon-delete']}`} />
                        </IconButton>
                    </Tooltip>
                </CardActions>
                <Divider />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        { props.todoItem.title }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        { props.todoItem.description }
                    </Typography>
                </CardContent>
            </Card>
            {updateform && <ItemForm 
                handleClose={() => setUpdateForm(false)}
                clickOK={saveUpdateForm}
                header={`You are going to update "${props.todoItem.title}"`}
                title={props.todoItem.title}
                description={props.todoItem.description}
                status={props.todoItem.status}
                open={updateform}
            ></ItemForm> }
            {okCancel && <OkCancelDialog
                handleClose={() => setOkCancel(false)}
                handleClick={deleteConfirm}
                title={'Please confirm to delete below title'}
                description={`Are you sure want to delete "${props.todoItem.title}"?`}
                open={okCancel}
            ></OkCancelDialog> }
        </div>
    );
}

export default ToDoItem;