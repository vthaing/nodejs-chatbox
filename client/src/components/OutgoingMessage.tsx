import React, {useContext, useMemo} from 'react'
import {ChatContext, IMessage} from '../context/chat/ChatContext'
import { horaMes } from '../helpers/horaMes'
import {Element as ScrollElement} from 'react-scroll';
import {UploadFile} from "antd/es/upload/interface";
import {UploadingAttachments} from "./UploadingAttachment";
import {MessageMediaItems} from "./MessageMediaItems";

export type OutgoingMessageProps = {
    message: IMessage;
}

export const OutgoingMessage: React.FC<OutgoingMessageProps> = ({ message }) => {

    const { chatState } = useContext(ChatContext);

    const uploadingAttachments = useMemo((): UploadFile[] => {
        if (chatState.uploadingAttachments.length === 0) {
            return [];
        }
        const result: UploadFile[] = [];

        message.attachments?.map((attachment) => {
            const file = chatState.uploadingAttachments
                .find((uploadingFile: UploadFile) => uploadingFile.uid === attachment.uid);
            if (file) {
                result.push(file);
            }
            return true;
        })

        return result;
    }, [message, chatState.uploadingAttachments])




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
                    {
                        (uploadingAttachments.length > 0) &&
                        <UploadingAttachments message={message} attachments={uploadingAttachments}/>
                    }
                    {
                        message.mediaItems && message.mediaItems.length > 0 &&
                        <MessageMediaItems mediaItems={message.mediaItems}/>
                    }
                </div>
            </div>
        </>
    )
}
