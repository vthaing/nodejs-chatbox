import React, {useEffect, useState} from "react";
import {IConversation} from "../../interfaces";
import {AUTH_USER_DATA_KEY, CHATBOX_LIBRARY_URL} from "../../constants";

type ChatBoxProps = {
    conversation: IConversation
}

export const ChatBox: React.FC<ChatBoxProps> = ({conversation}) => {

    const [chatBoxJsLoaded, setChatBoxJsLoaded] = useState<boolean>(false);
    const [chatBoxIframeProps, setChatBoxIframeProps] = useState<any>();

    const loadChatBoxLibraryJs = () => {
        const chatBoxJs = window.document.getElementById('chat-box-js');
        if (chatBoxJs) {
            return;
        }
        const chatBoxJsScript = window.document.createElement('script');
        chatBoxJsScript.src = CHATBOX_LIBRARY_URL;
        chatBoxJsScript.id = 'chat-box-js';
        chatBoxJsScript.onload = function () {
            setChatBoxJsLoaded(true);
        }

        window.document.body.appendChild(chatBoxJsScript);
    }

    useEffect(() => {
        if (!chatBoxJsLoaded) {
            loadChatBoxLibraryJs();
            return;
        }

        // @ts-ignore
        const chatBoxesManager = new chatBoxesManagement();

        setChatBoxIframeProps({
            src: chatBoxesManager.getConversationIframeUrl(conversation.id),
            name: localStorage.getItem(AUTH_USER_DATA_KEY)
        });
    }, [chatBoxJsLoaded])


    return (
        <>
            {chatBoxJsLoaded && chatBoxIframeProps && <iframe height={600} width={600} {...chatBoxIframeProps} />}
        </>
    );
}