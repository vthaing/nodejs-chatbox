import React from 'react'
import { AuthProvider } from './auth/AuthContext'
import { ChatProvider } from './context/chat/ChatContext'
import { SocketProvider } from './context/SocketContext'
import { AppRouter } from './router/AppRouter'

export const ChatApp: React.FC = () => {
    return (
        <ChatProvider>
            <AuthProvider>
                <SocketProvider>
                    <AppRouter />
                </SocketProvider>
            </AuthProvider>
        </ChatProvider>
    )
}
