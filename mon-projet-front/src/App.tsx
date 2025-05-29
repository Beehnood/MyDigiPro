import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'; // Import Tailwind CSS styles
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BlogSection } from './components/BlogSection';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';

function App() {
  return (
     <div className=" flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <main className='flex-1'>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Hero" element={<Hero />} />
                    {/* <Route path="/new-article" element={<NewArticle />} /> */}
                    {/* <Route path="/categories" element={<Categories />} /> */}
                    {/* <Route path="/categoryPage/:slug" element={<CategoryPage />} /> */}
                    <Route path="*" element={<h1>404 - Page non trouvée</h1>} />

                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;