import { Helmet } from 'react-helmet';
import { useAppSelector } from 'store';

export interface HelmetHandlerProps {
  children?: React.ReactNode;
}

function HelmetHandler(props: HelmetHandlerProps) {
  const { children } = props;
  const { title, meta, link } = useAppSelector((state) => state.app.helmet);

  return (
    <>
      <Helmet>
        {title && <title>{title}</title>}
        {meta && meta.map((item) => <meta key={item.name} {...item} />)}
        {link && link.map((item) => <link key={item.href} {...item} />)}
      </Helmet>
      {children}
    </>
  );
}

export default HelmetHandler;
