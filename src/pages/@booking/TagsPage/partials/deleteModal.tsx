/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';

import { Button, Input, Popover } from 'antd';
import { TagDetailAppType } from 'services/Tags/type';
import { useTranslation } from 'react-i18next';

export interface Props {
  currentItem?: TagDetailAppType | undefined;
  onConfirmDelete: (id: string) => void;
  children: React.ReactNode;
  disabled: boolean;
}

export const DeleteTagModal: React.FC<Props> = ({
  currentItem,
  onConfirmDelete: handleConfirmDelete,
  children,
  disabled
}) => {
  const { t } = useTranslation(['tags', 'common'])
  const [checkDelete, setCheckDelete] = useState<boolean>(false);
  const handleCheckDelete = (input: React.ChangeEvent<HTMLInputElement>) => {
    if (input?.target?.value?.trim() === currentItem?.title?.trim()) {
      setCheckDelete(true);
    } else {
      setCheckDelete(false);
    }
  };

  const renderContent = () => {
    return (
      <>
        <p className="text-left">
          {t('common:modal.confirm_content_delete')}
        </p>

        <p className="u-mt-15">
          Please type <strong>{currentItem?.title}</strong> to confirm!
        </p>
        <Input placeholder={currentItem?.title} onChange={(e) => handleCheckDelete(e)} />
        <div className="flex justify-end">
          <Button
            onClick={() => handleConfirmDelete(currentItem?.tagId || '')}
            disabled={!checkDelete}
            danger
            className="mt-2"
          >
            {t('common:button.delete')}
          </Button>
        </div>
      </>
    );
  };
  if (disabled) return <>{children}</>;
  return (
    <Popover content={renderContent} title={t('tags:delete_tag')} trigger="click" placement="left">
      {children}
    </Popover>
  );
};
