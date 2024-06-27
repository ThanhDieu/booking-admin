/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { Button, Space, Tag } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

interface Taglist {
  extId: string;
  name: string;
}
interface Props {
  currentTagList: Taglist[];
  showNumber?: number;
  toggle?: boolean;
}
const ExpandTags: React.FC<Props> = ({ currentTagList, showNumber = 6, toggle }) => {
  const [expandTags, setExpandTags] = useState<boolean>(false);
  const tagNameItem = (tag: Taglist) => {
    return (
      <Tag className="m-1" key={tag.extId}>
        {tag.name}
      </Tag>
    );
  };

  const renderTagName = (tags: Taglist[]) => {
    const { tags1, tags2 } = tags.reduce(
      (result, currentObject, index) => {
        if (index < showNumber) {
          (result.tags1 as Taglist[]).push(currentObject);
        } else {
          (result.tags2 as Taglist[]).push(currentObject);
        }
        return result;
      },
      { tags1: [], tags2: [] }
    );

    return (
      <>
        {tags1.map((tag) => tagNameItem(tag))}
        {tags2.length ? (
          !expandTags ? (
            <Button
              type="link"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setExpandTags(true);
              }}
              title="Show more"
              className="p-0"
            >
              + {tags.length - showNumber}
            </Button>
          ) : (
            tags2.map((tag) => tagNameItem(tag))
          )
        ) : (
          ''
        )}
      </>
    );
  };

  useEffect(() => {
    if (currentTagList) setExpandTags(false);
  }, [currentTagList]);
  return (
    <Space wrap className="gap-0">
      {renderTagName(currentTagList)}{' '}
      {expandTags && toggle && (
        <Button
          type="link"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setExpandTags(false);
          }}
          title="Hide"
        >
          <LeftOutlined />
        </Button>
      )}
    </Space>
  );
};

export default ExpandTags;
