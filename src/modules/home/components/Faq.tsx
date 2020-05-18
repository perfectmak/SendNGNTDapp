import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Link from '@material-ui/core/Link';
import { Ngnt } from './Ngnt';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(3),
    },
    title: {
      marginBottom: theme.spacing(2),
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: 500,
    },
  })
);

export const Faq: React.FC = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleChange = React.useCallback(
    (panel: string) => (
      _event: React.ChangeEvent<{}>,
      isExpanded: boolean
    ): void => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h4" className={classes.title}>
          Frequently Asked Questions
        </Typography>
        <ExpansionPanel
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              How does it work?
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              You can send your NGNT in these three major steps:
              <br />
              <br />
              1. Enter amount and recipient&apos;s address. You can also enter
              an ENS (like <b>sendngnt.eth</b> 😉) as recipient.
              <br />
              <br />
              2. Select your wallet provider and confirm the transaction
              details.
              <br />
              <br />
              3. Sign the transaction and wait for a Confirmation from the
              network.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography className={classes.heading}>
              Why is this special?
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <Ngnt /> is an ERC20 token that also implements the Gas Station
              Network (GSN) relaying service. What this means is that you do not
              need ETH to transfer this token. The problem now arises from the
              fact that most sites that allow sending ERC20 token do not support
              this GSN ETH free transfers. Currently, only{' '}
              <Link href="https://buycoins.africa" target="_blank">
                buycoins.africa
              </Link>{' '}
              supports transfers of NGNT without ETH, but you would need to
              signup to use it.
              <br />
              With all the backstory out of the way 😀, this site is{' '}
              <b>special</b> because it allows users to send their NGNT from
              their non-custodial wallets.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography className={classes.heading}>
              Who is the fee for?
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              The 50 NGNT Fee is used to pay the Gas Station Network (GSN)
              Relayer that pays the ETH transaction fee. Read more about GSN at
              their website{' '}
              <Link href="https://www.opengsn.org/">
                https://www.opengsn.org/
              </Link>
              .
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expanded === 'panel4'}
          onChange={handleChange('panel4')}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography className={classes.heading}>Is it safe?</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              We have taken care to ensure that your transactions go through as
              safely as possible. You don&apos;t have to take our word for it,
              see what others are saying{' '}
              <Link
                href="https://twitter.com/search?q=%23SendNGNTWorks&src=typed_query"
                target="blank"
              >
                about the platform here.
              </Link>
              <br />
              <br />
              Also, the source code for the website is open on github at{' '}
              <Link
                href="https://github.com/perfectmak/SendNGNTDapp"
                target="_blank"
              >
                https://github.com/perfectmak/SendNGNTDapp
              </Link>{' '}
              and its functionality can be verified.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={expanded === 'panel5'}
          onChange={handleChange('panel5')}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5bh-content"
            id="panel5bh-header"
          >
            <Typography className={classes.heading}>
              How do I get my wallet supported?
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              If your wallet is not supported, you can tweet at us on{' '}
              <Link href="https://twitter.com/SendNGNT" target="_blank">
                @SendNGNT
              </Link>{' '}
              or send us an email at sendngnt[at]perfects.engineering, and we
              would work on getting it supported.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    </Grid>
  );
};
