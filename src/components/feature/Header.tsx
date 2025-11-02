
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHomeDropdown, setShowHomeDropdown] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    setShowHomeDropdown(!showHomeDropdown);
  };

  const handleServiceClick = () => {
    navigate('/app');
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setShowHomeDropdown(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
          >
            Linder
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button 
                onClick={handleHomeClick}
                className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-light flex items-center gap-1"
              >
                Home
                <i className={`ri-arrow-down-s-line transition-transform duration-200 ${showHomeDropdown ? 'rotate-180' : ''}`}></i>
              </button>
              
              {showHomeDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    핵심 기능
                  </button>
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    작동 방식
                  </button>
                  <button 
                    onClick={() => scrollToSection('preview')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    미리 보기
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={handleServiceClick}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-light"
            >
              Service
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-light">
              Help
            </button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-light">
              Login
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap cursor-pointer hover:shadow-lg">
              Join
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={handleHomeClick}
                className="text-gray-600 hover:text-gray-900 transition-colors text-left cursor-pointer font-light flex items-center gap-1"
              >
                Home
                <i className={`ri-arrow-down-s-line transition-transform duration-200 ${showHomeDropdown ? 'rotate-180' : ''}`}></i>
              </button>
              
              {showHomeDropdown && (
                <div className="ml-4 space-y-2">
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="block text-gray-600 hover:text-gray-900 transition-colors text-left cursor-pointer"
                  >
                    핵심 기능
                  </button>
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="block text-gray-600 hover:text-gray-900 transition-colors text-left cursor-pointer"
                  >
                    작동 방식
                  </button>
                  <button 
                    onClick={() => scrollToSection('preview')}
                    className="block text-gray-600 hover:text-gray-900 transition-colors text-left cursor-pointer"
                  >
                    미리 보기
                  </button>
                </div>
              )}
              
              <button 
                onClick={handleServiceClick}
                className="text-gray-600 hover:text-gray-900 transition-colors text-left cursor-pointer font-light"
              >
                Service
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors text-left cursor-pointer font-light">
                Help
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors text-left cursor-pointer font-light">
                Login
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap cursor-pointer text-left w-fit">
                Join
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
