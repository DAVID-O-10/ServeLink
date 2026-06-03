import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';
import SEO from './components/SEO';

function App() {
  return (
    <>
      <SEO />
      <CustomCursor />
      <Navbar />
      <PageTransition />
      <Footer />
    </>
  );
}

export default App;
