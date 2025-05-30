import { MainLayout } from '../layouts/MainLayouts';
import { Hero } from '../components/Hero';
import { BlogSection } from '../components/BlogSection';

export const Home = () => {
  return (
    <MainLayout>
      <Hero />
      <BlogSection />
    </MainLayout>
  );
};