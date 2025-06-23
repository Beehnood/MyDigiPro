import { MainLayout } from '../layouts/MainLayout';
import Login from '../components/Login';


export const Login_page = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <Login />
    </MainLayout>
  );
};