import { MainLayout } from '../layouts/MainLayout';
import Collections from '../components/Collections';


export const Collection = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <Collections/>
    </MainLayout>
  );
};