import React from 'react'
import {IMediaItem} from "../context/chat/ChatContext";
import {Gallery, Item} from "react-photoswipe-gallery";
import 'photoswipe/dist/photoswipe.css'

export type MessageMediaItemsProps = {
    mediaItems: IMediaItem[]
}
export const MessageMediaItems: React.FC<MessageMediaItemsProps> = ({mediaItems}) => {

    const smallItemStyles: React.CSSProperties = {
        cursor: 'pointer',
        objectFit: 'cover',
        maxHeight: "100px",
        maxWidth: "100px",
        border: "1px solid #d9d9d9",
        borderRadius: 5,
        margin: 3, padding: 3
    }
    return (
        <Gallery>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 100px 100px',
                    gridTemplateRows: '100px',
                    gridGap: 12,
                }}
            >
                {mediaItems.map((mediaItem) => (

                    <Item
                        original={process.env.REACT_APP_API_URL + mediaItem.url}
                        thumbnail={process.env.REACT_APP_API_URL + mediaItem.url}
                        width={mediaItem.imageWidth ?? 100}
                        height={mediaItem.imageHeight ?? 100}
                        alt={mediaItem.name}
                    >
                        {({ ref, open }) => (
                            <img
                                style={smallItemStyles}
                                src={process.env.REACT_APP_API_URL + mediaItem.url}
                                ref={ref as React.MutableRefObject<HTMLImageElement>}
                                onClick={open}
                                alt={mediaItem.name}
                            />
                        )}
                    </Item>
                ))}
            </div>
        </Gallery>
    )
}

