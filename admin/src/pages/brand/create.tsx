import { IResourceComponentsProps } from "@pankod/refine-core";

import {
    Create,
    Form,
    Input,
    Select,
    useForm,
    useSelect,
    DatePicker, Checkbox,
} from "@pankod/refine-antd";

import { IBrand } from "interfaces";
import React from "react";

export const BrandCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm<IBrand>();


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
                    label="Secret Key"
                    name="secretKey"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Enabled"
                    name="enabled"
                    valuePropName="checked"
                >
                    <Checkbox defaultChecked={true} />
                </Form.Item>
            </Form>
        </Create>
    );
};
