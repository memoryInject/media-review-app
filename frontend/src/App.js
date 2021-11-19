import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import ToastMessage from './components/ToastMessage';
import ProjectListScreen from './screens/ProjectListScreen';
import ReviewScreen from './screens/ReviewScreen';
import LoginScreen from './screens/LoginScreen';
import ProjectScreen from './screens/ProjectScreen';
import ProjectSettingsScreen from './screens/ProjectSettingsScreen';
import ReviewSettingsScreen from './screens/ReviewSettingsScreen';
import AppSettingsScreen from './screens/AppSettingsScreen';
import PasswordResetConfirmScreen from './screens/PasswordResetConfirmScreen';
import InviteRegisterScreen from './screens/InviteRegisterScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' component={ProjectListScreen} exact />
          <Route path='/login' component={LoginScreen} exact />
          <Route path='/projects/:id' component={ProjectScreen} exact />
          <Route path='/projects/:id/settings' component={ProjectSettingsScreen} exact />
          <Route
            path='/projects/:id/reviews/:reviewId'
            component={ReviewScreen}
            exact
          />
          <Route
            path='/projects/:id/reviews/:reviewId/settings'
            component={ReviewSettingsScreen}
            exact
          />
          <Route
            path='/settings'
            component={AppSettingsScreen}
            exact
          />
          <Route
            path='/password-reset/confirm/:uid/:token/'
            component={PasswordResetConfirmScreen}
          />
          <Route
            path='/invitations/accept-invite/:key'
            component={InviteRegisterScreen}
          />
          <ToastMessage />
        </Container>
      </main>
    </Router>
  );
};

export default App;
