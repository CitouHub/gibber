import * as React from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const GotoDialog = ({ open, handleGoTo, handleClose }) => {
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Go to</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Where do you want to go?
                    </DialogContentText>
                    <Input id="x" startAdornment={<InputAdornment position="start">X</InputAdornment>} />
                    <Input id="y" startAdornment={<InputAdornment position="start">Y</InputAdornment>} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={() => handleGoTo(0, 0)}>Go</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GotoDialog