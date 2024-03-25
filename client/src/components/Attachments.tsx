import React, {useEffect, useState} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

type AttachmentsProps = {
    refButtonUpload?: any;
    onAttachmentsChange?: any
    autoUpload?: boolean
}

export const Attachments: React.FC<AttachmentsProps> = ({refButtonUpload, onAttachmentsChange, autoUpload = true}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [showAttachment, setShowAttachment] = useState(false);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  useEffect(function () {
      setShowAttachment(fileList.length > 0);
      if (onAttachmentsChange) {
          onAttachmentsChange(fileList);
      }
  }, [fileList, onAttachmentsChange]);

  const  beforeUpload = (file: UploadFile) => {
      setFileList([...fileList, file]);

      return autoUpload;
  }

    const onRemove = (file: UploadFile) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    }

  const uploadButton = (
      <div>
        <PlusOutlined />
        <div ref={refButtonUpload} style={{ marginTop: 8 }}>Upload</div>
      </div>
  );
  return (
      <div hidden={!showAttachment}>
        <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            beforeUpload={beforeUpload}
            onRemove={onRemove}
            multiple={true}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
  );
};