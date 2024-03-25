import React from 'react'
import { IMessage } from '../context/chat/ChatContext'
import { horaMes } from '../helpers/horaMes'

export type PinMessageProps = {
    message: IMessage;
}


export const PinnedMessage: React.FC<PinMessageProps> = ({ message }) => {

    return (
        <>
            <div className="incoming_msg">
                <div className="received_msg">
                    <div>
                        <p style={{background: 'lightcyan'}}>{message.messageContent}</p>
                        <span className="time_date">{horaMes(message.createdAt as string)}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

