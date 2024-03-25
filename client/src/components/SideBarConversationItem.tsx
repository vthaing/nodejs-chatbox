import React, { useContext } from 'react'
import {ActiveChatTypesEnum, ChatContext, IActiveChatPayload, IConversation} from '../context/chat/ChatContext';
import { ActiveChat } from '../context/chat/chatReducer';
import { ChatTypes } from '../types/chat.types';
import {SocketContext} from "../context/SocketContext";

export type SideBarConversationItemProps = {
    conversation: IConversation;
};


export const SideBarConversationItem: React.FC<SideBarConversationItemProps> = ({ conversation }: SideBarConversationItemProps) => {

    const { name, id } = conversation;

    const { chatState, dispatch } = useContext(ChatContext);

    const { activeChat } = chatState;

    const { socket } = useContext(SocketContext);

    const onClick = () => {
        const action: ActiveChat = {
            payload: ({
                    type: ActiveChatTypesEnum.CHANNEL, activeChatId: conversation.id
                } as IActiveChatPayload),
            type: ChatTypes.activeChat,
        };
        dispatch(action);
        socket?.emit('open-conversation-chat', {conversation: conversation.id})
    }


    return (
        <>
            {/* <!-- start active conversation--> */}
            <div
                className={`chat_list ${id === activeChat.activeChatId && 'active_chat'}`}
                onClick={onClick}
            >
                <div className="chat_people">
                    <div className="chat_img">
                        <img style={{maxHeight: '40px'}} src="/avatar/icons8-user-groups-80.png" alt="sun" />
                    </div>
                    <div className="chat_ib">
                        <h5>Conversation: {name}</h5>
                    </div>
                </div>
            </div>
            {/* <!-- end active conversation--> */}

        </>
    )
}
