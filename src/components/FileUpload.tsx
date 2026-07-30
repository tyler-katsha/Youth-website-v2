import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "../modules/FileUpload.module.css";

export interface FileUploadRef {
    clear: () => void;
    remove: (index: number) => void;
    getFiles: () => File[];
}

interface FileUploadProps {
    onFileSelect: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
}

export const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(({ onFileSelect, accept, multiple = false, maxFiles = 10, }, ref) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [files]);

    useEffect(() => {
        onFileSelect(files);
    }, [files]);

    const clearFiles = () => {
        setFiles([]);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    useImperativeHandle(ref, () => ({
        clear: clearFiles,
        remove: removeFile,
        getFiles: () => files,
    }));

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files) return;

        const selected = Array.from(e.target.files);

        setFiles((prev) => {
            const combined = [...prev];

            selected.forEach((file) => {
                const exists = combined.some(
                    (f) =>
                        f.name === file.name &&
                        f.size === file.size &&
                        f.lastModified === file.lastModified
                );

                if (!exists && combined.length < maxFiles) {
                    combined.push(file);
                }
            });

            return combined;
        });

        e.target.value = "";
    };

    return (
        <div className={styles.uploadContainer}>
            {files.length <= maxFiles && (
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
            )}

            <div className={styles.previewGrid}>
                {files.map((file, index) => (
                    <div key={index} className={styles.previewBox}>
                        <img
                            src={previews[index]}
                            alt={file.name}
                            className={styles.previewImage}
                        />

                        <span className={styles.fileName}>{file.name}</span>

                        <button type="button" className={styles.removeBtn} onClick={() => removeFile(index)}>Remove</button>
                    </div>
                ))}
            </div>

            {files.length > 0 && (
                <button type="button" className={styles.clearBtn} onClick={clearFiles}>Clear All</button>
            )}
        </div>
    );
}
);

FileUpload.displayName = "FileUpload";