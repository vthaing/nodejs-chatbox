import React, {useEffect, useState} from 'react'
import {IMediaItem} from "../context/chat/ChatContext";
import { Image } from 'antd';

export type MessageMediaItemsProps = {
    mediaItems: IMediaItem[]
}
export const MessageMediaItems: React.FC<MessageMediaItemsProps> = ({mediaItems}) => {

    return (
        <div className={'message-media-items'}>
            <Image.PreviewGroup>
                {mediaItems.map((mediaItem) => (
                    <Image className={'message-media-item'} src={process.env.REACT_APP_API_URL + mediaItem.url}
                       style={{
                           maxHeight: 100, maxWidth: 100, margin: 2, padding: 3,
                           border: "1px solid #d9d9d9", borderRadius: 5
                        }}
                    />
                ))}
            </Image.PreviewGroup>
        </div>
    )
}
