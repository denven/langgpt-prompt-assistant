import React from 'react';
import NewsCard from '../components/NewsCard';
import { aiNews } from '../data/newsData';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Latest AI Highlights</h1>
      <div className="news-grid">
        {aiNews.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;