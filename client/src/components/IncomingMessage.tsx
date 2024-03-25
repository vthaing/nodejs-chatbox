import React from 'react'
import { IMessage } from '../context/chat/ChatContext'
import { horaMes } from '../helpers/horaMes'
import {Element as ScrollElement} from "react-scroll/modules";
import {MessageMediaItems} from "./MessageMediaItems";
import {AdditionalButtons} from "./AdditionalButtons";

export type IncomingMessageProps = {
    message: IMessage;
}


export const IncomingMessage: React.FC<IncomingMessageProps> = ({ message }) => {

    return (
        <>
            <div className="incoming_msg">
                <div className="incoming_msg_img">
                    <img src="/avatar/user-profile.png" alt="sun" />
                </div>
                <div className="received_msg">
                    <div className="received_withd_msg">
                        {message.isPinnedMessage && <ScrollElement name={'pinned-message-' + message.id}/>}
                        <p>
                            <strong>{message.senderInfo ? message.senderInfo.displayName : 'Unknown User'}</strong>: {message.messageContent}
                        </p>
                        <span className="time_date">
                            {horaMes(message.createdAt as string)}
                            <AdditionalButtons message={message}/>
                        </span>
                        {
                            message.mediaItems && message.mediaItems.length > 0 &&
                            <MessageMediaItems mediaItems={message.mediaItems}/>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

