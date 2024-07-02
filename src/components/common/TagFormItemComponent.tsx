/* eslint-disable @typescript-eslint/no-explicit-any */
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Form, Select, SelectProps } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { useDidMount } from 'hooks';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TagDetailAppType } from 'services/Tags/type';
import { useAppDispatch, useAppSelector } from 'store';
import { getTagList } from 'store/booking/Tag';
import { removeDuplicateObjects } from 'utils/array';
import { formatSelectOption, revertValueOption } from 'utils/format';
import { queryCase } from 'utils/queryParams';
interface TagItemProps {
  label: string;
  name: string;
  isRequired: boolean;
  disabled?: boolean;
}
interface Props {
  propertyCode?: string;
  tagType: string;
  item: TagItemProps;
  onChange?: (value: any, option: DefaultOptionType | DefaultOptionType[]) => void;
  form?: any;
  initialTags?: TagDetailAppType[];
}
const TagFormItemComponent: React.FC<Props> = ({
  propertyCode,
  tagType,
  item,
  onChange,
  form,
  initialTags
}) => {
  const { t } = useTranslation(['common'])
  const dispatch = useAppDispatch();
  const tagValues: any[] = useWatch(item.name, form);
  const [perPage, setPerPage] = useState(10);

  const { data: tagList } = useAppSelector((state) => state?.booking?.tag);

  const handleLoadMore = () => {
    setPerPage(perPage + 10);
  };
  const renderButtonLoadMore = useMemo(() => {
    if (
      tagList?.data &&
      tagList?.data?.length &&
      tagList?.pagination &&
      tagList?.pagination?.total &&
      tagList?.pagination?.total - tagList?.data?.length > 0
    ) {
      return (
        <Button
          type="link"
          className="w-full"
          onClick={() => handleLoadMore && handleLoadMore()}
          icon={<EllipsisOutlined />}
        />
      );
    }
  }, [tagList]);

  const tagOptions: SelectProps['options'] = useMemo(() => {
    const tags = tagList?.data || [];
    if (!tags || tags?.length === 0) {
      if (tagValues?.length > 0) {
        return tagValues?.map((item) => {
          return {
            label: item ? revertValueOption(item?.value || item)?.label : '',
            value: item,
            disabled: true
          };
        });
      }
    }
    return formatSelectOption(tags, 'name', 'tagId', '@', 'status');
  }, [tagList?.data, tagValues]);

  const formatTagOptions = useMemo(() => {
    const initialTag =
      initialTags && initialTags?.length > 0
        ? initialTags.map((tag: TagDetailAppType) => {
          return {
            ...tag,
            label: tag.title,
            value: `${tag.tagId}@${tag.title}`
          };
        })
        : [];
    const mergedTags = tagOptions ? [...initialTag, ...tagOptions] : [];

    const uniqueArray = removeDuplicateObjects(mergedTags, 'tagId');
    return uniqueArray;
  }, [initialTags, tagOptions]);

  useDidMount(
    (controller) => {
      const query = queryCase(
        propertyCode
          ? { propertyId: propertyCode, type: tagType, perPage }
          : { type: tagType, isGlobal: 'true', perPage }
      );
      dispatch(getTagList({ query, signal: controller?.signal }));
    },
    [perPage]
  );

  return (
    <Form.Item
      label={item.label || t('common:table.tags')}
      name={item.name || 'tagIds'}
      rules={[{ required: item.isRequired }]}
    >
      <Select
        options={formatTagOptions}
        mode="multiple"
        maxTagCount="responsive"
        onChange={onChange}
        disabled={item?.disabled}
        dropdownRender={(node) => (
          <>
            {node}
            {renderButtonLoadMore}
          </>
        )}
      />
    </Form.Item>
  );
};
export default TagFormItemComponent;
