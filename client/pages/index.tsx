import { ReactElement } from 'react';
import Layout from '../layouts/default/v1';

function Home(): ReactElement {
  return <div>Home</div>;
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
