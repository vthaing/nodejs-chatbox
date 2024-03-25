import React from "react";
import { IResourceComponentsProps } from "@pankod/refine-core";

import {
    Edit,
    Form,
    Input,
    useForm,
} from "@pankod/refine-antd";

import {IUser} from "../../interfaces";

export const AdminUserEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm<IUser>();

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input type={'email'} />
                </Form.Item>
            </Form>
        </Edit>
    );
};
