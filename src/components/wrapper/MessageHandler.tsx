/**
 * Dependencies: StoreProvider
 */
import { useEffect } from 'react';
import { useAppSelector } from 'store';
import { message as _message } from 'antd';
import errors from 'configs/const/errors';

export interface MessageHandlerProps {
  children?: React.ReactNode;
}
const MessageHandler = (props: MessageHandlerProps) => {
  const { message, status, logs } = useAppSelector((state) => state.app.alert);

  const messageOptions = {
    error: _message.error,
    warn: _message.warning,
    info: _message.info
  };
  useEffect(() => {
    if (message !== 'N/A' && status === errors.ERR) {
      messageOptions[status](message, 2);
    }
  }, [logs]);

  return <>{props.children}</>;
}

export default MessageHandler;
