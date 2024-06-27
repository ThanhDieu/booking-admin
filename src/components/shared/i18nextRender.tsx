import { Typography } from 'antd';
import { Translation } from 'react-i18next';

export enum TextType {
  title = 'title',
  body = 'body'
}
const renderMenuLabel = (key: string, pageName: string, typeText?: TextType) => (
  <Translation ns={[pageName]}>
    {(t) => {
      return typeText === TextType.body || typeText === undefined ? (
        <> {t(key, { ns: pageName })}</>
      ) : (
        <Typography.Title level={3}>{t(key, { ns: pageName })}</Typography.Title>
      );
    }}
  </Translation>
);
export default renderMenuLabel;
