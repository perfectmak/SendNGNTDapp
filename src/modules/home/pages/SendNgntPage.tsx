import React, { useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { scroller, Element } from 'react-scroll';
import { observer } from 'mobx-react-lite';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useLoggedInWalletStore } from '../../wallets/utils';
import { Faq } from '../components/Faq';
import { Ngnt } from '../components/Ngnt';
import { SendNgntForm, NgntFormFieldValues } from '../components/SendNgntForm';
import { useAppStore } from '../../../store';
import { SendNgntConfirmationDialog } from '../components/SendNgntConfirmationDialog';
import { TransferProgressDialog } from '../components/TransferProgressDialog';
import { HeaderBar } from '../components/HeaderBar';
import { CenteredPaper } from '../components/CenteredPaper';
import { Footer } from '../components/Footer';
import { getEnvNetwork } from '../../wallets/web3/networks';

const useStyles = makeStyles(theme => ({
  root: {
    color: '#ffffff',
  },
  caption: {
    fontWeight: 150,
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(5),
  },
  openSourceText: {
    width: '100%',
  },
  openSourceLink: {
    color: '#ffffff',
  },
}));

const DEFAULT_FEES = 50;

export const SendNgntPage: React.FC<{}> = observer(() => {
  const classes = useStyles();
  const { sendNgntStore, walletStore } = useAppStore();
  const [bannerFees, setBannerFees] = useState(DEFAULT_FEES);
  const { showTransfer, triggerTransactionWatch } = sendNgntStore;

  useEffect(() => {
    ReactGA.pageview('/');
  }, []);

  useEffect(() => {
    setBannerFees(parseFloat(sendNgntStore.transferFees) || DEFAULT_FEES);
  }, [sendNgntStore.transferFees]);

  useEffect(() => {
    if (showTransfer) {
      // scroll to the showTransfer
      scroller.scrollTo('TransferDialog', {
        duration: 1000,
        smooth: true,
      });
    }

    if (triggerTransactionWatch) {
      sendNgntStore.watchPendingTransaction();
    }
  }, [sendNgntStore, showTransfer, triggerTransactionWatch]);

  const onBuyClicked = useLoggedInWalletStore<[NgntFormFieldValues]>(
    (_walletStore, formValues) => {
      const { recipientAddress, amount } = formValues;
      sendNgntStore.confirmTransfer(recipientAddress, amount.toString());
    },
    () => {
      sendNgntStore.stopPrepareConfirmation();
    },
    [sendNgntStore],
    () => {
      sendNgntStore.prepareConfirmation();
    }
  );

  const onConfirmCancelled = useCallback(() => {
    sendNgntStore.cancelTransfer();
  }, [sendNgntStore]);

  const onConfirmConfirmed = useLoggedInWalletStore<[]>(
    () => {
      sendNgntStore.startTransfer();
    },
    null,
    [sendNgntStore]
  );

  return (
    <div className={classes.root}>
      <HeaderBar
        network={getEnvNetwork()}
        loggedIn={walletStore.isLoggedIn}
        address={walletStore.address}
        onLogout={walletStore.logout}
      />
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              className={classes.caption}
              variant="h3"
              component="h2"
              align="center"
            >
              Send <Ngnt /> from your non-custodial wallet
            </Typography>
            <Typography align="center" variant="subtitle2">
              No ETH required. Only {bannerFees} <Ngnt nolink /> Fee
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <SendNgntForm
              onSubmit={onBuyClicked}
              visible={sendNgntStore.showLogin}
              recipientError={sendNgntStore.recipientAddressError}
              isSubmitting={sendNgntStore.preparingConfirmation}
            />
            <CenteredPaper visible={sendNgntStore.showConfirmation}>
              <SendNgntConfirmationDialog
                visible={sendNgntStore.showConfirmation}
                onCancel={onConfirmCancelled}
                onConfirmed={onConfirmConfirmed}
                isConfirmed={sendNgntStore.showTransfer}
                sendersAddress={sendNgntStore.sendersAddress}
                sendersBalance={sendNgntStore.sendersBalance}
                recipientsAddress={sendNgntStore.recipientAddress}
                recipientsEnsName={sendNgntStore.recipientEnsName}
                amountToSend={sendNgntStore.transferAmount}
                fees={sendNgntStore.transferFees}
                totalAmountToSend={sendNgntStore.totalTransferAmount}
              />
              <Element name="TransferDialog">
                <TransferProgressDialog
                  visible={sendNgntStore.showTransfer}
                  state={sendNgntStore.transferState}
                  transactionHash={sendNgntStore.transactionHash}
                  error={sendNgntStore.transferError}
                  network={walletStore.network}
                  onFinish={sendNgntStore.cancelTransfer}
                />
              </Element>
            </CenteredPaper>
          </Grid>
          <Faq />
          <Typography
            align="center"
            variant="subtitle2"
            className={classes.openSourceText}
          >
            This dApp is Open Source. You can contribute to it{' '}
            <a
              href="https://github.com/perfectmak/SendNGNTDapp"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.openSourceLink}
            >
              on Github
            </a>
            .
          </Typography>
          <Footer />
        </Grid>
      </Container>
    </div>
  );
});
