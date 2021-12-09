import AppBar from '@mui/material/AppBar';
import { Toolbar } from '@mui/material';
import styles from './Navbar.module.scss';

function Navbar() {
    return(
      <div>
        <AppBar 
            position="static"
            className={styles['center-content']}
        >
            <Toolbar>
                <h2>My To-Do List</h2>                
            </Toolbar>
        </AppBar>
      </div>
    )
}

export default Navbar;