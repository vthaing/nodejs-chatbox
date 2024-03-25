import React from 'react'
import { IMessage } from '../context/chat/ChatContext'
import { horaMes } from '../helpers/horaMes'


export type OutgoingMessageProps = {
    message: IMessage;
}

export const OutgoingMessage: React.FC<OutgoingMessageProps> = ({ message }) => {
    return (
        <>
            <div className="outgoing_msg">
                <div className="sent_msg">
                    <p>{message.text}</p>
                    <span className="time_date">
                        {horaMes(message.createdAt as string)}
                    </span>
                </div>
            </div>
        </>
    )
}
