import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Summarizer from './pages/Summarizer';
import History from './pages/History';
import About from './pages/About';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="summarize" element={<Summarizer />} />
        <Route path="history" element={<History />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}
