import { Form, Input } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  placeholderC?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
  allowClear?: boolean;
  defaultValue?: string;
}

const { Search } = Input;
const SearchComponent: React.FC<Props> = ({
  placeholderC,
  onChange,
  style,
  allowClear = false,
  defaultValue
}) => {
  const { t } = useTranslation(['common']);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      search: defaultValue
    });
  }, [defaultValue]);

  return (
    <Form form={form} className="position-relative">
      <Form.Item name="search" className="mb-0">
        <Search
          placeholder={placeholderC || t('common:general.search')}
          onSearch={onChange}
          style={style}
          allowClear={allowClear}
          autoComplete="off"
          title={t('common:search.noti')}
          enterButton
          className="w-[450px]"
        />
      </Form.Item>
    </Form>
  );
};
export default SearchComponent;
