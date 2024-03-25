import React, { useContext } from 'react'
import {ActiveChatTypesEnum, ChatContext, IActiveChatPayload, IChannel} from '../context/chat/ChatContext';
import { ActiveChat } from '../context/chat/chatReducer';
import { ChatTypes } from '../types/chat.types';

export type SideBarChannelItemProps = {
    channel: IChannel;
};


export const SideBarChannelItem: React.FC<SideBarChannelItemProps> = ({ channel }: SideBarChannelItemProps) => {

    const { name, id } = channel;

    const { chatState, dispatch } = useContext(ChatContext);

    const { activeChat } = chatState;

    const onClick = () => {
        const action: ActiveChat = {
            payload: ({
                    type: ActiveChatTypesEnum.CHANNEL, activeChatId: channel.id
                } as IActiveChatPayload),
            type: ChatTypes.activeChat,
        };
        dispatch(action);
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
                        <h5>Channel: {name}</h5>
                    </div>
                </div>
            </div>
            {/* <!-- end active conversation--> */}

        </>
    )
}
