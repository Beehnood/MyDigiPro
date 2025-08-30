import { MainLayout } from '../layouts/MainLayout';
import { Register } from '../components/Register';


export const Register_page = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <Register />
    </MainLayout>
  );
};