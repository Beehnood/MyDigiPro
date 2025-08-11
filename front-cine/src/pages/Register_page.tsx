import { MainLayout } from '../layouts/MainLayout';
import Login from '../components/Login';
import { Register } from '../components/Register';


export const Register_page = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <Register />
    </MainLayout>
  );
};