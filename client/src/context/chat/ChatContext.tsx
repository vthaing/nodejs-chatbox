import React, { createContext, useReducer } from 'react'
import { ChatAction, chatReducer, ChatState, initialChatState } from './chatReducer';


export interface IMessage {
    id: string;
    to?: string;
    channel?: string
    from: string;
    text: string;
    createdAt?: string;
}

export interface IChannel {
    id: string;
    name?: string;
    members: [string];
    owner?: string
}

export enum ActiveChatTypesEnum  {
    DIRECT = 'direct',
    CHANNEL = 'channel',
}

export interface IActiveChatPayload {
    type?: string;
    activeChatId?: ActiveChatTypesEnum
}

export interface IChatContext {
    chatState: ChatState;
    dispatch: React.Dispatch<ChatAction>;
}


const initialChatContext = {
    chatState: initialChatState,
    dispatch: (action: ChatAction) => { }
} as IChatContext;



export const ChatContext = createContext(initialChatContext);


export const ChatProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {

    const [chatState, dispatch] = useReducer(chatReducer, initialChatState);

    return (
        <ChatContext.Provider value={{
            chatState,
            dispatch,
        }}>
            {children}
        </ChatContext.Provider>
    )
}
