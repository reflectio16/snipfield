import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categories/:id" element={<CategoryPage />} />
    </Routes>
  );
}

export default App;