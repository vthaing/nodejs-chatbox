import React, {useContext} from 'react'
import {ChatContext} from "../context/chat/ChatContext";
import {PinnedMessage} from "./PinnedMessage";
type PinnedMessageProps = {
    showFull?: boolean,
}
export const PinnedMessages: React.FC<PinnedMessageProps> = ({showFull}) => {
    const { chatState, dispatch } = useContext(ChatContext);

    const { pinnedMessages } = chatState;

    return (
        <>
            <div className="pinned_messages">
                {
                    !showFull &&
                    <>Pinned message({pinnedMessages.length}):<PinnedMessage key={'pin-message-' + pinnedMessages[pinnedMessages.length-1].id} message={pinnedMessages[pinnedMessages.length-1]}/></>
                }
                {
                    showFull &&
                    pinnedMessages.map((message) => <PinnedMessage key={'pin-message-' +message.id} message={message}/>)

                }
            </div>
        </>
    )
}
