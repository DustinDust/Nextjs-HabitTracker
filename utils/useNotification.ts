import { notification } from 'antd';
import { useCallback } from 'react';

export function useNotification() {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    message: string,
    description: string,
    icon: React.ReactNode,
    onClose: () => void = () => {},
    duration: number = 3
  ) => {
    api.open({
      message: message,
      description: description,
      duration: duration,
      icon: icon,
      onClose: onClose,
    });
  };
  const openNotiCallback = useCallback(openNotification, [api]);
  return [openNotiCallback, contextHolder] as const;
}
