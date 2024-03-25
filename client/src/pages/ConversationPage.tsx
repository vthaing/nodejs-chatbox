import '../css/chat.css';
import {Messages} from "../components/Messages";
import { useContext, useEffect, useState} from "react";
import {ActiveChat} from "../context/chat/chatReducer";
import {ActiveChatTypesEnum, ChatContext, IActiveChatPayload, IConversation} from "../context/chat/ChatContext";
import {ChatTypes} from "../types/chat.types";
import {SocketContext} from "../context/SocketContext";
import {useParams, } from "react-router-dom";
import {customFetch} from "../helpers/fetch";
import Swal from "sweetalert2";

export type ConversationPageProps = {
}
export const ConversationPage: React.FC<ConversationPageProps> = (props: ConversationPageProps) => {
	const { dispatch } = useContext(ChatContext);
	const { socket } = useContext(SocketContext);
	const {conversationId} = useParams<{conversationId: string}>();
	const [conversation, setConversation] = useState<IConversation>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (isLoading && socket && conversation) {
			const action: ActiveChat = {
				payload: ({
					type: ActiveChatTypesEnum.CHANNEL,
					activeChatId: conversation.id,
					conversation: conversation
				} as IActiveChatPayload),
				type: ChatTypes.activeChat,
			};
			dispatch(action);

			socket?.emit('open-conversation-chat', {conversation: conversation.id})
			setIsLoading(false);
		}

	}, [dispatch, socket, conversation, isLoading]);

	useEffect( () => {
		customFetch({
			endpoint: `conversations/${conversationId}`,
			method: 'GET',
			token: localStorage.getItem('accessToken') ?? ''
		}).then((response) => {
			if (response.ok) {
				setConversation(response.data);
			} else {
				Swal.fire({
					title: "Alert",
					text: 'Conversation not found. Please try again later',
					icon: "error",
				});
			}
		})
	}, [conversationId]);

	return (
		<div  className="messaging">
			{!isLoading && <Messages/>}
		</div>
	)
}
