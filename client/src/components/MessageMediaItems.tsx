import React, { useState} from 'react'
import {IMediaItem} from "../context/chat/ChatContext";
import Lightbox from "yet-another-react-lightbox";

export type MessageMediaItemsProps = {
    mediaItems: IMediaItem[]
}
export const MessageMediaItems: React.FC<MessageMediaItemsProps> = ({mediaItems}) => {

    const [lightboxIndex, setLightboxIndex] = useState(-1);



    return (
        <div className={'message-media-items'}>
            {mediaItems.map((mediaItem, mediaIndex) => (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setLightboxIndex(mediaIndex)
                    }}
                    key={'media-item-link-' + mediaItem.id}
                >
                    <img
                        alt={mediaItem.name}
                        key={'media-item-img-' + mediaItem.id} className={'message-media-item'} src={process.env.REACT_APP_API_URL + mediaItem.url}
                        style={{
                           maxHeight: 100, maxWidth: 100, margin: 2, padding: 3,
                           border: "1px solid #d9d9d9", borderRadius: 5
                        }}
                    />
                </button>
                ))}
            <Lightbox
                open={lightboxIndex > 0}
                index={lightboxIndex}
                close={() =>setLightboxIndex(-1)}
                slides={mediaItems.map((mediaItem) => ({
                    src: mediaItem.url,
                    key: mediaItem.id,
                    width: mediaItem.imageWidth ?? 100,
                    height: mediaItem.imageHeight ?? 100
                }))}
            />
        </div>
    )
}
