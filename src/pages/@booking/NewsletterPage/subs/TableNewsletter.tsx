/* eslint-disable @typescript-eslint/no-explicit-any */
import { CopyOutlined, DeleteOutlined, EditOutlined, MailOutlined } from '@ant-design/icons';
import { App, Button, List, Tooltip, Typography, theme } from 'antd';
import ModalSendMail from 'components/common/modal/ModalSendMail';
import { DATE_FORMAT_3 } from 'configs/const/format';
import { FuncType, ThemeType } from 'configs/const/general';
// import { PERPAGE } from 'constant/size';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  NewsletterCreatePayload,
  NewsletterCreateType,
  NewsletterDetailType
} from 'services/Newsletter/type';
import { MailType } from 'services/SendMail/type';
import { useAppDispatch, useAppSelector } from 'store';
import { triggerSendCampaignThunk } from 'store/booking/Mailchimp';
import { contentMailewsletterFormat } from 'utils/contentMailFormat';
import { QueryCaseType } from 'utils/queryParams';

interface Props {
  locationCurrent: QueryCaseType;
  handleChangeLocation: ({ currentPage, perPage }: QueryCaseType) => void;
  newsletterList: {
    list: any[];
    pagination: any;
  };
  loading?: boolean;
  deleteNewsletterList: (id: number) => Promise<any>;
  createNewsletter: (formData: NewsletterCreatePayload) => Promise<any>;
}
const PERPAGE = 6;

const { useToken } = theme;

const TableNewsletter = ({
  locationCurrent,
  handleChangeLocation,
  newsletterList,
  loading,
  deleteNewsletterList,
  createNewsletter
}: Props) => {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const { token } = useToken();
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { selected } = useAppSelector((state) => state.app.theme);

  const [modalOpen, setModalOpen] = useState<string>('');
  const [currentDataNewsletter, setCurrentDataNewsletter] = useState<NewsletterDetailType>();

  //FUNCTION
  const handleDuplicateNewsletter = (item: NewsletterDetailType) => {
    const copyName = `${item.data.name} Copy`;
    const payload = {
      data: {
        type: NewsletterCreateType.newsletter,
        data: { ...item.data, name: copyName }
      }
    };
    createNewsletter(payload);
  };

  const handleSendMail = (campaignId: string, content: string) => {
    const payload = {
      campaignId,
      html: content,
      mailType: MailType.newsletter
    };
    dispatch(triggerSendCampaignThunk({ formData: payload }));
    setModalOpen('');
  };

  //ITEM LIST
  const renderItem = (item: NewsletterDetailType) => {
    return (
      <List.Item
        className="mb-1"
        style={{
          backgroundColor: selected === ThemeType?.DEFAULT ? token.colorWhite : token.colorBgLayout
        }}
      >
        <div className="flex flex-col gap-3 w-full">
          <List.Item.Meta
            title={
              <div className="flex justify-between pl-5">
                <Typography.Title level={4}>{item?.data?.name ?? ''}</Typography.Title>
                <div className="flex gap-4">
                  <Tooltip title={t('offer:send_mail')} arrow={false}>
                    <Button
                      type="link"
                      icon={<MailOutlined />}
                      onClick={() => {
                        setCurrentDataNewsletter(item);
                        setModalOpen(FuncType.SEND_MAIL);
                      }}
                    />{' '}
                  </Tooltip>
                  <Tooltip title={t('common:button.duplicate')} arrow={false}>
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      onClick={() => {
                        handleDuplicateNewsletter(item);
                      }}
                    />{' '}
                  </Tooltip>
                  <Tooltip title={t('common:button.edit')} arrow={false}>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => {
                        navigate(`${item.id}`);
                      }}
                    />
                  </Tooltip>
                  <Tooltip title={t('common:button.delete')} arrow={false}>
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => {
                        deleteNewsletterList(item.id);
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            }
            description={
              <div className="flex ">
                <Typography.Text strong className="pl-5">{`${t(
                  'common:table.create_at'
                )}: `}</Typography.Text>{' '}
                <Typography.Text>{dayjs(item?.createdAt).format(DATE_FORMAT_3)}</Typography.Text>
              </div>
            }
          />
        </div>
      </List.Item>
    );
  };

  //DATA
  const newsletterListReverse = useMemo(() => {
    return newsletterList?.list.length ? newsletterList.list.reverse() : [];
  }, [newsletterList?.list]);

  return (
    <>
      <List
        loading={loading}
        dataSource={newsletterListReverse}
        renderItem={(item) => renderItem(item)}
        pagination={
          !newsletterList?.pagination?.total ||
            (newsletterList?.pagination?.total && newsletterList?.pagination?.total < PERPAGE)
            ? false
            : {
              pageSize: PERPAGE,
              total: newsletterList?.pagination?.total
                ? Number(newsletterList?.pagination.total)
                : 1,
              showSizeChanger: false,
              onChange: (value) => {
                handleChangeLocation &&
                  handleChangeLocation({ ...locationCurrent, currentPage: value });
              }
            }
        }
      />
      {modalOpen === FuncType.SEND_MAIL && currentDataNewsletter ? (
        <ModalSendMail
          modalOpen={modalOpen === FuncType.SEND_MAIL}
          handleChangeOpenModal={() => setModalOpen('')}
          onSubmit={handleSendMail}
          contentData={contentMailewsletterFormat(currentDataNewsletter?.data)}
        />
      ) : (
        modalOpen === FuncType.SEND_MAIL && message.info(t('offer:no_campaign_notice'))
      )}
    </>
  );
};

export default TableNewsletter;
