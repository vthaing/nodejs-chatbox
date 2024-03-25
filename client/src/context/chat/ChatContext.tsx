import React, { createContext, useReducer } from 'react'
import { ChatAction, chatReducer, ChatState, initialChatState } from './chatReducer';
import {IUser} from "../../auth/AuthContext";


export interface IMessage {
    id: string;
    to?: string;
    channel?: string
    senderInfo: IUser
    messageContent: string;
    from: string;
    createdAt?: string;
}

export interface IMessageToSave {
    to?: string;
    channel?: string
    senderInfo: IUser
    text: string;
    from: string;
}

export interface IServerAlert {
    message: string,
    reasons: [string],
    forceLogout: boolean,
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
