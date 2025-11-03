
const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: '링크 붙여넣기',
      description: '읽고 싶은 웹 페이지의 URL을 간단히 붙여넣기만 하면 됩니다.',
      image: 'https://i.ibb.co/LhCQhdVC/2025-11-02-232102.jpg'
    },
    {
      number: '02',
      title: 'AI 요약/태깅',
      description: 'AI가 자동으로 내용을 요약하고 적절한 주제 태그를 생성합니다.',
      image: 'https://i.ibb.co/nMXzntKc/2025-11-02-231755.jpg'
    },
    {
      number: '03',
      title: '링크 관리',
      description: '정리된 글들을 읽음/안 읽음 및 주제로 분류하고, 리마인드 날짜를 설정합니다.',
      image: 'https://i.ibb.co/TBb31XB2/2025-11-02-232423.jpg'
    },
    {
      number: '04',
      title: '리마인드',
      description: '안 읽은 문서가 설정한 리마인드 날짜까지 읽지 않으면 알림을 통해 리마인드합니다.',
      image: 'https://readdy.ai/api/search-image?query=Modern%20notification%20system%20interface%20showing%20reminder%20alerts%20and%20scheduling%2C%20clean%20mobile%20and%20desktop%20notification%20design%20with%20calendar%20integration%2C%20bell%20icons%20and%20time%20indicators%2C%20professional%20reminder%20management%20dashboard%20with%20clean%20white%20background&width=400&height=300&seq=step4-reminder-system&orientation=landscape'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
            어떻게 작동하나요?
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            네 단계로 완성되는 스마트한 링크 관리 시스템
          </p>
        </div>
        
        <div className="space-y-20">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed font-light max-w-lg">
                  {step.description}
                </p>
              </div>
                  
              <div className="flex-1 max-w-xl w-full">
                <div
                  className="
                    relative rounded-2xl shadow-xl border border-gray-200
                    hover:shadow-2xl transition-shadow duration-300
                    bg-white overflow-hidden
                    aspect-[4/3]
                    flex items-center justify-center
                  "
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="
                      max-w-full max-h-full
                      object-contain
                      object-center
                      block
                    "
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[0_40px_80px_-10px_rgb(0_0_0_/_0.1)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
