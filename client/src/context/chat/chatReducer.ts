import {IUser} from '../../auth/AuthContext';
import {ChatTypes} from '../../types/chat.types';
import {IActiveChatPayload, IConversation, IMessage} from './ChatContext';

export type ChatState = {
    id: string;
    activeChat: IActiveChatPayload;
    users: IUser[];
    conversations: IConversation[];
    messages: IMessage[];
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

export interface LoadMessages extends ChatAction {
    type: ChatTypes.loadMessages;
    payload: IMessage[];
}

export interface Clean extends ChatAction {
    type: ChatTypes.clean;
}



export const initialChatState = {
    id: '',
    activeChat: { } as IActiveChatPayload,
    users: [],
    conversations: [],
    messages: [],
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
                    return {
                        ...state,
                        messages: [
                            ...state.messages,
                            newMessageAction.payload,
                        ],
                    };        
                } else {
                    return state;
                }
        
        case ChatTypes.loadMessages:
            const loadMessagesAction = (action as LoadMessages);

            return {
                ...state,
                messages: [
                    ...loadMessagesAction.payload,
                ],
            };
        
        case ChatTypes.clean:
            return {
                ...initialChatState,
            }

        default:
            return {
                ...initialChatState,
            };

    }

};