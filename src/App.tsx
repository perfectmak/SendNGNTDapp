import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router';
import { HashRouter as Router } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SendNgntPage } from './modules/home/pages/SendNgntPage';
import { useAppStore } from './store';

const LoginPage = lazy(() => import('./modules/wallets/pages/LoginPage'));
const Loading = (): JSX.Element => <></>;

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      background: {
        default: '#39736e',
      },
    },
  })
);

const App: React.FC = observer(() => {
  const { walletStore } = useAppStore();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/" component={SendNgntPage} />
          <Route path="*" is404={true}>
            <div>404 Baby</div>
          </Route>
        </Switch>
      </Router>
      <Suspense fallback={<Loading />}>
        {walletStore.showLogin && <LoginPage />}
      </Suspense>
    </ThemeProvider>
  );
});

export default App;
