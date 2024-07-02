import { Card, Form, Input } from 'antd';
import { languages as allLanguageConstant } from 'constant';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';

const TranslationForm = () => {
  const { t } = useTranslation(['common']);
  const { languages } = useAppSelector((state) => state.booking.languageSetting);

  return (
    <div className="flex items-center gap-4 overflow-x-scroll py-4 mb-6">
      {languages?.map((language) => {
        const tranformLangCodeToName =
          allLanguageConstant[language.code as keyof typeof allLanguageConstant];

        return (
          <Card bodyStyle={{ width: 500 }} key={language.code} title={tranformLangCodeToName}>
            <Form.Item
              label={t('common:table.title')}
              name={`title_${language.code}`}
              rules={[
                { required: language.mandatory, message: t('common:form.please_enter_this_field') }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label={t('common:table.description')} name={`description_${language.code}`}>
              <Input.TextArea />
            </Form.Item>
          </Card>
        );
      })}
    </div>
  );
};

export default TranslationForm;
