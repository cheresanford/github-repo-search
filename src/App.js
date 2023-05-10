import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import { FaWhatsapp } from 'react-icons/fa'; 
import './App.css';
import logo from './logo.png';
import SearchResults from './SearchResults';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateResults, setAnimateResults] = useState(false);
  const [showTopDiv, setShowTopDiv] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchDone, setSearchDone] = useState(false);


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
    setLoading(true); // Adicionado
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${searchTerm}&sort=stars&order=desc&per_page=10&page=${page}`
    );
    const data = await response.json();
    if (data.items.length === 0) {
      alert('Nenhum repositório encontrado para a busca realizada.');
    } else {
      setSearchDone(true);
      setSearchResults(data.items);
      setAnimateResults(true);
      setTimeout(() => setAnimateResults(false), 1000);
      topRef.current.scrollIntoView({ behavior: 'smooth' });

    }
    setLoading(false);
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
    {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
      <img src={logo} alt="Logo" className='logo'></img>  
      <h1>Busca de Repositórios</h1>
      <h2>Plataforma para pesquisar repositórios do GitHub. Desenvolvido por Carlos Henrique @ 2023.</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busque repositórios..."
        />
        <button type="submit">Buscar</button>
      </form>

      {(searchDone &&
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(-1)}>Anterior</button>
        )}
        <div className='paginationText'>Página {currentPage}</div>
        {searchResults.length === 10 && (
          <button onClick={() => handlePageChange(1)}>Próxima</button>
        )}
      </div>)}

      
      <SearchResults results={searchResults} animate={animateResults} />
      {(searchDone &&
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(-1)}>Anterior</button>
        )}
        <span>Página {currentPage}</span>
        {searchResults.length === 10 && (
          <button onClick={() => handlePageChange(1)}>Próxima</button>
        )}
      </div>)}

      {(searchDone && 
      <button onClick={scrollToTop} className="back-to-top">Voltar para o Topo</button>
      )}
    
    </div>
    
    <a
      href="https://wa.me/5521967022385"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <FaWhatsapp size={32} className='whatsapp-icon' />
    </a>
    </div>
  );
}

export default App;
