
import { MainLayout } from '../layouts/MainLayout';
import { FilmsNowPlaying } from '../components/FilmsNowPlaying';
import { BlogSection } from '../components/BlogSection';
import { FilmsPopular } from '../components/FilmsPopular';



export const Home = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <FilmsNowPlaying />
      <FilmsPopular />
      <BlogSection />
    </MainLayout>
  );
};