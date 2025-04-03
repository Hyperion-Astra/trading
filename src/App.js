import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import About from './components/About';
import ServicesSection from './components/ServicesSection';
import Finance from './components/Finance';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CryptoPrices from './components/CrytoPrices';
import PricingCalculator from './components/PricingCalculator';

AOS.init();

function App() {
  return (
    <div className="App">
      <Main />
      <About />
      <CryptoPrices />
      <PricingCalculator />
      <ServicesSection />
      <Finance />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
