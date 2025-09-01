import { MainLayout } from '../layouts/MainLayout';
import { CreateBlog } from '../components/Blogs/CreateBlog';


export const CreateBlog_page = () => {
  console.log('Home rendering');
  return (
    <MainLayout>
      <CreateBlog/>
    </MainLayout>
  );
};