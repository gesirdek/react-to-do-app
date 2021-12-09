import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, { useEffect, useState } from "react";

interface IFormItem {
    handleClose(): void,
    clickOK(event: any): void,
    title?: string,
    header?: string,
    description?: string,
    status: string,
    open: boolean
}

function ItemForm(props:IFormItem) {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    useEffect(() => {
        setTitle(props.title || '');
        setDescription(props.description || '');
    },[setTitle, setDescription, props])

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>{ props.header || props.title }</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        defaultValue={props.title ? props.title : ''}
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Description"
                        type="text"
                        defaultValue={props.description ? props.description : ''}
                        maxRows={4}
                        fullWidth
                        variant="standard"
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                    />

                </DialogContent>
                <DialogActions>
                    <Button size="small" onClick={() => { props.clickOK({title, description}) }}>OK</Button>
                    <Button size="small" onClick={props.handleClose}>Cancel</Button>
                </DialogActions>
        </Dialog>
    )
}

export default ItemForm;