
const FeaturesSection = () => {
  const features = [
    {
      icon: 'ri-bookmark-line',
      title: '한 줄 URL 저장',
      description: '다시 보고 싶은 링크의 url을 붙여넣으면 끝! 본문/메타를 읽어 내용 자동 요약',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: 'ri-price-tag-3-line',
      title: '주제 태깅',
      description: '요리, 과학, 딥러닝, 프로그래밍 등 주제 분류로 쉽게 정리.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: 'ri-checkbox-circle-line',
      title: '읽은 문서 정리',
      description: '저장된 문서의 링크와 요약본을 쉽게 접근하고, 버튼 한 번으로 \'읽음\' 처리.',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: 'ri-alarm-line',
      title: '리마인드',
      description: '안 읽은 문서를 특정 기간만큼 지난 후, 다시 볼 수 있도록 알림.',
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
            핵심 기능
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            간단하지만 강력한 기능들로 여러분의 읽기 경험을 혁신합니다
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow duration-300 mx-auto`}>
                <i className={`${feature.icon} text-2xl text-white`}></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed font-light">
            인터넷에는 전공 공부를 위한 블로그, 정주행 하고 싶은 웹툰, 커뮤니티에 올라온 요리 레시피 등 나중에 보고 싶은 수많은 링크들이 있습니다. 보통 우리는 이를 기억하고자 핸드폰이나 컴퓨터에 띄워놓지만, 막상 시간이 지나면서 까먹는 경우가 많습니다. 저희는 이 새로운 지식 또는 경험, 행복 창출의 기회를 놓치지 않게 하고자 만들어진 개인 생산성 도구입니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
