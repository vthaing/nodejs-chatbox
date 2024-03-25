import React, {createContext, useCallback, useReducer} from 'react'
import {ChatAction, chatReducer, ChatState, initialChatState} from './chatReducer';
import {IUser} from "../../auth/AuthContext";
import {fetchSynchronous} from "../../helpers/fetch";

export const DEFAULT_MESSAGE_LIMIT = 10;
export interface IMessage {
    id: string;
    to?: string;
    conversation?: string
    senderInfo: IUser
    messageContent: string;
    from: string;
    isPinnedMessage: boolean;
    attachments?: IAttachmentInfo[];
    mediaItems?: IMediaItem[];
    createdAt?: string;
}

export interface IMessageToSave {
    to?: string;
    conversation?: string
    senderInfo: IUser
    text: string;
    from: string;
    attachments: IAttachmentInfo[]
}

export interface IServerAlert {
    message: string,
    reasons: [string],
    forceLogout: boolean,
}

export interface IConversation {
    id: string;
    name?: string;
    members: [string];
    owner?: string
    showUploadAttachmentInChat: boolean | null
}

export enum ActiveChatTypesEnum  {
    DIRECT = 'direct',
    CHANNEL = 'conversation',
}

export interface IActiveChatPayload {
    type?: ActiveChatTypesEnum;
    activeChatId?: string,
    conversation?: IConversation | null
}

export interface IChatContext {
    chatState: ChatState;
    fetchMessages: (options: {}) => Promise<[IMessage]>
    dispatch: React.Dispatch<ChatAction>;
}


export interface IAttachmentInfo {
    name: string,
    type: string,
    uid: string,
    size: number
}

export interface IMediaItem {
    id: string;
    messageId: string;
    mimeType: string;
    name: string;
    size: number;
    createdAt?: string;
    updatedAt?: string;
    url: string
    userId: string;
    imageWidth: number | null;
    imageHeight: number | null
    params: any;
}



const initialChatContext = {
    chatState: initialChatState,
    dispatch: (action: ChatAction) => { },
    fetchMessages: (options: {}) => {}
} as IChatContext;



export const ChatContext = createContext(initialChatContext);


export const ChatProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {

    const [chatState, dispatch] = useReducer(chatReducer, initialChatState);
    const {activeChat} = chatState;

    const fetchMessages =  useCallback( (options) => {
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
    }, [activeChat])

    return (
        <ChatContext.Provider value={{
            chatState,
            dispatch,
            fetchMessages
        }}>
            {children}
        </ChatContext.Provider>
    )
}
