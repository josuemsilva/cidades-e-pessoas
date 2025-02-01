import {HashRouter} from 'react-router-dom';

import './shared/forms/TraducoesYup';

import { AppRoutes } from './routes';
import { Login, MenuLateral } from './shared/components';
import { AppThemeProvider, AuthProvider, DrawerProvider } from './shared/contexts';

export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <Login>
          <DrawerProvider>
            <HashRouter>

              <MenuLateral>
                <AppRoutes/>
              </MenuLateral>

            </HashRouter>
          </DrawerProvider>
        </Login>
      </AppThemeProvider>
    </AuthProvider>
  )
}
