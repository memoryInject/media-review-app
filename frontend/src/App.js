import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ProjectListScreen from './screens/ProjectListScreen';
import ReviewListScreen from './screens/ReviewListScreen';
import ReviewScreen from './screens/ReviewScreen';
import LoginScreen from './screens/LoginScreen';
import ProjectScreen from './screens/ProjectScreen';

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
          <Route
            path='/projects/:id/reviews/:reviewId'
            component={ReviewScreen}
          />
        </Container>
      </main>
      {/*<Footer />*/}
    </Router>
  );
};

export default App;
