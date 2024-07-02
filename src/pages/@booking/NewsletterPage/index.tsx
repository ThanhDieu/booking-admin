/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';

import { PlainLayout } from 'components/layout';
import { COPYRIGHT, paths } from 'constant';
import { useAsyncAction, useDidMount } from 'hooks';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  createNewsletterService,
  deleteNewsletterService,
  getNewsletterService
} from 'services/Newsletter';
import { NewsletterDetailType } from 'services/Newsletter/type';
import { QueryCaseType, strapiQueryCase } from 'utils/queryParams';
import { TableNewsletter } from './subs';

const NewsletterPage = () => {
  const { t } = useTranslation(['offer', 'sidebar', 'common', 'newsletter']);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: 6
  });

  //SERVICE
  const [getNewsletterList, stateGetNewsletterList] = useAsyncAction(getNewsletterService);
  const [deleteNewsletterList, stateDeleteNewsletterList] = useAsyncAction(
    deleteNewsletterService,
    {
      onSuccess: () => {
        handleChangeLocation({});
      },
      onFailed: (errors: any) => {
        if (errors) message.error(errors.message);
      }
    }
  );

  const [createNewsletter, stateCreateNewsletter] = useAsyncAction(createNewsletterService, {
    onSuccess: () => {
      handleChangeLocation({});
      message.success(t('common:table.created'), 2);
    },
    onFailed: (error: any) => {
      if (error) message.error(error.message, 2);
    }
  });

  //LOCATION
  ////////Pagination///////////
  const handleChangeLocation = ({
    currentPage = locationCurrent.currentPage,
    perPage = locationCurrent.perPage
  }: QueryCaseType) => {
    const query = strapiQueryCase({
      currentPage,
      perPage
    });

    getNewsletterList(query);
    navigate(`/${paths.newsletter}?${query}`);
    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      perPage
    });
  };

  //DATA
  const newsletterList = useMemo(() => {
    const list: NewsletterDetailType[] = stateGetNewsletterList?.data?.data ?? [];
    const pagination = stateGetNewsletterList?.data?.meta?.pagination
      ? stateGetNewsletterList?.data?.meta?.pagination
      : undefined;
    return { list, pagination };
  }, [stateGetNewsletterList]);

  useDidMount(() => {
    handleChangeLocation({});
  });

  const pageLoading =
    stateDeleteNewsletterList?.loading ||
    stateGetNewsletterList?.loading ||
    stateCreateNewsletter.loading;

  return (
    <PlainLayout
      headerprops={{
        title: t('sidebar:sidebar.newsletter'),
        extra: [
          <Button
            type="primary"
            key="new-user-btn"
            icon={<PlusOutlined />}
            onClick={() => navigate(`${paths.create}`)}
          >
            {t('newsletter:create_newsletter')}
          </Button>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
    >
      <TableNewsletter
        locationCurrent={locationCurrent}
        handleChangeLocation={handleChangeLocation}
        loading={pageLoading}
        newsletterList={newsletterList}
        deleteNewsletterList={deleteNewsletterList}
        createNewsletter={createNewsletter}
      />
    </PlainLayout>
  );
};

export default NewsletterPage;
