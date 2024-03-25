import React, {useCallback, useContext, useEffect, useState} from 'react'

import { SendMessage } from './SendMessage'
import { OutgoingMessage } from './OutgoingMessage'
import { IncomingMessage } from './IncomingMessage'
import { AuthContext } from '../auth/AuthContext'
import {ActiveChatTypesEnum, ChatContext, DEFAULT_MESSAGE_LIMIT, IMessage} from '../context/chat/ChatContext'
import {LoadMessages, LoadPinnedMessages} from '../context/chat/chatReducer'
import { fetchSynchronous} from '../helpers/fetch'
import { ChatTypes } from '../types/chat.types'
import { scrollToBottom } from '../helpers/scrollToBottom'
import {PinnedMessages} from "./PinnedMessages";
import {Button, Spin} from "antd";


export const Messages: React.FC = () => {

    const { auth } = useContext(AuthContext);
    const { chatState, dispatch } = useContext(ChatContext);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
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

            return fetchSynchronous(
                {
                    endpoint: messagesEndpoint,
                    method: 'GET',
                    token: localStorage.getItem('accessToken') ?? '',
                }
            ).then(response => {
                if (response.ok) {
                    return response.data;
                }

                return [];
            });
        },
        [activeChat],
    );

    const handleClickLoadMore = () => {
        const firstMessage = chatState.messages[0].id ?? null;
        if (!firstMessage) {
             return;
        }
        const options = {
            beforeMessageId: firstMessage,
            limit: DEFAULT_MESSAGE_LIMIT
        }
        setLoadingMessages(true);
        fetchMessages(options).then((messages) => {
            dispatch({
                type: ChatTypes.loadMessages,
                payload: messages,
            } as LoadMessages);

            if (messages.length < DEFAULT_MESSAGE_LIMIT) {
                setDontShowButtonLoadMore(true);
            }
            setLoadingMessages(false);
        });
    }


    useEffect(() => {
        fetchMessages({limit: DEFAULT_MESSAGE_LIMIT})
            .then((messages: [IMessage]) => {
                dispatch({
                    type: ChatTypes.loadMessages,
                    payload: messages,
                } as LoadMessages);
            })
            .then(() => fetchMessages({isPinnedMessage: true}))
            .then((pinnedMessages: [IMessage]) => {
                dispatch({
                    type: ChatTypes.loadPinMessages,
                    payload: pinnedMessages,
                } as LoadPinnedMessages)
            })
            .then(() => {
                setLoadingMessages(false);
                scrollToBottom('messages');
            });
    }, [fetchMessages, dispatch]);


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
                        <div key={'button-load-more'} style={{textAlign: "center"}}><Button disabled={loadingMessages} loading={loadingMessages} onClick={handleClickLoadMore}>Load more message</Button></div>
                    }
                    {
                        chatState.messages.length === 0
                        && loadingMessages
                        && <div key={'loading-spinner'} style={{textAlign: "center"}}><Spin/></div>
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
