import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { TransferState } from '../state/types';
import { getTxUrl } from '../utils';

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
  linearProgress: {
    marginTop: theme.spacing(2),
  },
  completeButton: {
    marginTop: theme.spacing(1),
  },
  errorMessage: {
    color: theme.palette.error.light,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  txHashValue: {
    overflowWrap: 'anywhere',
  },
}));

interface TransferProgressDialogProps {
  visible: boolean;
  state: string;
  onFinish: () => void;
  transactionHash?: string;
  error?: string;
}

const activeStep = {
  [TransferState.SIGN_TX]: 0,
  [TransferState.SUBMITTING_TX]: 1,
  [TransferState.AWAITING_CONFIRMATION]: 2,
  [TransferState.COMPLETED]: 3,
};

const getSteps = (): string[] => {
  return [
    'Sign Transaction',
    'Submitting Transaction',
    'Awaiting confirmation',
    'Transfer Success',
  ];
};

const getStepContent = (
  classes: Record<'linearProgress' | 'txHashValue', string>,
  step: number,
  isFinished: boolean,
  transactionHash?: string
): React.ReactElement => {
  switch (step) {
    case 0:
      return (
        <>
          <Typography>
            Your wallet will open and you will be asked to sign a transaction.
            If you are not using a browser wallet you should check your wallet
            app/device to confirm.
          </Typography>
        </>
      );
    case 1:
      return (
        <>
          <Typography>
            Your transaction is being submitted to the network.
          </Typography>
          {!isFinished && (
            <LinearProgress
              variant="query"
              className={classes.linearProgress}
            />
          )}
        </>
      );
    case 2:
      return (
        <>
          <Typography className={classes.txHashValue}>
            We are awaiting confirmation from the network. Your transaction hash
            is:{' '}
            {transactionHash && (
              <strong>
                <a
                  href={getTxUrl(transactionHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {transactionHash}
                </a>
              </strong>
            )}
          </Typography>
          {!isFinished && (
            <LinearProgress
              variant="query"
              className={classes.linearProgress}
            />
          )}
        </>
      );
    case 3:
      return (
        <>
          <Typography>
            Transfer Successful. Confirm balance on the receivers wallet.
          </Typography>
          <Typography variant="caption" className={classes.txHashValue}>
            Hash:{' '}
            <a
              href={getTxUrl(transactionHash || '')}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionHash}
            </a>
          </Typography>
          <br />
          <br />
          <Typography variant="subtitle2">
            If this worked for you, please take some time to{' '}
            <a
              href="https://ctt.ac/c8BXH"
              target="_blank"
              rel="noopener noreferrer"
            >
              tweet with the #SendNGNTWorks hashtag.
            </a>
          </Typography>
        </>
      );
    default:
      return <>Unknown step</>;
  }
};

export const TransferProgressDialog: React.FC<TransferProgressDialogProps> = ({
  visible,
  state,
  transactionHash,
  error,
  onFinish,
}) => {
  const classes = useStyles();

  if (!visible) {
    return null;
  }
  const isFinished = Boolean(error) || state === TransferState.COMPLETED;
  const isAwaitingConfirmation = state === TransferState.AWAITING_CONFIRMATION;
  const steps = getSteps();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Stepper
          activeStep={activeStep[state as TransferState]}
          orientation="vertical"
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {getStepContent(classes, index, isFinished, transactionHash)}
                {error && (
                  <>
                    <Typography className={classes.errorMessage}>
                      {error}
                    </Typography>
                    {isAwaitingConfirmation && (
                      <Typography variant="subtitle2">
                        NOTE: Click the hash above to confirm the transaction
                        succeeded or failed.
                      </Typography>
                    )}
                  </>
                )}
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {isFinished && (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            className={classes.completeButton}
            onClick={onFinish}
          >
            FINISH
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
