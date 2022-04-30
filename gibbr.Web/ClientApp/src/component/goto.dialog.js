import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { isEnter } from '../aid/keyboard.aid';
import { position } from '../data/board.data';

const GotoDialog = ({ open, goTo, close }) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useEffect(() => {
        setX(position.x);
        setY(position.y);
    }, [open]);

    const checkEnter = (e) => {
        if (isEnter(e)) {
            goTo(parseInt(x), parseInt(y));
        }
    }

    const handleInput = (newValue, oldValue) => {
        for (var i = 0; i < newValue.length; i++) {
            let charCode = newValue.charCodeAt(i);
            if (charCode < 48 || charCode > 57) {
                return oldValue
            }
        }

        return newValue;
    }

    return (
        <div>
            <Dialog open={open} onClose={close}>
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
                        onKeyDown={checkEnter}
                        onChange={e => setX(handleInput(e.target.value, x))}
                        startAdornment={<InputAdornment position="start">X</InputAdornment>} />
                    <Input
                        id="y"
                        value={y}
                        inputProps={{ tabIndex: "2" }}
                        onKeyDown={checkEnter}
                        onChange={e => setY(handleInput(e.target.value, y))}
                        startAdornment={<InputAdornment position="start">Y</InputAdornment>} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={close}>Close</Button>
                    <Button onClick={() => goTo(parseInt(x), parseInt(y))}>Go</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GotoDialog