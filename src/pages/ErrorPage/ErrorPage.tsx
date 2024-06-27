import { Result } from 'antd';
import { ResultStatusType } from 'antd/es/result';

export interface ErrorPageProps {
  status: ResultStatusType;
  title: string;
  subTitle: string;
}

const Page: React.FC<ErrorPageProps> = (props) => {
  const { title, subTitle, status } = props;
  // useEffect(() => {
  //   if (status === '404') {
  //     message.warning(`${subTitle}. Back home`, 2);
  //     setTimeout(() => navigate(`/${paths.home}`), 2000);
  //   }
  // }, []);
  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      // extra={<Button type='primary'>Back Home</Button>}
    />
  );
};

export default Page;
