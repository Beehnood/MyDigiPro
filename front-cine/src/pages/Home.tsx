
import { MainLayout } from '../layouts/MainLayout';
import { FilmsNowPlaying } from '../components/Films/FilmsNowPlaying';
import { BlogSection } from '../components/Blogs/BlogSection';
import { FilmsPopular } from '../components/Films/FilmsPopular';



export const Home = () => {
  return (
    <MainLayout>
      <FilmsNowPlaying />
      <FilmsPopular />
      <BlogSection />
    </MainLayout>
  );
};
