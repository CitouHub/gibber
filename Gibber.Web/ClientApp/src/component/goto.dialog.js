import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import * as Config from '../util/config';
import * as KeyboardHelper from '../util/keyboard.helper';

const GotoDialog = ({ open, handleGoTo, handleClose }) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useEffect(() => {
        setX(Config.getUser().x);
        setY(Config.getUser().y);
    }, [open]);

    const validate = (e) => {
        if (KeyboardHelper.isEnter(e)) {
            handleGoTo(parseInt(x), parseInt(y));
        } else if (KeyboardHelper.isTab(e) === false &&
            KeyboardHelper.isNumber(e) === false &&
            KeyboardHelper.isArrow(e) === false &&
            KeyboardHelper.isBackspace(e) === false) {
            e.preventDefault();
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Go to</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Where do you want to go?
                    </DialogContentText>
                    <Input
                        id="x"
                        autoFocus={true}
                        value={x}
                        inputProps={{ tabIndex: "1" }}
                        onKeyDown={validate}
                        onChange={e => setX(e.target.value)}
                        startAdornment={<InputAdornment position="start">X</InputAdornment>} />
                    <Input
                        id="y"
                        value={y}
                        inputProps={{ tabIndex: "2" }}
                        onKeyDown={validate}
                        onChange={e => setY(e.target.value)}
                        startAdornment={<InputAdornment position="start">Y</InputAdornment>} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={() => handleGoTo(parseInt(x), parseInt(y))}>Go</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GotoDialog