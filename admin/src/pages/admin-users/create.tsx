import {IResourceComponentsProps, UpdatePasswordFormTypes} from "@pankod/refine-core";

import {
    Create,
    Form,
    Input,
    Select,
    useForm,
    useSelect,
} from "@pankod/refine-antd";

import {IBadWord, IUser} from "interfaces";
import React from "react";
import {Button} from "antd";

export const AdminUserCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm<IUser>();


    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Name"
                    name="displayName"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
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
                <Form.Item
                    name="password"
                    label={'New Password'}
                    rules={[{ required: true }]}
                    style={{ marginBottom: "12px" }}
                >
                    <Input
                        type="password"
                        placeholder="●●●●●●●●"
                        size="large"
                    />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    hasFeedback
                    dependencies={["password"]}
                    rules={[
                        {
                            required: true,
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        'Password does not match'
                                    ),
                                );
                            },
                        }),
                    ]}
                    style={{ marginBottom: "12px" }}
                >
                    <Input
                        type="password"
                        placeholder="●●●●●●●●"
                        size="large"
                    />
                </Form.Item>
            </Form>
        </Create>
    );
};
