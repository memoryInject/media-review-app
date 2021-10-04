import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ProjectScreen from './screens/ProjectScreen';
import ReviewScreen from './screens/ReviewScreen';
import ReviewDetailScreen from './screens/ReviewDetailScreen';
import LoginScreen from './screens/LoginScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' component={ProjectScreen} exact />
          <Route path='/login' component={LoginScreen} exact />
          <Route path='/projects/:id/reviews' component={ReviewScreen} exact />
          <Route
            path='/projects/:id/reviews/:reviewId'
            component={ReviewDetailScreen}
          />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
