import React from "react";
import {IUser} from "../../interfaces";
import {Button, Popconfirm} from "antd";
import {CheckOutlined, StopOutlined} from "@ant-design/icons";
import {useApiUrl, useCreate, useCustomMutation} from "@pankod/refine-core";

type ButtonBanUserProps = {
    ip: string
    user?: IUser | null
    onSuccess?: any
}

export const ButtonAddToRestrictedIp: React.FC<ButtonBanUserProps> = ({ip, user, onSuccess}) => {

    const apiUrl = useApiUrl();

    const { mutate, isLoading } = useCreate();

    const handleClickOk = () => {
        mutate({
            resource: "restricted-ips",
            values: {
                ip: ip,
                enabled: true,
                notes: user ? `Added via IP History of the user ${user.id}` : ''
            },
        }, {
            onSuccess: () => window.location.reload()
        });
    }

    return (
        <Popconfirm
            okText="Add"
            okType="danger"
            title={`Are you sure to add the ip ${ip} to the restricted list?`}
            okButtonProps={{ disabled: isLoading }}
            onConfirm={handleClickOk}
        >
            <Button
                icon={<StopOutlined/>}
                danger={true}
                title={'Add to restricted IP'}
            >
                Restrict IP
            </Button>
        </Popconfirm>
    );
}