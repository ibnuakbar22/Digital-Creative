import Header from '../sections/Header.jsx';
import About from '../sections/About.jsx';
import Education from '../sections/Education.jsx';
import Skills from '../sections/Skills.jsx';
import Projects from '../sections/Projects.jsx';
import TechStack from '../sections/TechStack.jsx';
import CtaBar from '../sections/CtaBar.jsx';
import Showcase from '../sections/Showcase.jsx';
import Connect from '../sections/Connect.jsx';
import Achievements from '../sections/Achievements.jsx';
import Footer from '../sections/Footer.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function PortfolioPage() {
  return (
    <div className="page">
      <div className="shell">
        <Header />
        <main>
          <About />
          <Education />
          <Skills />
          <Projects />
          <TechStack />
          <CtaBar />
          <Showcase />
          <Achievements />
          <Connect />
        </main>
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}