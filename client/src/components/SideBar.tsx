import React, { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext';
import { ChatContext } from '../context/chat/ChatContext';
import { SideBarChatItem } from './SideBarChatItem'
import {SideBarConversationItem} from "./SideBarConversationItem";

export const SideBar: React.FC = () => {

    const { chatState } = useContext(ChatContext);
    const { auth } = useContext(AuthContext);



    return (
        <>

            <div className="conversation_chat">
                {
                    chatState
                        .conversations
                        .map(conversation => (
                            <SideBarConversationItem
                                key={conversation.id}
                                conversation={conversation}
                            />
                        ))
                }
            </div>
            <div className="inbox_chat">
                {
                    chatState
                        .users
                        .filter(
                            user => user.id !== auth.id,
                        )
                        .map(
                            user =>
                            (
                                <SideBarChatItem
                                    key={user.id}
                                    user={user}
                                />
                            ))
                }

                <div className="extra_space"></div>

            </div>
            {/* <!-- End Sidebar --> */}
        </>
    )
}
