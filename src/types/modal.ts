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