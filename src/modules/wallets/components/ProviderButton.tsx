import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { VerticalDivider } from './VerticalDivider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    parent: {
      width: '100%',
      margin: theme.spacing(1, 0),
    },
    providerIcon: {
      width: 30,
      height: 30,
      margin: theme.spacing(1, 1, 0, 0),
    },
  })
);

export interface ProviderButtonProps {
  icon: string;
  title: string;
  onClick: () => void;
}

export const ProviderButton: React.FC<ProviderButtonProps> = props => {
  const classes = useStyles();
  return (
    <Button
      variant="outlined"
      className={classes.parent}
      onClick={props.onClick}
    >
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <img
            src={props.icon}
            className={classes.providerIcon}
            alt={props.title}
          />
        </Grid>
        <Grid item xs={1}>
          <VerticalDivider />
        </Grid>
        <Typography variant="subtitle1">{props.title}</Typography>
      </Grid>
    </Button>
  );
};
