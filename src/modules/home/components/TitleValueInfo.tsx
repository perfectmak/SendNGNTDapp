import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  value: {
    overflowWrap: 'anywhere',
  },
}));

interface TitleValueInfoProps {
  title: string;
  value?: string;
}

export const TitleValueInfo: React.FC<TitleValueInfoProps> = ({
  title,
  value,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="subtitle2">{title}</Typography>
      {value && (
        <Typography variant="body1" className={classes.value}>
          {value}
        </Typography>
      )}
    </div>
  );
};
