
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesData } from '../../mocks/articles';

interface Article {
  id: string;
  url: string;
  title: string;
  summary: string;
  topic: string;
  status: string;
  added_at: string;
  remind_at: string;
}

const AppPage = () => {
  const [activeTab, setActiveTab] = useState<'UNREAD' | 'read'>('UNREAD');
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState('자동 감지');
  const [remindDays, setRemindDays] = useState('3');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // JSON 데이터 초기화
  useEffect(() => {
    setArticles(articlesData);
  }, []);

  const fetchPageTitle = async (url: string): Promise<string> => {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      const title = doc.querySelector('title')?.textContent;
      return title || `새로 추가된 글 (${new URL(url).hostname})`;
    } catch (error) {
      return `새로 추가된 글 (${new URL(url).hostname})`;
    }
  };

  const handleAddArticle = async () => {
    if (!url.trim()) return;
    
    setIsLoading(true);
    
    try {
      // 실제 URL에서 제목 가져오기
      const pageTitle = await fetchPageTitle(url);
      
      // 현재 날짜 계산
      const currentDate = new Date();
      const addedAt = currentDate.toISOString().split('T')[0];
      
      // 리마인드 날짜 계산
      const remindDate = new Date(currentDate);
      remindDate.setDate(currentDate.getDate() + parseInt(remindDays));
      const remindAt = remindDate.toISOString().split('T')[0];
      
      // 새 문서 생성
      const newArticle: Article = {
        id: Date.now().toString(),
        url: url.trim(),
        title: pageTitle,
        summary: '이 글은 곧 AI에 의해 요약될 예정입니다. 실제 구현에서는 OpenAI API를 통해 자동으로 내용을 분석하고 요약합니다.',
        topic: topic === '자동 감지' ? '헬스케어' : topic,
        status: '1',
        added_at: addedAt,
        remind_at: remindAt
      };
      
      // 문서 목록에 추가
      setArticles(prev => [newArticle, ...prev]);
      setUrl('');
      
    } catch (error) {
      console.error('문서 추가 중 오류 발생:', error);
      
      // 오류 발생 시 기본값으로 추가
      const currentDate = new Date();
      const addedAt = currentDate.toISOString().split('T')[0];
      const remindDate = new Date(currentDate);
      remindDate.setDate(currentDate.getDate() + parseInt(remindDays));
      const remindAt = remindDate.toISOString().split('T')[0];
      
      const newArticle: Article = {
        id: Date.now().toString(),
        url: url.trim(),
        title: `새로 추가된 글 (${new URL(url).hostname})`,
        summary: '이 글은 곧 AI에 의해 요약될 예정입니다. 실제 구현에서는 OpenAI API를 통해 자동으로 내용을 분석하고 요약합니다.',
        topic: topic === '자동 감지' ? '헬스케어' : topic,
        status: '1',
        added_at: addedAt,
        remind_at: remindAt
      };
      
      setArticles(prev => [newArticle, ...prev]);
      setUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === id ? { ...article, status: '0' } : article
      )
    );
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(article => article.id !== id));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // 간단한 피드백 (실제로는 토스트 메시지 등으로 대체)
    const button = document.activeElement as HTMLButtonElement;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="ri-check-line"></i>';
    setTimeout(() => {
      button.innerHTML = originalText;
    }, 1000);
  };

  const filteredArticles = articles.filter(article => 
    activeTab === 'UNREAD' ? article.status === '1' : article.status === '0'
  );

  const getTopicColor = (topic: string) => {
    const colors: { [key: string]: string } = {
      '요리': 'bg-orange-100 text-orange-800',
      '딥러닝': 'bg-purple-100 text-purple-800',
      '과학': 'bg-blue-100 text-blue-800',
      '프로그래밍': 'bg-green-100 text-green-800',
      '헬스케어': 'bg-pink-100 text-pink-800',
      '기타': 'bg-gray-100 text-gray-800'
    };
    return colors[topic] || 'bg-gray-100 text-gray-800';
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
              Linder
            </Link>
            
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab('UNREAD')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                  activeTab === 'UNREAD' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                안 읽음
              </button>
              <button
                onClick={() => setActiveTab('read')}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                  activeTab === 'read' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                읽음
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Input Form */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-6">
                <input
                  type="url"
                  placeholder="웹 URL을 입력하세요"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus-border-transparent transition-colors text-sm"
                />
              </div>
              
              <div className="lg:col-span-2">
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus-border-transparent transition-colors text-sm pr-8"
                >
                  <option>자동 감지</option>
                  <option>요리</option>
                  <option>딥러닝</option>
                  <option>과학</option>
                  <option>프로그래밍</option>
                  <option>헬스케어</option>
                  <option>기타</option>
                </select>
              </div>
              
              <div className="lg:col-span-2">
                <input
                  type="number"
                  placeholder="며칠 뒤 리마인드?"
                  value={remindDays}
                  onChange={(e) => setRemindDays(e.target.value)}
                  min="1"
                  max="365"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus-border-transparent transition-colors text-sm"
                />
              </div>
              
              <div className="lg:col-span-2">
                <button
                  onClick={handleAddArticle}
                  disabled={!url.trim() || isLoading}
                  className="w-full bg-indigo-600 text-white px-6 py-3 text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap rounded-xl"
                >
                  {isLoading ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    '추가'
                  )}
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 leading-relaxed">
              ※ URL을 입력하면 실제 웹페이지에서 제목을 가져와 문서를 추가합니다. 리마인드 날짜는 자동으로 계산됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredArticles.map((article) => (
              <div 
                key={article.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <i className="ri-global-line text-gray-400"></i>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">{getDomain(article.url)}</span>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getTopicColor(article.topic)}`}>
                        {article.topic}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 leading-tight hover:text-indigo-600 transition-colors">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cursor-pointer"
                      >
                        {article.title}
                      </a>
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>추가: {article.added_at}</span>
                      {article.remind_at && (
                        <span>리마인드: {article.remind_at}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex lg:flex-col gap-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-32 px-4 py-2 text-sm text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition-colors whitespace-nowrap cursor-pointer rounded-lg"
                    >
                      <i className="ri-external-link-line mr-2"></i>
                      열기
                    </a>
                    
                    {article.status === '1' ? (
                      <button
                        onClick={() => markAsRead(article.id)}
                        className="flex items-center justify-center w-32 px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors whitespace-nowrap cursor-pointer rounded-lg"
                      >
                        <i className="ri-check-line mr-2"></i>
                        읽음으로 표시
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="flex items-center justify-center w-32 px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer rounded-lg"
                      >
                        <i className="ri-delete-bin-line mr-2"></i>
                        문서 삭제
                      </button>
                    )}
                    
                    <button
                      onClick={() => copyUrl(article.url)}
                      className="flex items-center justify-center w-32 px-4 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer rounded-lg"
                    >
                      <i className="ri-file-copy-line mr-2"></i>
                      복사
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-book-open-line text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {activeTab === 'UNREAD' ? '아직 저장한 글이 없어요' : '읽은 글이 없어요'}
            </h3>
            <p className="text-gray-600 font-light">
              {activeTab === 'UNREAD' 
                ? '위에서 링크를 추가해보세요!' 
                : '글을 읽고 \'읽음으로 표시\' 버튼을 눌러보세요!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppPage;
