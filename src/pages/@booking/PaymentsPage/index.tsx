import { PlainLayout } from 'components/layout';
import { COPYRIGHT } from 'constant';
import { useHelmet } from 'hooks';

const PaymentsPage = () => {
  useHelmet({
    title: 'Payments Page'
  });

  return (
    <PlainLayout
      headerprops={{
        title: 'Payments'
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    ></PlainLayout>
  );
};

export default PaymentsPage;
