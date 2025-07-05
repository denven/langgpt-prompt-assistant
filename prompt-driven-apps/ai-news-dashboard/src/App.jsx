import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

function App() {
	return (
	  <Router>
		<Navbar />
		<main className="main-content">
		  <Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/about" element={<AboutPage />} />
		  </Routes>
		</main>
	  </Router>
	);
  }

export default App;