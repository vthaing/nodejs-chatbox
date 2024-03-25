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



export interface ChangePinMessageStatus extends ChatAction {
    type: ChatTypes.changePinMessageStatus
    payload: IMessage
}

export interface ListConversations extends ChatAction {
    type: ChatTypes.listConversations;
    payload: IConversation[];
}

export interface ActiveChat extends ChatAction {
    type: ChatTypes.activeChat;
    payload: IActiveChatPayload;
}

export interface DeleteMessage extends ChatAction {
    type: ChatTypes.deleteMessage;
    payload: IMessage;
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

export interface LoadPinnedMessages extends ChatAction {
    type: ChatTypes.loadPinMessages;
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

const handlePinMessageChange = (state: ChatState, action: ChangePinMessageStatus) => {
    const updatedMessage = action.payload;
    const messages = state.messages;
    for (const i in messages) {
        if (messages[i].id === updatedMessage.id) {
            messages[i] = updatedMessage;
            break;
        }
    }

    let pinnedMessages = state.pinnedMessages;
    if (updatedMessage.isPinnedMessage) {
        if (!pinnedMessages.find(message => message.id === updatedMessage.id)) {
            pinnedMessages.push(updatedMessage);
        }
    } else {
        pinnedMessages = pinnedMessages.filter(message => message.id !== updatedMessage.id);
    }

    return {
        ...state,
        messages: messages,
        pinnedMessages: pinnedMessages
    }
}

const handleDeleteMessage = (state: ChatState, action: DeleteMessage) => {
    return {
        ...state,
        messages: state.messages.filter(message => message.id !== action.payload.id),
        pinnedMessages: state.pinnedMessages.filter(message => message.id !== action.payload.id)
    }
}



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
            }

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

        case ChatTypes.changePinMessageStatus:
            return handlePinMessageChange(state, action as ChangePinMessageStatus);
        case ChatTypes.deleteMessage:
            return handleDeleteMessage(state, action as DeleteMessage);

        case ChatTypes.loadMessages:
            const loadMessagesAction = (action as LoadMessages);
            const currentMessages = state.messages ?? []
            const existedIds: any = {};
            const uniqueMessages: IMessage[] = [];
            [
                ...loadMessagesAction.payload,
                ...currentMessages
            ].forEach(message => {
                if (existedIds.hasOwnProperty(message.id)) {
                    return;
                }
                existedIds[message.id] = message.id;
                uniqueMessages.push(message);
            });



            return {
                ...state,
                messages: uniqueMessages,
            };
        case ChatTypes.loadPinMessages:
            return {
                ...state,
                pinnedMessages: (action as LoadPinnedMessages).payload
            }
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