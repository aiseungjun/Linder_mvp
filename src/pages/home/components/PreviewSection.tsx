
import { Link } from 'react-router-dom';

const PreviewSection = () => {
  return (
    <section id="preview" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900">
              구현 미리보기
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              아래 버튼으로 실제 동작 모습을 확인하세요.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-12 border border-indigo-100">
            <div className="space-y-8">
              <div className="relative">
                <img 
                  src="https://i.ibb.co/rf5XSnBQ/2025-11-02-225546.jpg"
                  alt="ReadLater+ 구현 미리보기"
                  className="w-full max-w-2xl mx-auto rounded-xl shadow-2xl border border-gray-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent rounded-xl"></div>
              </div>
              
              <Link 
                to="/app" 
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 text-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 whitespace-nowrap rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                구현 페이지 열기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
