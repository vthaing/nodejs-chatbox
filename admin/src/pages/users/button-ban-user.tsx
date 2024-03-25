import React, {useState} from "react";
import {IUser} from "../../interfaces";
import {Button, Popconfirm} from "antd";
import {CheckOutlined, StopOutlined} from "@ant-design/icons";
import {useApiUrl, useCustom, useCustomMutation, useUpdate} from "@pankod/refine-core";
import {Modal, useModal} from "@pankod/refine-antd";

type ButtonBanUserProps = {
    record: IUser
    onSuccess?: any
}

export const ButtonBanUser: React.FC<ButtonBanUserProps> = ({record, onSuccess}) => {

    const { modalProps, show } = useModal();
    const handleFormSubmit = () => {

    }

    return (
        <>
            <Button
                danger
                icon={<StopOutlined  />}
                title={'Ban user'}
                onClick={show}
            >
            </Button>
            <Modal {...modalProps} onOk={handleFormSubmit}>
                Hello moto
            </Modal>
        </>
    );
}