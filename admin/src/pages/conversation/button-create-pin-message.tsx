import React, {useState} from "react";
import {PlusSquareOutlined} from "@ant-design/icons";
import {useModalForm} from 'sunflower-antd';
import {Modal, Input, Button, Form, Spin} from 'antd';
import { useCreate, useGetIdentity } from "@pankod/refine-core";


type ButtonCreatePinMessageProps = {
    conversationId: string
    onSuccess?: any
}


export const ButtonCreatePinMessage: React.FC<ButtonCreatePinMessageProps> = ({conversationId, onSuccess}) => {

    const [form] = Form.useForm();



    const { data: userIdentity } = useGetIdentity();
    const { mutate } = useCreate();
    const {
        modalProps,
        formProps,
        show,
        formLoading,
        formResult,
    } = useModalForm({
        defaultVisible: false,
        autoSubmitClose: true,
        autoResetForm: true,
        async submit({text}) {
            mutate({
                resource: "message",
                values: {
                    text: text,
                    from: userIdentity.id,
                    conversation: conversationId,
                    isPinnedMessage: true
                },
            });
        },
        form,
    });


    return (
        <>
            <Modal {...modalProps} title="Create PIN message" okText="submit" width={600}>
                <Spin spinning={formLoading}>
                    <>
                        {formResult && <p>Result: {formResult}</p>}
                        <Form layout="vertical" {...formProps}>
                            <Form.Item
                                label="Message Content"
                                name="text"
                                rules={[{required: true, message: 'Please enter the message content'}]}
                            >
                                <Input placeholder="Message content"/>
                            </Form.Item>
                        </Form>
                    </>
                </Spin>
            </Modal>
            <Button icon={<PlusSquareOutlined/>} onClick={show}> Create</Button>
        </>
    );
}