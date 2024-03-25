import React, {ChangeEvent, FormEvent, useContext, useRef, useState} from 'react'
import {AuthContext} from '../auth/AuthContext';
import {
    ActiveChatTypesEnum,
    ChatContext,
    IAttachmentInfo,
    IMessageToSave
} from '../context/chat/ChatContext';
import {SocketContext} from '../context/SocketContext';
import {Attachments} from "./Attachments";
import {PaperClipOutlined} from "@ant-design/icons";
import {UploadFile} from "antd/es/upload/interface";
import {ChatTypes} from "../types/chat.types";
import {UploadAttachment} from "../context/chat/chatReducer";

const MESSAGE_MAX_LENGTH = 164;

export const SendMessage: React.FC = () => {


    const [message, setMessage] = useState('');

    const { auth } = useContext(AuthContext);
    const { chatState, dispatch } = useContext(ChatContext);
    const { socket } = useContext(SocketContext);
    const buttonUploadRef = useRef();
    const [attachments, setAttachments] = useState<UploadFile[]>([]);
    const [attachmentInputKey, setAttachmentInputKey] = useState(Math.random());

    const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        console.log(chatState);
        setMessage(target.value);
    }


    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (message.trim().length === 0) { return; }
        if (message.trim().length > MESSAGE_MAX_LENGTH) {return;}

        const messageToSend = {
            from: auth.id,
            to: _getTo(),
            conversation: _getConversation(),
            text: message,
            attachments: _getAttachmentsInfo(),
        } as IMessageToSave;
        // Emit a websocket
        socket?.emit('private-message', messageToSend);
        setMessage('');

        if (attachments) {
            const action: UploadAttachment = {
                type: ChatTypes.uploadAttachments,
                payload: attachments
            }
            dispatch(action);
            setAttachments([]);
            setAttachmentInputKey(Math.random());
        }
    }

    const _getAttachmentsInfo = () => {
        return attachments.map((attachment) => ({
            name: attachment.name,
            type: attachment.type,
            uid: attachment.uid,
            size: attachment.size
        } as IAttachmentInfo))
    }

    const handleOnAttachmentsChange = (fileList: UploadFile[]) => {
        setAttachments(fileList);
    }

    const _getTo = () => {
        return (chatState.activeChat.type === ActiveChatTypesEnum.DIRECT) ?
            chatState.activeChat.activeChatId :
            null;
    }

    const _getConversation = () => {
        return (chatState.activeChat.type === ActiveChatTypesEnum.CHANNEL) ?
            chatState.activeChat.activeChatId :
            null;
    }

    const handleAttachmentClick = () => {
        // @ts-ignore
        buttonUploadRef.current.click()
    }

    return (
        <form
            onSubmit={onSubmit}
        >
            <div className="type_msg row">
                {
                    chatState.activeChat.conversation?.showUploadAttachmentInChat &&
                    <div className="col-sm-2">
                        <button type={"button"} className="mt-3" onClick={handleAttachmentClick}><PaperClipOutlined /></button>
                    </div>
                }
                <div className="input_msg_write col-sm-8">
                    <input
                        type="text"
                        className="write_msg"
                        placeholder="Say something..."
                        value={message}
                        onChange={onChange}
                        maxLength={MESSAGE_MAX_LENGTH}
                    />
                    {
                        (message.length >= MESSAGE_MAX_LENGTH)
                        && <p className={'invalid-feedback'}>The message length should not be greater than {MESSAGE_MAX_LENGTH}</p>
                    }
                </div>
                <div className="col-sm-2 text-center">
                    <button
                        className="msg_send_btn mt-3"
                        type="submit"
                        disabled={message.length >= MESSAGE_MAX_LENGTH}
                    >
                        Send
                    </button>
                </div>
            </div>
            {
                chatState.activeChat.conversation?.showUploadAttachmentInChat &&
                <Attachments
                    refButtonUpload={buttonUploadRef}
                    autoUpload={false}
                    onAttachmentsChange={handleOnAttachmentsChange}
                    attachments={attachments}
                    key={attachmentInputKey}
                />
            }

        </form>
    )
}
