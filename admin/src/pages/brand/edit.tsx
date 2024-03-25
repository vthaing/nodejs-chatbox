import React from "react";
import { IResourceComponentsProps } from "@pankod/refine-core";

import {
    Checkbox,
    Edit,
    Form,
    Input, Select,
    useForm, useSelect,
} from "@pankod/refine-antd";


import { IBrand } from "../../interfaces";

export const BrandEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm<IBrand>({});

    const { selectProps: userSelectProps } = useSelect({
        resource: "user",
        optionLabel: "username",
    });

    return (
        <Edit saveButtonProps={saveButtonProps}>
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
                    label="Enabled"
                    name="enabled"
                    valuePropName="checked"
                >
                    <Checkbox defaultChecked={true} />
                </Form.Item>
                <Form.Item
                    label="Can Upload Attachment"
                    name="canUploadAttachment"
                    valuePropName="checked"
                    help={"The user can upload attachments in a conversation if this field is enabled on both the brand and the conversation."}
                >
                    <Checkbox/>
                </Form.Item>
            </Form>
        </Edit>
    );
};
