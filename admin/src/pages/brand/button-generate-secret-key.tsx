import React from "react";
import {IBrand, IUser} from "../../interfaces";
import {Button, Popconfirm} from "antd";
import {CheckOutlined, EditOutlined} from "@ant-design/icons";
import {useApiUrl, useCustomMutation} from "@pankod/refine-core";

type ButtonGenerateSecretKeyProps = {
    brand: IBrand
    onSuccess?: any
}

export const ButtonGenerateSecretKey: React.FC<ButtonGenerateSecretKeyProps> = ({brand, onSuccess}) => {

    const apiUrl = useApiUrl();

    const { mutate, isLoading } = useCustomMutation();

    const handleClickGenerateSecretKey = () => {
        mutate({
            url: `${apiUrl}/brands/${brand.id}/generate-secret-key`,
            method: "patch",
            values: {},
        }, {
            onSuccess: onSuccess
        });
    }

    return (
        <Popconfirm
            okText="Generate"
            okType="danger"
            title={'Are you sure to generate the secret key? Please make sure to send the new secret key to the brand after generating'}
            okButtonProps={{ disabled: isLoading }}
            onConfirm={handleClickGenerateSecretKey}
        >
            <Button
                icon={<EditOutlined className={'ant-btn-primary'} />}
                title={'Generate New Secret Key'}
                danger
            >
                Generate New Secret Key
            </Button>
        </Popconfirm>
    );
}