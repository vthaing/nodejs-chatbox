import React, {useCallback, useEffect, useState} from 'react';
import { Modal, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import {IMessage} from "../context/chat/ChatContext";
import axios from "axios";

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

type UploadingAttachmentsProps = {
    message: IMessage,
    attachments: UploadFile[]
}

export const UploadingAttachments: React.FC<UploadingAttachmentsProps> = ({message, attachments}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>(attachments);

    const handleCancel = () => setPreviewOpen(false);


    const uploadFiles = useCallback(() => {
        fileList.forEach((attachment, index) => {
            const form = new FormData();
            form.append('file', attachment.originFileObj as RcFile);
            axios.post(
                process.env.REACT_APP_API_URL + `/message/${message.id}/upload-attachment`,
                form,
                {
                    headers: {
                        'Authorization': `Bearer ` + localStorage.getItem('accessToken') ?? '',
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const newFileList = fileList.map((item) => {
                            if (item.uid === attachment.uid) {
                                item.percent = progressEvent.progress;
                                if (!progressEvent.progress || progressEvent.progress < 1) {
                                    item.status = "uploading";
                                } else {
                                    item.status = "done";
                                }
                            }
                            return item;
                        });

                        setFileList(newFileList);
                    },
                }
            ).then((response) => {
                const newFileList = fileList.map((item) => {
                    if (item.uid === attachment.uid) {
                        item.status = "done";
                        item.percent = 100;
                    }
                    return item;
                });

                setFileList(newFileList);
            });
        });
    }, [fileList, message.id])

    useEffect(() => {
        uploadFiles()
    }, [])

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    return (
        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                showUploadList={{showRemoveIcon: false}}
            >
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="Peview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};