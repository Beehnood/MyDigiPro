import { MainLayout } from '../layouts/MainLayout';
import { FilmProduit } from '../components/FilmProduit';


export const FilmProduit_page = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <FilmProduit/>
    </MainLayout>
  );
};