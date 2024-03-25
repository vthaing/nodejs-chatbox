import React, {useEffect, useState} from "react";
import {IConversation} from "../../interfaces";
import {AUTH_USER_DATA_KEY, CHATBOX_LIBRARY_URL} from "../../constants";
import useScript from "../../hooks/useScript";

type ChatBoxProps = {
    conversation: IConversation
}

export const ChatBox: React.FC<ChatBoxProps> = ({conversation}) => {

    const [chatBoxIframeProps, setChatBoxIframeProps] = useState<any>();

    const status = useScript(CHATBOX_LIBRARY_URL, {
        removeOnUnmount: false,
    })

    useEffect(() => {
        // @ts-ignore
        if (typeof ChatBoxesManagement !== 'undefined') {
            // @ts-ignore
            const chatBoxesManager = new ChatBoxesManagement();

            setChatBoxIframeProps({
                src: chatBoxesManager.getConversationIframeUrl(conversation.id),
                name: localStorage.getItem(AUTH_USER_DATA_KEY)
            });
        }
    }, [status])

    return (
        <>
            {chatBoxIframeProps && <iframe height={600} width={600} {...chatBoxIframeProps} />}
        </>
    );
}