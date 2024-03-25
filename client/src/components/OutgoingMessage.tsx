import React from 'react'
import { IMessage } from '../context/chat/ChatContext'
import { horaMes } from '../helpers/horaMes'
import {Element as ScrollElement} from 'react-scroll';

export type OutgoingMessageProps = {
    message: IMessage;
}

export const OutgoingMessage: React.FC<OutgoingMessageProps> = ({ message }) => {
    return (
        <>
            <div className="outgoing_msg">
                <div className="sent_msg">
                    {message.isPinnedMessage && <ScrollElement name={'pinned-message-' + message.id}/>}
                    <p>
                        {message.messageContent}
                    </p>
                    <span className="time_date">
                        {horaMes(message.createdAt as string)}
                    </span>
                </div>
            </div>
        </>
    )
}
