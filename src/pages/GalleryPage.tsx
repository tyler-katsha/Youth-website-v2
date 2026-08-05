import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import styles from '../modules/Gallery.module.css';
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { GallerySkeleton } from "../skeletons/pages/GallarySkeleton";
import { RedirectUser } from "../components/RedirectUser";
import { API } from "../utils/API";
import { Modal } from "../modals/Modal";
import { FileUpload, type FileUploadRef } from "../components/FileUpload";
import { acceptArray, CHUNK_SIZE } from "../utils/types";
import { Profile } from "../components/Profile";
import { extractName, formatDate, getToken } from "../utils/Utils";
import { Toast, type PartialToast } from "../modals/Toast";

export interface GalleryImage {
    imageId: number;
    imageUrl: string;
    alt: string;
    createdAt: string;
}

export const Gallery = () => {
    const { user, isLoading } = useUser();
    const navigate = useNavigate();

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [_previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState(true);
    const [images, setImages] = useState<GalleryImage[]>([]);


    const [selectedRecord, setSelectedRecord] = useState<GalleryImage | null>(null);
    const openDetails = (record: GalleryImage) => setSelectedRecord(record);
    const closeDetails = () => setSelectedRecord(null);

    const loaderRef = useRef<HTMLDivElement>(null);
    const uploadRef = useRef<FileUploadRef>(null);

    const [toast, setToast] = useState<PartialToast | null>(null);

    const fetchImages = useCallback(async (pageNumber: number) => {
        if (isFetching) return;

        setIsFetching(true);

        try {

            const response = await fetch(`${API}/images?page=${pageNumber}&size=100`, {
                method: "GET",
                credentials: "include",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                setToast({ message: data.message ?? 'Failed to fetch images.', type: 'error' })
                return;
            }

            const temp = await response.json();

            const data: GalleryImage[] = temp.content;

            setImages(prev => {

                const map = new Map(prev.map(img => [img.imageId, img]));

                data.forEach(img => map.set(img.imageId, img));

                return Array.from(map.values());

            });

            setHasMore(!temp.last);
            setPage(pageNumber);

        } catch (error) {
            setToast({ message: 'Network issue occurred', type: 'error' })
        } finally {
            setIsFetching(false);
        }

    }, []);

    const handleFileUpload = async () => {
        if (selectedFiles.length === 0) return;

        setIsUploading(true);

        try {
            await Promise.all(
                selectedFiles.map(async (file) => {
                    // Large files -> chunk upload
                    if (file.size > CHUNK_SIZE) {
                        await uploadFileChunks(file);
                        return;
                    }

                    const formData = new FormData();
                    formData.append("image", file);

                    const response = await fetch(`${API}/images/upload`, {
                        method: "POST",
                        credentials: "include",
                        body: formData,
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${getToken()}`
                        }
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        setToast({ message: data.message ?? 'Server error', type: 'error' })
                        return;
                    }
                })
            );

            setSelectedFiles([]);
            setIsUploadModalOpen(false);

            setImages([]);
            setPage(0);
            setHasMore(true);

            await fetchImages(0);

        } catch (error) {
            setToast({ message: 'Network issue occurred', type: 'error' })
        } finally {
            setIsUploading(false);
        }
    };

    const uploadFileChunks = async (file: File | null) => {

        try {
            if (!file) return;
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
            const fileId = crypto.randomUUID();

            for (let i = 0; i < totalChunks; i++) {
                const start = i * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);

                const formData = new FormData();
                formData.append('chunk', chunk);
                formData.append('fileId', fileId);
                formData.append('chunkIndex', i.toString());
                formData.append('totalChunks', totalChunks.toString());
                formData.append('fileName', file.name);

                const response = await fetch(`${API}/images/upload-chunks`, {
                    method: "POST",
                    body: formData,
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    setToast({ message: data.message ?? 'Server error', type: 'error' })
                    return;
                }

                setToast({ message: 'Uploaded Image successfully', type: 'success' })
            }

        } catch (error) {
            setToast({ message: 'Network issue occurred', type: 'error' })
        }
    }

    const removeImage = async (id: number) => {
        setLoading(true);
        const previousImages = [...images];
        setImages(prev => prev.filter(i => i.imageId !== id));
        try {

            const response = await fetch(`${API}/images/${id}`, {
                method: "DELETE",
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            })

            if (!response.ok) {
                setImages(previousImages);
                const data = await response.json();
                setToast({ message: data.message ?? 'Server error', type: 'error' })
                return;
            }

            setToast({ message: 'Image deleted successfully', type: 'success' })
        } catch (error) {
            setImages(previousImages);
            setToast({ message: 'Network issue occurred', type: 'error' })
        } finally {
            setLoading(false);
            closeDetails();
        }
    }

    useEffect(() => {
        if (selectedFiles.length === 0) {
            setPreviewUrls([]);
            return;
        }

        const urls = selectedFiles.map(file => URL.createObjectURL(file));

        setPreviewUrls(urls);

        return () => {
            urls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [selectedFiles]);

    useEffect(() => {
        if (user) {
            fetchImages(0);
        }
    }, [user, isLoading, navigate, fetchImages]);

    useEffect(() => {

        const observer = new IntersectionObserver(entries => {

            if (entries[0].isIntersecting && hasMore && !isLoading) {
                fetchImages(page + 1);
            }
        }, { threshold: 0.1, rootMargin: '200px' });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect()
    }, [page, hasMore, isLoading])

    if (isLoading) return <GallerySkeleton />;
    if (!user) return <RedirectUser />;

    return (
        <>
            <Navigation title='Gallery' />

            <Modal isOpen={!!selectedRecord} onClose={closeDetails} title="Image Details">
                {selectedRecord && (
                    <div className={styles.imagePreview}>
                        <div className={styles.imageInfo}>

                            <p><strong>Alt:</strong> {selectedRecord.alt}</p>
                            <p><strong>Created At:</strong> {formatDate(selectedRecord.createdAt)}</p>
                        </div>
                        <hr className={styles.divider} />
                        <div className={styles.imageContainer}>
                            <img src={selectedRecord.imageUrl} alt={selectedRecord.alt} className={styles.previewImage} />
                        </div>

                        <button className={styles.removeButton} onClick={() => removeImage(selectedRecord.imageId)}>{loading ? "Removing..." : "Remove Image"}</button>
                    </div>
                )}
            </Modal>

            <div className={styles.pageWrapper}>
                <div className={styles.contentContainer}>
                    <div className={styles.header}>
                        <h1>Youth Group Memories</h1>
                        <button onClick={() => setIsUploadModalOpen(true)} className={styles.modalTrigger}>Upload New Photo</button>
                    </div>

                    <div className={styles.imageGrid}>
                        {images.map((img) => (
                            <div key={img.imageId} className={styles.imageCard} onClick={() => openDetails(img)}>
                                {img.imageUrl ? (
                                    <img src={img.imageUrl} alt={img.alt} loading="lazy" className={styles.image} />
                                ) : (
                                    <Profile name={extractName(img.alt)} profileImageUrl={undefined} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div ref={loaderRef}></div>
                </div>
            </div>

            <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Image Upload">
                <div className={styles.uploadContainer}>
                    <p className={styles.uploadInfo}>
                        Select up to <strong>{selectedFiles.length}/10 images</strong>.
                    </p>

                    <FileUpload ref={uploadRef} accept={acceptArray.join(",")} multiple maxFiles={10} onFileSelect={setSelectedFiles} />

                    <button className={styles.uploadTrigger} disabled={isUploading} onClick={handleFileUpload}>{isUploading ? "Uploading..." : "Confirm Upload"}</button>
                </div>
            </Modal>

            {toast && (<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />)}
            <Footer />
        </>
    );
};