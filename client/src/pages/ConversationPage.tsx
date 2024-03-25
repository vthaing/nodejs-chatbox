import '../css/chat.css';
import {Messages} from "../components/Messages";
import { useContext, useEffect, useState} from "react";
import {ActiveChat} from "../context/chat/chatReducer";
import {ActiveChatTypesEnum, ChatContext, IActiveChatPayload} from "../context/chat/ChatContext";
import {ChatTypes} from "../types/chat.types";
import {SocketContext} from "../context/SocketContext";
import {useParams, } from "react-router-dom";

export type ConversationPageProps = {
}
export const ConversationPage: React.FC<ConversationPageProps> = (props: ConversationPageProps) => {
	const { dispatch } = useContext(ChatContext);
	const { socket } = useContext(SocketContext);
	const {conversationId} = useParams<{conversationId: string}>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (isLoading) {
			const action: ActiveChat = {
				payload: ({
					type: ActiveChatTypesEnum.CHANNEL, activeChatId: conversationId
				} as IActiveChatPayload),
				type: ChatTypes.activeChat,
			};
			dispatch(action);

			socket?.emit('open-conversation-chat', {conversation: conversationId})
			setIsLoading(false);
		}

	}, [dispatch, socket, conversationId, isLoading])

	return (
		<div  className="messaging">
			{!isLoading && <Messages/>}
		</div>
	)
}
