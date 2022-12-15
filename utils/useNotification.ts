import { notification } from 'antd';

export default function useNotification() {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    message: string,
    description: string,
    onClose: () => void,
    icon: React.ReactNode
  ) => {
    api.open({
      message: message,
      description: description,
      duration: 3,
      icon: icon,
      onClose: onClose,
    });
  };
  return [openNotification, contextHolder] as const;
}
