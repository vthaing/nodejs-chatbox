import React, { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../auth/AuthContext';
import { ChatContext, IMessage } from '../context/chat/ChatContext';
import { SocketContext } from '../context/SocketContext';

export const SendMessage: React.FC = () => {


    const [message, setMessage] = useState('');

    const { auth } = useContext(AuthContext);
    const { chatState } = useContext(ChatContext);
    const { socket } = useContext(SocketContext);



    const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setMessage(target.value);
    }


    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (message.trim().length === 0) { return; }

        const messageToSend = {
            from: auth.id,
            to: chatState.activeChat,
            text: message,
        } as IMessage;
        // Emit a websocket
        socket?.emit('private-message', messageToSend);
        
        setMessage('');
    }


    return (
        <form
            onSubmit={onSubmit}
        >
            <div className="type_msg row">
                <div className="input_msg_write col-sm-9">
                    <input
                        type="text"
                        className="write_msg"
                        placeholder="Say something..."
                        value={message}
                        onChange={onChange}
                    />
                </div>
                <div className="col-sm-3 text-center">
                    <button
                        className="msg_send_btn mt-3"
                        type="submit"
                    >
                        Send
                    </button>
                </div>
            </div>
        </form>
    )
}
