import React, { useCallback } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { getAccountUrl } from '../utils';
import Logo from '../assets/logo.png';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    color: theme.palette.primary.dark,
    background: '#ffffff',
  },
  title: {
    fontWeight: 400,
    color: theme.palette.primary.light,
  },
  logo: {
    width: '40px',
    verticalAlign: 'middle',
    marginRight: theme.spacing(0.5),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  }
}));

interface HeaderBarProps {
  loggedIn: boolean;
  address?: string;
  onLogout?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  loggedIn,
  address,
  onLogout,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback((): void => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback((): void => {
    setAnchorEl(null);
    if (onLogout) {
      onLogout();
    }
  }, [onLogout]);

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Link href="/" className={classes.root}>
            <div className={classes.titleContainer}>
              <img src={Logo} className={classes.logo} alt="logo"/>
              <Typography variant="h6" component="h1" className={classes.title}>
                SendNGNT
              </Typography>
            </div>
          </Link>
          {loggedIn && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem>
                  <Link
                    href={getAccountUrl(address as string)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Etherscan
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
