import React from "react";
import {IUser} from "../../interfaces";
import {Button, Popconfirm} from "antd";
import {CheckOutlined} from "@ant-design/icons";
import {useApiUrl, useCustomMutation} from "@pankod/refine-core";

type ButtonBanAdminUserProps = {
    record: IUser
    onSuccess?: any
}

export const ButtonUnbanAdminUser: React.FC<ButtonBanAdminUserProps> = ({record, onSuccess}) => {

    const apiUrl = useApiUrl();

    const { mutate, isLoading } = useCustomMutation();

    const handleClickBanUser = () => {
        mutate({
            url: `${apiUrl}/user/${record.id}/unban`,
            method: "patch",
            values: {},
        }, {
            onSuccess: onSuccess
        });
    }

    return (
        <Popconfirm
            okText="Unban"
            okType="danger"
            title={'Are you sure to Unban the user?'}
            okButtonProps={{ disabled: isLoading }}
            onConfirm={handleClickBanUser}
        >
            <Button
                icon={<CheckOutlined className={'ant-btn-primary'} />}
                title={'Unban'}
            >
                Unban
            </Button>
        </Popconfirm>
    );
}