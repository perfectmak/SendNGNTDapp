import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: {
      color: '#000000',
      cursor: 'pointer',
      height: 40,
      width: 0,
      margin: theme.spacing(0, 0.5),
      borderLeft: '1px solid #d9d9d9',
    },
  })
);

export const VerticalDivider: React.FC = () => {
  const classes = useStyles();
  return <div className={classes.divider} />;
};
