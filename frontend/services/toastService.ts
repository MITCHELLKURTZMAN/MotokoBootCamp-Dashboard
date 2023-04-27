import _toast from 'react-hot-toast';

export enum ToastType {
  Plain,
  Success,
  Error,
}

export const toastError = (err: any, preText: string = ''): void => {
  if (err.message) {
    _toast.error(preText + err.message, {
      style: {
        background: '#A53945',
        color: '#FFFFFF',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
      },
    });
  } else {
    _toast.error(preText + err, {
      style: {
        background: '#A53945',
        color: '#FFFFFF',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
      },
    });
  }
};

export const toast = (message: string, toastType: ToastType): void => {
  switch (toastType) {
    case ToastType.Success:
      _toast.success(message, {
        style: {
          background: '#388E3C',
          color: '#FFFFFF',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
        },
      });
      break;
    case ToastType.Error:
      _toast.error(message, {
        style: {
          background: '#A53945',
          color: '#FFFFFF',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
        },
      });
      break;
    default:
      _toast(message, {
        style: {
          background: '#2E2E2E',
          color: '#FFFFFF',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
        },
      });
      break;
  }
};
