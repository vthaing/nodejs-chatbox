import React, {useCallback, useContext, useEffect, useState} from 'react'

import { SendMessage } from './SendMessage'
import { OutgoingMessage } from './OutgoingMessage'
import { IncomingMessage } from './IncomingMessage'
import { AuthContext } from '../auth/AuthContext'
import {ActiveChatTypesEnum, ChatContext, DEFAULT_MESSAGE_LIMIT, IMessage} from '../context/chat/ChatContext'
import { LoadMessages } from '../context/chat/chatReducer'
import { customFetch } from '../helpers/fetch'
import { ChatTypes } from '../types/chat.types'
import { scrollToBottom } from '../helpers/scrollToBottom'
import {PinnedMessages} from "./PinnedMessages";
import {Button} from "antd";


export const Messages: React.FC = () => {

    const { auth } = useContext(AuthContext);
    const { chatState, dispatch } = useContext(ChatContext);
    const [loadingMoreMessages, setLoadingMoreMessages] = useState<boolean>(false);
    const [dontShowButtonLoadMore, setDontShowButtonLoadMore] = useState<boolean>(false);

    const { activeChat } = chatState;

    const fetchMessages = useCallback(
        async (options = null) => {
            let messagesEndpoint = activeChat.type === ActiveChatTypesEnum.DIRECT ?
                ('message/history/' + activeChat.activeChatId) :
                ('message/conversation/' + activeChat.activeChatId);
            if (options) {
                const queryString = new URLSearchParams(options).toString();
                messagesEndpoint = messagesEndpoint + '?' + queryString;
            }

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
            }
        },
        [activeChat, dispatch],
    );

    const handleClickLoadMore = () => {
        const countBeforeLoadMore = chatState.messages.length;
        const firstMessage = chatState.messages[0].id ?? null;
        if (!firstMessage) {
             return;
        }
        const options = {
            beforeMessageId: firstMessage,
            limit: DEFAULT_MESSAGE_LIMIT
        }
        setLoadingMoreMessages(true);
        fetchMessages(options).then(() => {
            if (countBeforeLoadMore === chatState.messages.length) {
                setDontShowButtonLoadMore(true);
            }
            setLoadingMoreMessages(false);
        });
    }


    useEffect(() => {
        fetchMessages().then(() => scrollToBottom('messages'));
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
                        !dontShowButtonLoadMore &&
                        chatState.messages.length >= DEFAULT_MESSAGE_LIMIT &&
                        <p style={{textAlign: "center"}}><Button disabled={loadingMoreMessages} loading={loadingMoreMessages} onClick={handleClickLoadMore}>Load more message</Button></p>
                    }
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
