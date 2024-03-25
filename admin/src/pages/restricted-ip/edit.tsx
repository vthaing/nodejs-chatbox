import React from "react";
import { IResourceComponentsProps } from "@pankod/refine-core";

import {
    Checkbox,
    Edit,
    Form,
    Input, Select,
    useForm, useSelect,
} from "@pankod/refine-antd";


import { IRestrictedIp } from "../../interfaces";

export const RestrictedIpEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm<IRestrictedIp>({});

    const { selectProps: RestrictedIpCategoriesProps } = useSelect({
        resource: "bad-words/categories",
        optionLabel: "label",
    });

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
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
                        <Checkbox/>
                    </Form.Item>
                    <Form.Item
                        label="Notes"
                        name="notes"
                    >
                        <Input />
                    </Form.Item>

                </Form>
            </Form>
        </Edit>
    );
};
