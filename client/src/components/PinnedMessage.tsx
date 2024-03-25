import React, {useContext, useState} from 'react'
import {ChatContext, IMessage} from '../context/chat/ChatContext'
import {scrollToMessage} from "../helpers/scrollToBottom";
import {ChatTypes} from "../types/chat.types";
import {LoadMessages} from "../context/chat/chatReducer";
import {Button, Spin} from "antd";

export type PinMessageProps = {
    message: IMessage;
}


export const PinnedMessage: React.FC<PinMessageProps> = ({ message }) => {

    const stringTruncate = function(str: string, length: number){
        const dots = str.length > length ? '...' : '';
        return str.substring(0, length)+dots;
    };

    const { chatState, dispatch, fetchMessages } = useContext(ChatContext);
    const [loadingMessage, setLoadingMessage] = useState<boolean>(false);

    const handleClickPinMessage = () => {
        if (chatState.messages.find((searchingMessage) => searchingMessage.id === message.id)) {
            scrollToMessage(message.id);
        } else {
            setLoadingMessage(true);
            fetchMessages({
                beforeMessageId: chatState.messages[0]?.id ?? null,
                fromMessageId: message.id
            }).then((messages) => {
                dispatch({
                   type: ChatTypes.loadMessages,
                   payload: messages
                } as LoadMessages);
            }).then(() => {
                setLoadingMessage(false);
                scrollToMessage(message.id);
            })
        }

    }

    return (
        <>
            <div className="incoming_msg">
                <div className="received_msg">
                    <div>
                        <p style={{background: 'lightcyan'}}>
                            {stringTruncate(message.messageContent, 30)} &nbsp;
                            <Button disabled={loadingMessage} loading={loadingMessage} onClick={handleClickPinMessage} style={{color: "blue"}}>Go to message</Button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

