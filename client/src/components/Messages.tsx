import React, { useCallback, useContext, useEffect } from 'react'

import { SendMessage } from './SendMessage'
import { OutgoingMessage } from './OutgoingMessage'
import { IncomingMessage } from './IncomingMessage'
import { AuthContext } from '../auth/AuthContext'
import {ActiveChatTypesEnum, ChatContext, IMessage} from '../context/chat/ChatContext'
import { LoadMessages } from '../context/chat/chatReducer'
import { customFetch } from '../helpers/fetch'
import { ChatTypes } from '../types/chat.types'
import { scrollToBottom } from '../helpers/scrollToBottom'
import {PinnedMessages} from "./PinnedMessages";


export const Messages: React.FC = () => {

    const { auth } = useContext(AuthContext);
    const { chatState, dispatch } = useContext(ChatContext);

    const { activeChat } = chatState;

    const fetchMessages = useCallback(

        async () => {
            const messagesEndpoint = activeChat.type === ActiveChatTypesEnum.DIRECT ?
                ('message/history/' + activeChat.activeChatId) :
                ('message/conversation/' + activeChat.activeChatId);

            const response = await customFetch<IMessage[]>(
                {
                    endpoint: messagesEndpoint,
                    method: 'GET',
                    token: localStorage.getItem('accessToken') ?? '',
                }
            );

            const { ok, data } = response;
            if (ok) {

                const loadAction = {
                    type: ChatTypes.loadMessages,
                    payload: data ?? [],
                } as LoadMessages;

                dispatch(loadAction);
                scrollToBottom('messages');

            }
        },
        [activeChat, dispatch],
    );


    useEffect(() => {
        // Load chat messages
        fetchMessages();
    }, [fetchMessages]);


    return (
        <>
            <div
                className="mesgs"
            >
                {
                    (chatState.pinnedMessages.length > 0) &&
                    <PinnedMessages/>
                }
                <div
                    id="messages"
                    className="msg_history"
                >
                    {
                        chatState.messages.map(
                            (msg) => (msg.from === auth.id)
                                ? <OutgoingMessage key={msg.id} message={msg} />
                                : <IncomingMessage key={msg.id} message={msg} />
                        )
                    }
                </div>
                <SendMessage />
            </div>
        </>
    )
}
