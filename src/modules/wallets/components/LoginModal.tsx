import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Cancel';

import { ProviderButton } from './ProviderButton';
import { SupportedProvider } from '../web3/types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modalTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paper: {
      // width: 400,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2, 4, 3),
    },
    advancedSection: {
      marginTop: theme.spacing(1),
    },
    advancedSectionHeading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  })
);

export interface ProviderDisplayInfo {
  provider: SupportedProvider;
  icon: string;
  name?: string; // if provider, will be used instead of supported provider name
}

interface LoginModalProps {
  loading: boolean;
  open: boolean;
  onProviderClicked: (provider: SupportedProvider) => void;
  providers: ProviderDisplayInfo[];
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = props => {
  const classes = useStyles();

  const loadingComponent = (
    <Grid item xs={12}>
      <Backdrop className={classes.backdrop} open={props.loading}>
        <CircularProgress />
      </Backdrop>
    </Grid>
  );

  const bodyComponent = (
    <>
      {props.loading && loadingComponent}
      <Grid item xs={12}>
        <Typography
          variant="subtitle2"
          component="h3"
          id="login-modal-title"
          className={classes.modalTitle}
        >
          Select Wallet Provider
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </Typography>
      </Grid>
      {props.providers.map(provider => (
        <Grid item xs={12} key={provider.provider}>
          <ProviderButton
            icon={provider.icon}
            title={provider.name || provider.provider}
            onClick={(): void => props.onProviderClicked(provider.provider)}
          />
        </Grid>
      ))}
    </>
  );

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="login-modal-title"
        scroll="body"
        maxWidth="xs"
        disableEnforceFocus
      >
        <Fade in={props.open}>
          <Grid container className={classes.paper}>
            {bodyComponent}
          </Grid>
        </Fade>
      </Dialog>
    </div>
  );
};
