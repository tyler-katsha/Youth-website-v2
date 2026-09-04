import type { ToastResponse } from "./types";

export interface ToastProps {
  message: string;
  type: ToastResponse;
  onClose: () => void;
  duration?: number;
}

export interface PartialToast{
  message:string;
  type: ToastResponse;
}

export interface CustomPopupProps{
    isOpen:boolean;
    type: 'success' | 'error';
    title?:string;
    message:string;
    onClose: () => void;
}