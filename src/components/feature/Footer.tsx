
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold hover:text-indigo-400 transition-colors">
              Linder
            </Link>
            <p className="text-gray-400 font-light leading-relaxed max-w-md">
              웹에서 발견한 링크들을 체계적으로 관리하고 다시 읽을 수 있도록 도와주는 개인 생산성 도구입니다.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">기능</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <button className="hover:text-white transition-colors cursor-pointer text-left font-light">
                  URL 저장 및 요약
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors cursor-pointer text-left font-light">
                  주제별 태깅
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors cursor-pointer text-left font-light">
                  읽음 상태 관리
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors cursor-pointer text-left font-light">
                  리마인드 알림
                </button>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">바로가기</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/app" className="hover:text-white transition-colors font-light">
                  구현 미리보기
                </Link>
              </li>
              <li>
                <button className="hover:text-white transition-colors cursor-pointer text-left font-light">
                  개인정보처리방침
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors cursor-pointer text-left font-light">
                  오픈소스
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors cursor-pointer text-left font-light">
                  문의하기
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
