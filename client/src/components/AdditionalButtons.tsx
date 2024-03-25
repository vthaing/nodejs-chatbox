import React, {useContext} from 'react'
import {
    ChangePinMessageStatusPayload,
    ChangePinMessageStatusType,
    ChatContext,
    IMessage
} from '../context/chat/ChatContext';
import {DeleteOutlined, MoreOutlined, PushpinOutlined} from "@ant-design/icons";
import {Button, Dropdown, MenuProps} from "antd";
import {customFetch} from "../helpers/fetch";
import {ChatTypes} from "../types/chat.types";

export type AdditionalButtonsProps = {
    message: IMessage;
}


export const AdditionalButtons: React.FC<AdditionalButtonsProps> = ({ message }) => {

    const { dispatch } = useContext(ChatContext);

    const pinButton = message.isPinnedMessage ?
        {
            label: (<>Unpin message </>),
            key: 'unpin-message'
        } :
        {
            label: (<>Pin message </>),
            icon: <PushpinOutlined />,
            key: 'pin-message'
        }


    const handleDelete = async () => {
        await customFetch({
            endpoint: `message/${message.id}`,
            method: 'DELETE',
            token: localStorage.getItem('accessToken') ?? ''
        });

        dispatch({
            type: ChatTypes.deleteMessage,
            payload: message
        });
    };

    const handlePin = async () => {
        await customFetch({
            endpoint: `message/${message.id}/pin`,
            method: 'PATCH',
            token: localStorage.getItem('accessToken') ?? ''
        });

        dispatch({
            type: ChatTypes.changePinMessageStatus,
            payload: {
                type: ChangePinMessageStatusType.pin,
                message: message
            } as ChangePinMessageStatusPayload
        });

    };

    const handleUnpin = async () => {
        await customFetch({
            endpoint: `message/${message.id}/unpin`,
            method: 'PATCH',
            token: localStorage.getItem('accessToken') ?? ''
        });

        dispatch({
            type: ChatTypes.changePinMessageStatus,
            payload: {
                type: ChangePinMessageStatusType.unpin,
                message: message
            } as ChangePinMessageStatusPayload
        });
    };

    const onClick: MenuProps['onClick'] = ({ key }) => {
        switch (key) {
            case 'pin-message':
                handlePin();
                break;
            case 'unpin-message':
                handleUnpin();
                break;
            case 'delete-message':
                handleDelete();
                break;
        }
    };

    const items: MenuProps['items'] = [
        pinButton,
        {
            label: (<>Delete message </>),
            icon: <DeleteOutlined />,
            danger: true,
            key: 'delete-message',
        }
    ];

    return (
        <>
            <Dropdown  menu={{items, onClick}}>
                <Button title={'More Actions'} icon={<MoreOutlined />}/>
            </Dropdown>
        </>
    )
}

