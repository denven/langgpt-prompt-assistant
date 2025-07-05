import React from 'react';
import './NewsCard.css';

const NewsCard = ({ article }) => {
  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer" className="news-card-link">
      <div className="news-card">
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        <span className="card-source">Source: {article.source}</span>
      </div>
    </a>
  );
};

export default NewsCard;