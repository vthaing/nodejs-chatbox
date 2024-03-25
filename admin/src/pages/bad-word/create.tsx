import { IResourceComponentsProps } from "@pankod/refine-core";

import {
    Create,
    Form,
    Input,
    Select,
    useForm,
    useSelect,
} from "@pankod/refine-antd";

import { IBadWord } from "interfaces";
import React from "react";

export const BadWordCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm<IBadWord>();


    const { selectProps: badWordCategoriesProps } = useSelect({
        resource: "bad-words/categories",
        optionLabel: "label",
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
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
        </Create>
    );
};
