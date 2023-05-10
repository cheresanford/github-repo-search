import React, { useState, useRef, useEffect } from 'react'; // Importando as funções do React
import './index.css'; 
import { FaWhatsapp } from 'react-icons/fa'; // Importando o ícone do Whatsapp da biblioteca react-icons
import './App.css'; // Importando o arquivo de estilos
import logo from './logo.png'; // Importando a imagem do logo
import SearchResults from './SearchResults'; // Importando o componente de resultados da busca

function App() {
  // Estado da aplicação
  const [searchTerm, setSearchTerm] = useState(''); // Termo da busca
  const [searchResults, setSearchResults] = useState([]); // Resultados da busca
  const [currentPage, setCurrentPage] = useState(1); // Página atual da busca
  const [animateResults, setAnimateResults] = useState(false); // Controla a animação dos resultados
  const [showTopDiv, setShowTopDiv] = useState(true); // Controla a exibição da div superior
  const [loading, setLoading] = useState(false); // Controla a exibição do spinner de carregamento
  const [searchDone, setSearchDone] = useState(false); // Controla se a busca foi realizada
  const [languageFilter, setLanguageFilter] = useState(''); // Filtro de linguagem

  const topRef = useRef(null); // Referência para a div superior da página

  
  
  
  // Função executada quando o componente é montado
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTopDiv(false); // Esconde a div superior depois de 3 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
  }, []);

  // Função que lida com a mudança do filtro de linguagem
  const handleLanguageFilterChange = (event) => {
    setLanguageFilter(event.target.value);
  };

  // Função que lida com a submissão do formulário de busca
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (searchTerm.trim() === '') { // Verifica se o termo da busca está vazio
      alert('Buscas vazias não são válidas! Por favor, tente novamente com alguma palavra.');
    } else {
      setCurrentPage(1); // Reseta a página atual
      fetchData(1); // Busca os dados da primeira página
    }
    
  };

  // Função que busca os dados da API do Github
  const fetchData = async (page) => {
    setLoading(true); 
    const queryString = languageFilter // Verifica se o filtro de linguagem foi selecionado
    ? `${searchTerm} language:${languageFilter}`
    : searchTerm;

  const response = await fetch(
    `https://api.github.com/search/repositories?q=${queryString}&sort=stars&order=desc&per_page=10&page=${page}`
  );
    const data = await response.json();
    if (data.items.length === 0) { // Verifica se a busca não retornou resultados
      alert('Nenhum repositório encontrado para a busca realizada.');
    } else {
      setSearchDone(true);
      setSearchResults(data.items); // Atualiza os resultados da busca
      setAnimateResults(true);
      setTimeout(() => setAnimateResults(false), 1000); // Reseta o estado da animação depois de 1 segundo
      topRef.current.scrollIntoView({ behavior: 'smooth' }); // Rola a página para o topo
    }
    setLoading(false); // Esconde o spinner de carregamento
  };

  // Função que lida com a mudança de página
  const handlePageChange = (direction) => {
    const newPage = currentPage + direction; // Calcula a nova página
    setCurrentPage(newPage); // Atualiza a página atual
    fetchData(newPage); // Busca os dados da nova página
  };

  // Função que rola a página para o topo
  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Componente

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
      <h2>Plataforma para pesquisar repositórios do GitHub. Desenvolvido por <a href='https://www.linkedin.com/in/carlos-henrique-aa0273268/'>Carlos Henrique @ 2023.</a></h2>
      
      <div className="filters">
          <div className="language-filter">
            <label htmlFor="language-filter">Filtrar por linguagem: </label>
            <select
              id="language-filter"
              value={languageFilter}
              onChange={handleLanguageFilterChange}
            >
              <option value="">Todas</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              
            </select>
          </div>
        </div>

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
    <div><a
      href="https://wa.me/5521967022385"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <FaWhatsapp size={32} className='whatsapp-icon' />
    </a> </div>
    </div>
  );
}

export default App;
