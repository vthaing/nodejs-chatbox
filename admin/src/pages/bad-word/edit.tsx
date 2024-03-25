import React from "react";
import { IResourceComponentsProps } from "@pankod/refine-core";

import {
    Edit,
    Form,
    Input, Select,
    useForm, useSelect,
} from "@pankod/refine-antd";


import { IBadWord } from "../../interfaces";

export const BadWordEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm<IBadWord>({});

    const { selectProps: badWordCategoriesProps } = useSelect({
        resource: "bad-words/categories",
        optionLabel: "label",
    });

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Term"
                    name="term"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Categories"
                    name={["categories"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...badWordCategoriesProps} mode="multiple" />
                </Form.Item>
            </Form>
        </Edit>
    );
};
