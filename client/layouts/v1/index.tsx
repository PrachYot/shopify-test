import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import Head from '../../components/head/v1';
import { ILayoutProps } from '../interfaces';

const Navbar = dynamic(() => import('../../components/navigations/navbar/v1'), { ssr: true });

const Layout = (props: ILayoutProps) => {
  const { title, description, children } = props;

  return (
    <div id='app-container' className='min-h-screen bg-white dark:bg-secondary-900'>
      <Head title={title} description={description} />
      <Navbar />
      <div className='mx-auto min-h-screen'>
        <div className='mx-auto min-h-screen'>{children}</div>
      </div>
    </div>
  );
};

export default Layout;

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};
