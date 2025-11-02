
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router/index';

function App() {
  return (
    <BrowserRouter basename={__BASE_PATH__}>
      <div className="min-h-screen bg-white">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
