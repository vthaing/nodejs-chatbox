import { IResourceComponentsProps } from "@pankod/refine-core";

import {
    Checkbox,
    Create,
    Form,
    Input,
    useForm,
    useSelect,
} from "@pankod/refine-antd";

import { IRestrictedIp } from "interfaces";
import React from "react";

export const RestrictedIpCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm<IRestrictedIp>();


    const { selectProps: RestrictedIpCategoriesProps } = useSelect({
        resource: "bad-words/categories",
        optionLabel: "label",
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="IP"
                    name="ip"
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
                    label="Notes"
                    name="notes"
                >
                    <Input />
                </Form.Item>

            </Form>
        </Create>
    );
};
