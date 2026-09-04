export const CHUNK_SIZE:number = 5 * 1024 * 1024; // 5mb

export interface FileUploadRef {
    clear: () => void;
    remove: (index: number) => void;
    getFiles: () => File[];
}

export interface FileUploadProps {
    onFileSelect: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
}
export interface GalleryImage {
    imageId: number;
    imageUrl: string;
    alt: string;
    createdAt: string;
}