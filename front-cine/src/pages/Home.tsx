
import { MainLayout } from '../layouts/MainLayout';
import { Hero } from '../components/Hero';
import { BlogSection } from '../components/BlogSection';
import Collection from '../components/Collection';

export const Home = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <Hero />
      <Collection />
      <BlogSection />
    </MainLayout>
  );
};