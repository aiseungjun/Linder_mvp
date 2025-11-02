
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SignupFeedbackCard from "../../../components/SignupFeedbackCard";

const HeroSection = () => {
  const [showHomeMenu, setShowHomeMenu] = useState(false);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPreview = () => {
    document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleHomeMenu = () => {
    setShowHomeMenu(!showHomeMenu);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Multiple%20web%20browser%20windows%20displaying%20various%20websites%20including%20blogs%2C%20research%20papers%2C%20and%20online%20articles%2C%20modern%20computer%20screen%20setup%20with%20organized%20digital%20content%2C%20clean%20workspace%20with%20laptop%20showing%20different%20website%20interfaces%2C%20academic%20papers%20and%20blog%20posts%20visible%20on%20screen%2C%20professional%20digital%20reading%20environment%20with%20multiple%20tabs%20open&width=1400&height=900&seq=hero-web-content-v1&orientation=landscape')`
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 py-4">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link 
                to="/" 
                className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                Linder
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8 relative">
              
              {/* Home 드롭다운 */}
              <div className="relative">
                <button 
                  onClick={toggleHomeMenu}
                  className="text-gray-600 hover:text-gray-900 font-light transition-colors cursor-pointer flex items-center"
                >
                  Home
                  <i className={`ri-arrow-down-s-line ml-1 text-sm transition-transform ${showHomeMenu ? 'rotate-180' : ''}`}></i>
                </button>
                {showHomeMenu && (
                  <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[48px] z-50">
                    <button 
                      onClick={scrollToFeatures}
                      className="block w-full text-left px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      핵심 기능
                    </button>
                    <button 
                      onClick={scrollToHowItWorks}
                      className="block w-full text-left px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      작동 방식
                    </button>
                    <button 
                      onClick={scrollToPreview}
                      className="block w-full text-left px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      미리 보기
                    </button>
                  </div>
                )}
              </div>

              <Link 
                to="/app"
                className="text-gray-600 hover:text-gray-900 font-light transition-colors"
              >
                Service
              </Link>
              <button className="text-gray-600 hover:text-gray-900 font-light transition-colors cursor-pointer">
                Help
              </button>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 font-light transition-colors cursor-pointer">
                Login
              </button>
              <button className="text-gray-600 hover:text-gray-900 font-light transition-colors cursor-pointer">
                Join
              </button>
            </div>
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 cursor-pointer">
                <i className="ri-menu-line text-xl"></i>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SignupFeedbackCard />
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen pt-24"> SignupFeedbackCard 없어지면 다시 이걸로 하기 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mt-24">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
                다시 보고 싶은 링크,{' '}
                <span className="font-normal text-indigo-600">잊기 전에</span>{' '}
                모아두세요.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed font-light max-w-2xl">
                여러 탭과 북마크에 파묻혀 잊어버리는 블로그, 논문 등의 링크들을<br />
                보기 쉽게 저장하고, AI 요약과 태그를 제공하고,<br />
                알림으로 다시보게 도와줍니다.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/app" 
                className="bg-indigo-600 text-white px-8 py-4 text-lg font-medium hover:bg-indigo-700 transition-all duration-200 whitespace-nowrap rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                구현 미리보기
              </Link>
              <button 
                onClick={scrollToFeatures}
                className="px-8 py-4 text-lg font-light text-gray-700 border-2 border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-200 whitespace-nowrap cursor-pointer rounded-full"
              >
                핵심 기능
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <img 
                src="https://readdy.ai/api/search-image?query=Clean%20modern%20web%20application%20interface%20mockup%20showing%20organized%20reading%20list%20with%20article%20cards%2C%20minimalist%20UI%20design%20with%20white%20background%2C%20elegant%20typography%20and%20subtle%20shadows%2C%20bookmark%20and%20tag%20icons%2C%20professional%20dashboard%20layout%20with%20search%20functionality%20and%20categorized%20content&width=600&height=400&seq=app-mockup-v3&orientation=landscape" 
                alt="Linder 앱 미리보기" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-100 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-100 rounded-full opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-gray-500 text-sm font-light">스크롤하여 더 보기</span>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
