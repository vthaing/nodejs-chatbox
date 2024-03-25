import React, {useState} from "react";
import {Button} from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";


type ButtonCreatePinMessageProps = {
    conversationId: string
    onSuccess?: any
}


export const ButtonCreatePinMessage: React.FC<ButtonCreatePinMessageProps> = ({conversationId, onSuccess}) => {
    return (
        <Button icon={<PlusSquareOutlined/>}
            title={'Create Pin Message'}
            // onClick={() => setOpen(true)}
        >
            Create
        </Button>
    );
}