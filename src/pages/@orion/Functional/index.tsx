/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Popconfirm, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { PlainLayout } from 'components/layout';
import { FuncType } from 'configs/const/general';
import { COPYRIGHT, paths } from 'constant';
import {
  useAppSize,
  useAsyncAction,
  useDataDisplayV2,
  useDetailDisplay,
  useDidMount,
  useHelmet
} from 'hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createFunctionService,
  deleteFunctionService,
  getAllFunctionService,
  getFunctionDetailService,
  updateFunctionService
} from 'services/Functional';
import { FunctionType } from 'services/Functional/type';
import { ModalUpdateFunction } from './patials';
import { HORIZONTAL_SCROLL, PERPAGE } from 'constant/size';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { useNavigate } from 'react-router-dom';
import { Base64 } from 'js-base64';

export interface EditorObjectProps {
  value: string;
}

const FunctionPage = () => {
  const { t } = useTranslation(['functions', 'common']);
  const [openModalFuntion, setOpenModalFunction] = useState<string>('');
  const [editorObj, setEditorObject] = useState<EditorObjectProps>({
    value: ''
  });
  const { innerAppHeight } = useAppSize();
  const [form] = useForm();
  const { message } = App.useApp();
  const navigate = useNavigate();

  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: PERPAGE
  });

  //SERVICE AREA
  const [getAllFunction, stateGetAllFunction] = useAsyncAction(getAllFunctionService);

  const [getDetailFunction, stateDetailFun] = useAsyncAction(getFunctionDetailService);

  const [deleteFunction, stateDeleteFunction] = useAsyncAction(deleteFunctionService, {
    onSuccess: () => {
      getAllFunction();
      message.success('Function deleted!', 2);
    },
    onFailed: (error: any) => {
      if (error) message.error(error.message);
    }
  });

  const [updateFunction, stateUpdateFunction] = useAsyncAction(updateFunctionService, {
    onSuccess: () => {
      getAllFunction();
      message.success('Function updated!', 2);
    },
    onFailed: (error: any) => {
      if (error) message.error(error.message);
    }
  });
  const [createFunction, stateCreateFunction] = useAsyncAction(createFunctionService, {
    onSuccess: () => {
      getAllFunction();
      message.success('Function created!', 2);
    },
    onFailed: (error: any) => {
      if (error) message.error(error.message);
    }
  });
  //END AREA

  const handleChangeLocation = (
    { currentPage = locationCurrent.currentPage, perPage = locationCurrent.perPage }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      currentPage,
      perPage
    });
    getAllFunction(controller?.signal);
    navigate(`/${paths.function}?${query}`);
    setLocationCurrent({
      ...locationCurrent,
      currentPage
    });
  };

  const functionList = useDataDisplayV2<FunctionType>(stateGetAllFunction);

  const functionDetail = useDetailDisplay<FunctionType>(stateDetailFun);

  const initialValue = {
    comment: '',
    data: '',
    disabled: false,
    method: '',
    methodType: '',
    name: ''
  };

  const updateFormValue = {
    comment: functionDetail?.comment ?? '',
    disabled: functionDetail?.disabled ?? false,
    method: functionDetail?.method ?? '',
    methodType: functionDetail?.methodType ?? '',
    name: functionDetail?.name ?? ''
  };

  useDidMount(() => {
    handleChangeLocation({});
  });

  useEffect(() => {
    const valueDecode = functionDetail?.data ? Base64.decode(functionDetail?.data ?? '') : '';
    setEditorObject({ ...editorObj, value: valueDecode });

    if (openModalFuntion === FuncType.CREATE) {
      form.setFieldsValue(initialValue);
      setEditorObject({ value: '' });
    }
    if (openModalFuntion === FuncType.UPDATE && functionDetail) {
      form.setFieldsValue(updateFormValue);
    }
  }, [openModalFuntion, functionDetail]);

  const columns: ColumnsType<FunctionType> = [
    {
      title: t('common:table.name'),
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: t('common:table.method'),
      key: 'method',
      dataIndex: 'method'
    },
    {
      title: t('common:table.method_type'),
      key: 'methodType',
      dataIndex: 'methodType'
    },
    {
      title: t('common:table.action'),
      key: 'action',
      align: 'right',
      dataIndex: 'functionId',
      render: (id: string) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              getDetailFunction(id);
              setOpenModalFunction(FuncType.UPDATE);
            }}
          />
          <Popconfirm
            title="Delete function"
            description="Are you sure to delete this function?"
            onConfirm={() => deleteFunction(id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      )
    }
  ];

  const handleSubmitModal = (formData: any) => {
    const payload = {
      ...formData,
      disabled: formData?.disabled ?? false,
      data: editorObj.value
    };
    if (openModalFuntion === FuncType.CREATE) {
      createFunction(payload);
    } else {
      functionDetail?.functionId && updateFunction(functionDetail?.functionId, payload);
    }
    setOpenModalFunction('');
  };

  useHelmet({
    title: t('sidebar:sidebar.function')
  });

  const loading =
    stateGetAllFunction.loading ||
    stateDetailFun.loading ||
    stateUpdateFunction.loading ||
    stateDeleteFunction.loading ||
    stateCreateFunction.loading;

  return (
    <PlainLayout
      headerprops={{
        title: t('sidebar:sidebar.function'),
        extra: [
          <Button
            type="primary"
            key="new-user-btn"
            icon={<PlusOutlined />}
            onClick={() => setOpenModalFunction(FuncType.CREATE)}
          >
            {t('functions:new_function')}
          </Button>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit overflow-y-scroll"
    >
      <>
        <Table
          loading={loading}
          rowKey="functionId"
          columns={columns}
          dataSource={functionList.list}
          pagination={
            !functionList?.pagination?.total ||
            (functionList?.pagination?.total && functionList?.pagination?.total <= PERPAGE)
              ? false
              : {
                  pageSize: PERPAGE,
                  total: functionList?.pagination?.total
                    ? Number(functionList?.pagination.total)
                    : 1,
                  showSizeChanger: false,
                  onChange: (value) => {
                    handleChangeLocation &&
                      handleChangeLocation({ ...locationCurrent, currentPage: value });
                  }
                }
          }
          scroll={{
            y: innerAppHeight - 200,
            x: HORIZONTAL_SCROLL
          }}
        />
        {((openModalFuntion === FuncType.UPDATE && !loading) ||
          (openModalFuntion === FuncType.CREATE && !loading)) && (
          <ModalUpdateFunction
            editorObj={editorObj}
            setEditorObject={setEditorObject}
            intialValue={openModalFuntion === FuncType.UPDATE ? updateFormValue : initialValue}
            form={form}
            open={openModalFuntion === FuncType.UPDATE || openModalFuntion === FuncType.CREATE}
            onSubmitForm={handleSubmitModal}
            title={
              openModalFuntion === FuncType.CREATE
                ? t('functions:create_function')
                : t('functions:update_function')
            }
            onCancelModal={() => setOpenModalFunction('')}
          />
        )}
      </>
    </PlainLayout>
  );
};

export default FunctionPage;
