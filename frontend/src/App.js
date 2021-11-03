import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ToastMessage from './components/ToastMessage';
import ProjectListScreen from './screens/ProjectListScreen';
import ReviewListScreen from './screens/ReviewListScreen';
import ReviewScreen from './screens/ReviewScreen';
import LoginScreen from './screens/LoginScreen';
import ProjectScreen from './screens/ProjectScreen';
import ProjectSettingsScreen from './screens/ProjectSettingsScreen';
import ReviewSettingsScreen from './screens/ReviewSettingsScreen';
import AppSettingsScreen from './screens/AppSettingsScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' component={ProjectListScreen} exact />
          <Route path='/login' component={LoginScreen} exact />
          <Route
            path='/projects/:id/reviews'
            component={ReviewListScreen}
            exact
          />
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
          <ToastMessage />
        </Container>
      </main>
      {/*<Footer />*/}
    </Router>
  );
};

export default App;
