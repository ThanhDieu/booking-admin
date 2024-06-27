import { Popover, Switch, Typography } from 'antd';
import clsx from 'clsx';
import XIcon from 'components/shared/Icon';
import { ThemeType } from 'configs/const/general';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';
import { loadTheme } from 'utils/storage';

interface Props {
  isCollapse?: boolean;
  value?: boolean;
  onChangeTheme: () => void;
}

const SwitchTheme = ({ onChangeTheme, isCollapse }: Props) => {
  const { t } = useTranslation(['common']);
  const { selected } = useAppSelector((state) => state.app.theme);

  const content = (
    <div className="flex items-center gap-3 ">
      <Typography.Text className="ml-[10px]">{t('common:general.dark_mode')}</Typography.Text>
      <Switch size="small" onChange={() => onChangeTheme()} />
    </div>
  );

  useEffect(() => {
    loadTheme();
  });

  return (
    <div
      className={clsx(
        'flex items-center w-full h-10  m-1 px-6',
        isCollapse ? 'justify-center' : 'justify-between'
      )}
    >
      <div className="flex">
        {isCollapse ? (
          <Popover
            destroyTooltipOnHide={!isCollapse}
            placement="right"
            content={content}
            arrow={false}
            overlayStyle={{ marginLeft: '50px' }}
            overlayClassName="ml-10"
          >
            <XIcon name="moonMenuIcon" className="w-[18px]" />
          </Popover>
        ) : (
          <XIcon name="moonMenuIcon" className="w-[18px]" />
        )}
        {!isCollapse && (
          <Typography.Text className="ml-[10px]">{t('common:general.dark_mode')}</Typography.Text>
        )}
      </div>
      {!isCollapse && (
        <div className={clsx(isCollapse ? 'flex-1' : '')}>
          <Switch
            size="small"
            onChange={() => onChangeTheme()}
            defaultChecked={selected === ThemeType.DARK}
          />
        </div>
      )}
    </div>
  );
};

export default SwitchTheme;
