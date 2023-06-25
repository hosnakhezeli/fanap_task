import React, { useState, ChangeEvent, useCallback } from 'react';
import type { FC } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';

export interface Props {
  title: string;
  open: boolean;
  confirmPhrase?: string;
  dismiss: () => void;
  confirm?: () => void;
}

const AlertBox: FC<Props> = ({
  title, open, confirmPhrase = 'تایید', dismiss, confirm, children,
}: React.PropsWithChildren<Props>) => {
  const [phrase, setPhrase] = useState<string>('');

  const handlePhraseChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setPhrase(value);
  };

  const onConfirm = useCallback((): void => {
    setPhrase('');
    confirm?.();
  }, [confirm]);

  return (
    <Dialog open={open} onClose={dismiss}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ direction: 'rtl' }}>
          {children}
        </DialogContentText>
        <TextField
          fullWidth
          label={confirmPhrase}
          value={phrase}
          onChange={handlePhraseChange}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={dismiss}>انصراف</Button>
        <Button color="error" disabled={phrase !== confirmPhrase} variant="text" onClick={onConfirm}>حذف</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertBox;
