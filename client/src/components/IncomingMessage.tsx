import React from 'react'
import { IMessage } from '../context/chat/ChatContext'
import { horaMes } from '../helpers/horaMes'

export type IncomingMessageProps = {
    message: IMessage;
}


export const IncomingMessage: React.FC<IncomingMessageProps> = ({ message }) => {

console.log(message);

    return (
        <>
            <div className="incoming_msg">
                <div className="incoming_msg_img">
                    <img src="/avatar/user-profile.png" alt="sun" />
                </div>
                <div className="received_msg">
                    <div className="received_withd_msg">
                        <p><strong>{message.senderInfo.username}</strong>: {message.text}</p>
                        <span className="time_date">{horaMes(message.createdAt as string)}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

