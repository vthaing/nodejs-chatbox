import { IResourceComponentsProps } from "@pankod/refine-core";

import {
    Create,
    Form,
    Input,
    Select,
    useForm,
    useSelect,
    DatePicker,
} from "@pankod/refine-antd";

import { IChannel } from "interfaces";
import React from "react";

export const ChannelCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm<IChannel>();


    const { selectProps: userSelectProps } = useSelect({
        resource: "user",
        optionLabel: "username",
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Members"
                    name={["members"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...userSelectProps} mode="multiple" />
                </Form.Item>
            </Form>
        </Create>
    );
};
