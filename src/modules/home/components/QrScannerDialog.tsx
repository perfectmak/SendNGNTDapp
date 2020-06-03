import React, { useCallback } from 'react';
import QrReader from 'react-qr-scanner';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Fade from '@material-ui/core/Fade';

interface QrScannerDialogProps {
  open: boolean;
  onScan: (result: string) => void;
  onClose: () => void;
  onError: (err: Error) => void;
}

export const QrScannerDialog: React.FC<QrScannerDialogProps> = props => {
  // const classes = useStyles();
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
      maxWidth="md"
      disableEnforceFocus
    >
      <Fade in={props.open}>
        <Grid container alignContent="center">
          <Grid item xs={12} md={5}>
            <QrReader
              style={{ height: 200, width: 350 }}
              delay={500}
              onError={onError}
              onScan={onScan}
            />
          </Grid>
        </Grid>
      </Fade>
    </Dialog>
  );
};
