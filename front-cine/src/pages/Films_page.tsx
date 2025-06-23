import { MainLayout } from '../layouts/MainLayout';
import { FilmsNowPlaying } from '../components/FilmsNowPlaying';
import { FilmsPopular } from '../components/FilmsPopular';
import Collections from '../components/Collections';


export const Film_page = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <FilmsNowPlaying />
      <FilmsPopular />
      <Collections/>
    </MainLayout>
  );
};