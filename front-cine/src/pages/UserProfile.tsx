
import { MainLayout } from '../layouts/MainLayout';
import Profile from '../components/Profile';


export const UserProfile = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      
      <Profile/>
    </MainLayout>
  );
};