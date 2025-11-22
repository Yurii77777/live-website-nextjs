import { toast, ToastOptions } from "react-toastify";
import { TOAST_AUTO_CLOSE_MS } from "@/constants/toast";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: TOAST_AUTO_CLOSE_MS,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...defaultOptions, ...options }),

  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...defaultOptions, ...options }),

  info: (message: string, options?: ToastOptions) =>
    toast.info(message, { ...defaultOptions, ...options }),

  warning: (message: string, options?: ToastOptions) =>
    toast.warning(message, { ...defaultOptions, ...options }),
};
