/** @format */
import NextHead from 'next/head';
import PropTypes from 'prop-types';
import { IHeadProps } from '../interfaces';
import { HOST } from '../../../configs';

const Head = (props: IHeadProps) => {
  const { title, description } = props;

  return (
    <NextHead>
      <meta charSet='UTF-8' />
      <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta
        name='viewport'
        content='minimum-scale=1, maximum-scale=5, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover'
      />
      <title>{title || ''}</title>
      <meta name='description' content={description || ''} />
      <meta name='keywords' content={''} />
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:url' content={HOST} />
      <meta name='twitter:title' content={title || ''} />
      <meta name='twitter:description' content={description || ''} />
      <meta name='twitter:creator' content='' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title || ''} />
      <meta property='og:url' content={HOST} />
      <link rel='shortcut icon' href='/icons/favicon.ico' type='image/x-icon' />
      <link rel='icon' href='/icons/favicon.ico' type='image/x-icon'></link>
    </NextHead>
  );
};

export default Head;

Head.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};
