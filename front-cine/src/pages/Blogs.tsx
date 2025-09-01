import { MainLayout } from '../layouts/MainLayout';
import BlogList from '../components/Blogs/BlogList';


export const Blogs = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <BlogList/>
    </MainLayout>
  );
};