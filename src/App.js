import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import logo from './logo.png';
import SearchResults from './SearchResults';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateResults, setAnimateResults] = useState(false);
  const [showTopDiv, setShowTopDiv] = useState(true);
  const topRef = useRef(null);
  
  //Página de carregamento inicial
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTopDiv(false);
    }, 3000); // Esconde depois de 3 segundos

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (searchTerm.trim() === '') {
      alert('Buscas vazias não são válidas! Por favor, tente novamente com alguma palavra.');
    } else {
      setCurrentPage(1);
      fetchData(1);
    }
    
  };

  const fetchData = async (page) => {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${searchTerm}&sort=stars&order=desc&per_page=10&page=${page}`
    );
    const data = await response.json();
    if (data.items.length === 0) {
      alert('Nenhum repositório encontrado para a busca realizada.');
    } else {
      setSearchResults(data.items);
      setAnimateResults(true);
      setTimeout(() => setAnimateResults(false), 1000); // Reset animation state after 1 second (duration of the animation)
      topRef.current.scrollIntoView({ behavior: 'smooth' });

    }
  };

  const handlePageChange = (direction) => {
    const newPage = currentPage + direction;
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    
    <div className="app" ref={topRef}>
      
      {showTopDiv && (
  <>
    <div className="top-div">Bem-vindo ao GitSearch! Busque repositórios na barra de pesquisa abaixo</div>
    <div className="overlay"></div>
    
  </>
)}
    <div className={`container ${showTopDiv ? 'blurred' : ''}`}>
      <img src={logo} alt="Logo" className='logo'></img>  
      <h1> GitSearch - Busca de Repositórios</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busque repositórios..."
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(-1)}>Anterior</button>
        )}
        <span>Página {currentPage}</span>
        {searchResults.length === 10 && (
          <button onClick={() => handlePageChange(1)}>Próxima</button>
        )}
      </div>
      
      <SearchResults results={searchResults} animate={animateResults} />
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(-1)}>Anterior</button>
        )}
        <span>Página {currentPage}</span>
        {searchResults.length === 10 && (
          <button onClick={() => handlePageChange(1)}>Próxima</button>
        )}
      </div>
      <button onClick={scrollToTop} className="back-to-top">Voltar para o Topo</button>
    </div>
    </div>
  );
}

export default App;
