import React, {useContext, useState} from 'react'
import {ChatContext} from "../context/chat/ChatContext";
import {PinnedMessage} from "./PinnedMessage";
type PinnedMessageProps = {
}
export const PinnedMessages: React.FC<PinnedMessageProps> = (props) => {
    const { chatState } = useContext(ChatContext);
    const [showFull, setShowFull] = useState<boolean>(false);

    const { pinnedMessages } = chatState;

    return (
        <>
            <div className="pinned_messages">
                {
                    !showFull &&
                    <>
                        <p>Pinned messages({pinnedMessages.length}) {
                            (pinnedMessages.length > 1) &&
                            <button onClick={() => setShowFull(true)}>Show all</button>
                        }</p>
                        <PinnedMessage key={'pin-message-' + pinnedMessages[pinnedMessages.length-1].id} message={pinnedMessages[pinnedMessages.length-1]}/>
                    </>

                }
                {
                    showFull &&
                    <>
                        <p>Pinned messages <button onClick={() => setShowFull(false)}>Collapse</button></p>
                        {pinnedMessages.map((message) => <PinnedMessage key={'pin-message-' +message.id} message={message}/>)}
                    </>

                }
                <hr/>
            </div>
        </>
    )
}
