import Grid from '@mui/material/Grid';
import { useDrop } from 'react-dnd';
import { addNewItem, fetchItemsByStatus } from '../../store/modules/task';
import ToDoItem from '../ToDoItem/index';
import TodoItemModel from '../../models/todoItem.model';
import styles from './ListContainer.module.scss';
import { Card, CardActions, CardContent, IconButton, Paper, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store';
import ItemForm from '../ItemForm';
import { IResponseModel } from '../../models/response.model';
import { RootStateOrAny, useSelector } from 'react-redux';
import ITaskModel from '../../models/task.model';

interface IListContainer {
    status: string,
    tasks?: TodoItemModel[]
}

interface ITitleType {
    key: string,
    value: string
}

function ListContainer(props:IListContainer) {
    
    const [list, setList] = useState<IResponseModel>();
    const [addForm, setAddForm] = useState<boolean>();
    const { tasks } = useSelector((state: RootStateOrAny) => state.task);
    const titles:ITitleType[] = [
        { key: 'open', value: 'Open' },
        { key: 'inprogress', value: 'In Progress' },
        { key: 'done', value: 'Finished'}
    ];
    const pageTitle = titles.filter(title => title.key === props.status)[0].value.toUpperCase();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const loadItems = async () => {
            const itemsList = await dispatch(fetchItemsByStatus(props.status)).unwrap();
            setList(itemsList.result);
        }

        loadItems();
    }, [dispatch, props.status]);

    const [, drop] = useDrop(() => ({
        accept: "BOX",
        drop: () => ({ name: props.status }),
    }));

    useEffect(() => {
        const items = tasks.filter((task: ITaskModel) => task.key === props.status)[0].value;
        const listObj:IResponseModel = {
            results: items,
            page: list?.page || 1,
            limit: list?.limit || 0,
            totalPage: list?.totalPage || 0,
            totalResults: list?.totalResults || 0
        };

        setList(listObj);
    }, [tasks]); // check updates for tasks in redux store. If any change occurs, updates the content displayed.


    const saveForm = (item: TodoItemModel) => {
        item.status = props.status;

        const addItem = async () => {
            await dispatch(addNewItem(item)).unwrap();
        }

        addItem();
        setAddForm(false);
    }

    return (
        <Grid
            item
            justifyContent="center"
            alignItems="center"
            xs={3}
            className={styles['list-container']}
        >
            <Card>
                <CardActions
                    className={`${styles['list-container-header']} ${styles[`list-container-header-${props.status}`]}`}
                >
                    <Paper className={styles["actions-container"]}>
                        <h4 className={styles["column-title"]}> { pageTitle } </h4>
                                      
                    </Paper>
                    <Tooltip title="Add">
                        <IconButton onClick={() => setAddForm(true)}>
                            <AddIcon className={styles["add-item-button"]} />
                        </IconButton>
                    </Tooltip>    
                </CardActions>
                <CardContent
                    ref={drop}
                    color="blue"
                >
                    { list?.results.map((item: TodoItemModel) => <ToDoItem key={ item.id } todoItem={ item } /> ) }
                </CardContent>
            </Card>
            {addForm && <ItemForm 
                handleClose={() => setAddForm(false)}
                clickOK={saveForm}
                status={props.status}
                open={addForm}
            ></ItemForm> }
        </Grid>
    );
}

export default ListContainer;