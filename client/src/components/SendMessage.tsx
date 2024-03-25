import React, {ChangeEvent, FormEvent, useContext, useRef, useState} from 'react'
import { AuthContext } from '../auth/AuthContext';
import {ActiveChatTypesEnum, ChatContext, IMessageToSave} from '../context/chat/ChatContext';
import { SocketContext } from '../context/SocketContext';
import {Attachments} from "./Attachments";
import {PaperClipOutlined} from "@ant-design/icons";

const MESSAGE_MAX_LENGTH = 164;

export const SendMessage: React.FC = () => {


    const [message, setMessage] = useState('');

    const { auth } = useContext(AuthContext);
    const { chatState } = useContext(ChatContext);
    const { socket } = useContext(SocketContext);
    const buttonUploadRef = useRef();
    const [showAttachment, setShowAttachment] = useState(false);



    const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
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
        } as IMessageToSave;
        // Emit a websocket
        socket?.emit('private-message', messageToSend);
        
        setMessage('');
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

    const onAttachmentsChange = (newFileList: []) => {
        if (newFileList.length > 0) {
            setShowAttachment(true);
        } else {
            setShowAttachment(false);
        }
    }

    const handleBeforeUpload = (file: any, fileList: []) => {
        if (fileList.length > 0) {
            setShowAttachment(true);
        }
    }




    return (
        <form
            onSubmit={onSubmit}
        >
            <div className="type_msg row">
                <div className="col-sm-2">
                   <button className="mt-3" onClick={handleAttachmentClick}><PaperClipOutlined /></button>
                </div>
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
            <div hidden={!showAttachment}>
                <Attachments
                    onAttachmentsChange={onAttachmentsChange}
                    refButtonUpload={buttonUploadRef}
                    onBeforeUpload={handleBeforeUpload}
                    autoUpload={false}
                />
            </div>
        </form>
    )
}
