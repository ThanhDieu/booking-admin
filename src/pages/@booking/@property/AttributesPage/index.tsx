import { PlainLayout } from 'components/layout';
import { COPYRIGHT } from 'constant';
import { useHelmet } from 'hooks';

const AttributesPage = () => {
  useHelmet({
    title: 'Attributes Page'
  });

  return (
    <PlainLayout
      headerprops={{
        title: 'Attributes'
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    ></PlainLayout>
  );
};

export default AttributesPage;
