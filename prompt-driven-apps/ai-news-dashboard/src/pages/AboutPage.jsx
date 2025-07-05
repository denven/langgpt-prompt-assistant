import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1>About This Project</h1>
      <p>
        This is a simple frontend application built with React and Vite.
        It displays a curated list of recent highlight news in the field of Artificial Intelligence.
      </p>
      <p>The project demonstrates:</p>
      <ul>
        <li>Component-based architecture (Navbar, NewsCard)</li>
        <li>Client-side routing with React Router</li>
        <li>Dynamic rendering of data onto UI components</li>
        <li>Modern CSS for styling and layout</li>
      </ul>
    </div>
  );
};

export default AboutPage;