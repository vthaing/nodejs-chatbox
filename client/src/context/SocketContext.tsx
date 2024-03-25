import { createContext, useContext, useEffect } from 'react';

import { Socket } from 'socket.io-client';
import {AuthContext, IUser, } from '../auth/AuthContext';
import { scrollToBottomAnimated } from '../helpers/scrollToBottom';

import { useSocket } from '../hooks/useSocket';
import { ChatTypes } from '../types/chat.types';
import {ChatContext, IChannel, IMessage, IServerAlert} from './chat/ChatContext';
import { ListChannels, ListUsers, NewMessage } from './chat/chatReducer';


export interface ISocketContext {
    socket: Socket | null;
    online: boolean;
}
const initialContext = {
    online: false,
} as ISocketContext;



export const SocketContext: React.Context<ISocketContext> = createContext(initialContext);



export const SocketProvider: React.FC<{ children: JSX.Element }> = ({ children }: { children: JSX.Element }) => {

    const { socket, online, disconnectSocket, connectSocket } = useSocket(
      process.env.REACT_APP_SOCKET_PATH ?? 'http://localhost:3002/chat'
    );

    const { auth, logout } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);


    useEffect(() => {
        if (auth.logged) {
            connectSocket();
        }
    }, [auth, connectSocket]);

    useEffect(() => {
        if (!auth.logged) {
            disconnectSocket();
        }
    }, [auth, disconnectSocket]);

    // listen  connected users
    useEffect(() => {
        socket?.on('online-users', (users: IUser[]) => {
            dispatch(
                {
                    type: ChatTypes.listUsers,
                    payload: users,
                } as ListUsers,
            );
        });
    }, [socket, dispatch]);

    // listen  connected users
    useEffect(() => {
        socket?.on('user-channels', (channels: IChannel[]) => {
            dispatch(
                {
                    type: ChatTypes.listChannels,
                    payload: channels,
                } as ListChannels,
            );
        });
    }, [socket, dispatch]);

    useEffect(() => {
        socket?.on('private-message', (message: IMessage) => {

            const newMessage = {
                type: ChatTypes.newMessage,
                payload: message,
            } as NewMessage;

            dispatch(newMessage);
            // Move scroll to final
            scrollToBottomAnimated('messages');
        });
    }, [socket, dispatch]);

    useEffect(() => {
        socket?.on('server-alert', (alertMessage: IServerAlert) => {
            alert(alertMessage.message + '. Reasons: ' + alertMessage.reasons.join('. ') );
            console.log(alertMessage);
            if (alertMessage.forceLogout) {
                logout();
            }
        });
    }, [socket, dispatch]);


    return (
        <SocketContext.Provider value={{ socket, online }}>
            {children}
        </SocketContext.Provider>
    );
}