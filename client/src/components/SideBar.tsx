import React, { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext';
import { ChatContext } from '../context/chat/ChatContext';
import { SideBarChatItem } from './SideBarChatItem'

export const SideBar: React.FC = () => {

    const { chatState } = useContext(ChatContext);
    const { auth } = useContext(AuthContext);



    return (
        <>
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
