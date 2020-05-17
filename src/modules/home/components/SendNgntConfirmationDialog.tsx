import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BigNumber from 'bignumber.js';
import { TitleValueInfo } from './TitleValueInfo';
import { Ngnt } from './Ngnt';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  warningSection: {
    marginBottom: theme.spacing(2),
  },
  warning: {
    color: theme.palette.warning.dark,
  },
}));

interface SendNgntConfirmationDialogProps {
  visible: boolean;
  onCancel: () => void;
  onConfirmed: () => void;
  isConfirmed: boolean;
  sendersAddress: string;
  recipientsAddress: string;
  recipientsEnsName?: string;
  sendersBalance: string;
  amountToSend: string;
  fees: string;
  totalAmountToSend: string;
}

export const SendNgntConfirmationDialog: React.FC<SendNgntConfirmationDialogProps> = ({
  visible,
  sendersAddress,
  recipientsAddress,
  recipientsEnsName,
  amountToSend,
  fees,
  totalAmountToSend,
  sendersBalance,
  onCancel,
  onConfirmed,
  isConfirmed,
}) => {
  const classes = useStyles();

  if (!visible) {
    return null;
  }

  const senderCanPay = new BigNumber(sendersBalance).gte(totalAmountToSend);

  let recipientTitleValue = 'Recipients Address';
  if (recipientsEnsName) {
    recipientTitleValue += ` (${recipientsEnsName})`;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          Confirm Transaction Details
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TitleValueInfo title="Your Address" value={sendersAddress} />
        <TitleValueInfo title={recipientTitleValue} value={recipientsAddress} />
      </Grid>
      <Grid item xs={6}>
        <TitleValueInfo title="Amount to send" value={`${amountToSend} NGNT`} />
      </Grid>
      <Grid item xs={6}>
        <TitleValueInfo title="Fees" value={`${fees} NGNT`} />
      </Grid>
      <Grid item xs={12}>
        <TitleValueInfo
          title="Total Amount"
          value={`${totalAmountToSend} NGNT`}
        />
      </Grid>
      {!senderCanPay && (
        <Grid item xs={12} className={classes.warningSection}>
          <Typography
            variant="subtitle2"
            align="center"
            className={classes.warning}
          >
            Your wallet balance ({sendersBalance} <Ngnt nolink />) is lower than
            total amount to send. Topup your{' '}
            <a
              href="https://buy.ngnt.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              wallet here
            </a>{' '}
            and try again
          </Typography>
        </Grid>
      )}
      {!isConfirmed && (
        <Grid container spacing={1}>
          {senderCanPay && (
            <Grid item xs={6}>
              <Button
                color="primary"
                variant="outlined"
                onClick={onConfirmed}
                fullWidth
              >
                Confirm
              </Button>
            </Grid>
          )}
          <Grid item xs={senderCanPay ? 6 : 12}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={onCancel}
              fullWidth
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
