import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  link: {
    color: '#ffffff',
  },
}));

export const Footer: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="subtitle2" align="center">
          &copy; {new Date().getFullYear()} |{' '}
          <Link href="https://twitter.com/SendNGNT" className={classes.link}>
            Follow on Twitter
          </Link>{' '}
          |{' '}
          <Link
            href="https://fleek.co"
            target="_blank"
            className={classes.link}
          >
            Deployed on Fleek
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
};
