import React from 'react'
import { IMessage } from '../context/chat/ChatContext'

export type PinMessageProps = {
    message: IMessage;
}


export const PinnedMessage: React.FC<PinMessageProps> = ({ message }) => {

    const stringTruncate = function(str: string, length: number){
        const dots = str.length > length ? '...' : '';
        return str.substring(0, length)+dots;
    };

    return (
        <>
            <div className="incoming_msg">
                <div className="received_msg">
                    <div>
                        <p style={{background: 'lightcyan'}}>{stringTruncate(message.messageContent, 30)}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

