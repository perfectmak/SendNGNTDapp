import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, useMediaQuery, useTheme } from '@material-ui/core';

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

interface CenteredPaperProps {
  visible: boolean;
}

export const CenteredPaper: React.FC<CenteredPaperProps> = ({
  visible,
  children,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isBigScreen = useMediaQuery(theme.breakpoints.up('sm'));

  if (!visible) {
    return null;
  }

  return (
    <Grid container alignContent="center">
      {isBigScreen && <Grid item xs="auto" md={2} />}
      <Grid item xs={12} md={8}>
        <Paper elevation={3} className={classes.paper}>
          {children}
        </Paper>
      </Grid>
    </Grid>
  );
};
