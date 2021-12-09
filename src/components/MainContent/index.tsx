import { Grid } from "@mui/material";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import ListContainer from "../ListContainer";
import styles from './MainContent.module.scss';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from "react-dnd-html5-backend";

function MainContent () {
    const { width } = useWindowDimensions();

    return (
        <div className={styles['main-container']}>
            <DndProvider backend={width > 768 ? HTML5Backend : TouchBackend}>
                <Grid 
                    container 
                    justifyContent="center"
                    direction={width > 768 ? 'row' : 'column'}
                    spacing={3}
                    alignItems="stretch"
                    >
                    <ListContainer key="open" status='open' />
                    <ListContainer key="inprogress" status='inprogress' />
                    <ListContainer key="done" status='done' />
                </Grid>
            </DndProvider>
        </div>
    )
}

export default MainContent;