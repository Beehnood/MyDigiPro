import { MainLayout } from '../../layouts/MainLayout';
import { FilmsNowPlaying } from '../../components/Films/FilmsNowPlaying';
import { FilmsPopular } from '../../components/Films/FilmsPopular';
import Collections from '../../components/Collections';


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