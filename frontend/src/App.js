import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ProjectScreen from './screens/ProjectScreen';
import ReviewScreen from './screens/ReviewScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' component={ProjectScreen} exact />
          <Route path='/projects/:id/reviews' component={ReviewScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
