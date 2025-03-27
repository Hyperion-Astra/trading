import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import About from './components/About';
import ServicesSection from './components/ServicesSection';
import Finance from './components/Finance';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Main />
      <About />
      <ServicesSection />
      <Finance />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
