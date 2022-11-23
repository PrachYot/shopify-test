import { ReactElement } from 'react';
import Thumbnail from '../components/thumbnails/thumbnail/v1';
import Layout from '../layouts/v1';

function Home(): ReactElement {
  return (
    <div>
      <Thumbnail />
    </div>
  );
}

const HOCHome: any = Home;

HOCHome.getLayout = function GetLayout(page: ReactElement) {
  return (
    <Layout title='' description=''>
      {page}
    </Layout>
  );
};

export default HOCHome;
