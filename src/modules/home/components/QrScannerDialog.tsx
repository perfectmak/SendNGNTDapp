import React, { useCallback } from 'react';
import QrReader from 'react-qr-reader';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  scanner: {
    width: '300px',
  },
}));

interface QrScannerDialogProps {
  open: boolean;
  onScan: (result: string) => void;
  onClose: () => void;
  onError: (err: Error) => void;
}

export const QrScannerDialog: React.FC<QrScannerDialogProps> = props => {
  const classes = useStyles();
  const onScan = useCallback(
    (result: string | null) => {
      if (result === null) {
        return;
      }
      // QQ: Maybe setup debouncing here
      props.onScan(result);
    },
    [props]
  );

  const onError = useCallback(
    err => {
      props.onError(new Error(err));
    },
    [props]
  );

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      // scroll="body"
      maxWidth="xs"
      disableEnforceFocus
    >
      <Fade in={props.open}>
        <Grid container alignContent="center">
          <Grid item xs={12}>
            <QrReader
              delay={500}
              onError={onError}
              onScan={onScan}
              className={classes.scanner}
            />
          </Grid>
        </Grid>
      </Fade>
    </Dialog>
  );
};
