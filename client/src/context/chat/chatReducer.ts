import {IUser} from '../../auth/AuthContext';
import {ChatTypes} from '../../types/chat.types';
import {IActiveChatPayload, IConversation, IMediaItem, IMessage} from './ChatContext';
import {UploadFile} from "antd/es/upload/interface";

export type ChatState = {
    id: string;
    activeChat: IActiveChatPayload;
    users: IUser[];
    conversations: IConversation[];
    messages: IMessage[];
    pinnedMessages: IMessage[];
    uploadingAttachments: []
};


export interface ChatAction {
    type: ChatTypes;
    payload?: any
}

export interface ListUsers extends ChatAction {
    type: ChatTypes.listUsers; 
    payload: IUser[];
}

export interface ListConversations extends ChatAction {
    type: ChatTypes.listConversations;
    payload: IConversation[];
}

export interface ActiveChat extends ChatAction {
    type: ChatTypes.activeChat;
    payload: IActiveChatPayload;
}

export interface NewMessage extends ChatAction {
    type: ChatTypes.newMessage;
    payload: IMessage;
}

export interface AttachmentUploaded extends ChatAction {
    type: ChatTypes.attachmentUploaded;
    payload: IMediaItem
}

export interface LoadMessages extends ChatAction {
    type: ChatTypes.loadMessages;
    payload: IMessage[];
}

export interface Clean extends ChatAction {
    type: ChatTypes.clean;
}

export interface UploadAttachment extends ChatAction {
    type: ChatTypes.uploadAttachments,
    payload: UploadFile[]
}



export const initialChatState = {
    id: '',
    activeChat: { } as IActiveChatPayload,
    users: [],
    conversations: [],
    messages: [],
    pinnedMessages: [],
    uploadingAttachments: []
} as ChatState;



export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    
    console.log(action.type);

    switch(action.type){
        case ChatTypes.listUsers:
            return {
                ...state,
                users: [
                    ...(action as ListUsers).payload,
                ],
            };
        case ChatTypes.listConversations:
            return {
                ...state,
                conversations: [
                    ...(action as ListConversations).payload,
                ],
            };
        case ChatTypes.activeChat:
            const activeChatAction = (action as ActiveChat);

            if (state.activeChat === activeChatAction.payload){
                return {
                    ...state,
                }
            }; 

            return {
                ...state,
                activeChat: activeChatAction.payload,
                messages: [],
            };
        case ChatTypes.newMessage:
            const newMessageAction = (action as NewMessage);

            if (
                    state.activeChat.activeChatId === newMessageAction.payload.from ||
                    state.activeChat.activeChatId === newMessageAction.payload.to ||
                    state.activeChat.activeChatId === newMessageAction.payload.conversation
                ) {
                    const messagesCount = state.messages.length;
                    if (messagesCount > 0 && state.messages[messagesCount -1].id === newMessageAction.payload.id) {
                        return state;
                    }
                    const pinnedMessages = state.pinnedMessages;
                    if (newMessageAction.payload.isPinnedMessage) {
                        pinnedMessages.push(newMessageAction.payload);
                    }
                    return {
                        ...state,
                        messages: [
                            ...state.messages,
                            newMessageAction.payload,
                        ],
                        pinnedMessages: pinnedMessages
                    };        
                } else {
                    return state;
                }
        
        case ChatTypes.loadMessages:
            const loadMessagesAction = (action as LoadMessages);
            const pinnedMessages = loadMessagesAction.payload.filter((loadedMessage) => loadedMessage.isPinnedMessage)

            return {
                ...state,
                messages: [
                    ...loadMessagesAction.payload,
                ],
                pinnedMessages: pinnedMessages
            };
        case ChatTypes.attachmentUploaded:
            const mediaItem = (action as AttachmentUploaded).payload;

            const updatedMessages = state.messages.map((message) => {
                if (message.id === mediaItem.messageId) {
                    if (!message.mediaItems || !message.mediaItems.length) {
                        message.mediaItems = [];
                    }

                    if (!message.mediaItems.find((existedMediaItem) => mediaItem.id === existedMediaItem.id)) {
                        message.mediaItems?.push(mediaItem);
                    }
                }
                return message;
            });

            return {
                ...state,
                messages: updatedMessages
            };
        case ChatTypes.clean:
            return {
                ...initialChatState,
            }
        case ChatTypes.uploadAttachments:
            return {
                ...state,
                uploadingAttachments: action.payload
            }

        default:
            return {
                ...initialChatState,
            };

    }

};