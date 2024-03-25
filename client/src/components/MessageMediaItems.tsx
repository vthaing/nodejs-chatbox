import React, {useEffect, useState} from 'react'
import {IMediaItem} from "../context/chat/ChatContext";
import UploadList from "antd/es/upload/UploadList";
import {UploadFile} from "antd/es/upload/interface";

export type MessageMediaItemsProps = {
    mediaItems: IMediaItem[]
}
export const MessageMediaItems: React.FC<MessageMediaItemsProps> = ({mediaItems}) => {

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        setFileList(
            mediaItems.map((mediaItem) => ({
                uid: mediaItem.id,
                size: mediaItem.size,
                name: mediaItem.name,
                thumbUrl: process.env.REACT_APP_API_URL + mediaItem.url,
                fileName: mediaItem.name,
                url: process.env.REACT_APP_API_URL + mediaItem.url,
                status: "done",
                type: mediaItem.mimeType
            } as UploadFile))
        );
    }, [mediaItems])

    return (
        <>
            <UploadList isImageUrl={(file) => true} showRemoveIcon={false} locale={{}} items={fileList} listType={'picture-card'}/>
        </>
    )
}
