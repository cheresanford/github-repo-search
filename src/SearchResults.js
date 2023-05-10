import React from 'react';

const SearchResults = ({ results, animate }) => {


  return (
    <div className="search-results">
      {results.map((result) => (
        
        <div key={result.id} 
        className={`repository ${animate ? 'fade-in' : ''}`}>
          <h3>
            <a href={result.html_url} target="_blank" rel="noopener noreferrer">
              {result.name}
            </a>
          </h3>
          <p>{result.description}</p>
          <div className='result-details'>
          <p>✍️ <b>Autor:</b> {result.owner.login}</p>
          <p>💻 <b>Linguagem:</b> {result.language}</p>
          <p>⭐ <b>Stars:</b> {result.stargazers_count}</p>
          <p>🍴  <b>Forks:</b> {result.forks_count}</p>
          
          </div>
          <p>Última modificação: {new Date(result.updated_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
