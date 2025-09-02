import { MainLayout } from '../../layouts/MainLayout';
import BlogList from '../../components/Blogs/BlogList';


export const BlogsList_page = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <BlogList/>
    </MainLayout>
  );
};