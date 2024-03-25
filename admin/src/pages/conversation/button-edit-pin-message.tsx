import React from "react";
import {EditOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {useModalForm} from 'sunflower-antd';
import {Modal, Input, Button, Form, Spin} from 'antd';
import {useCreate, useGetIdentity, useUpdate} from "@pankod/refine-core";
import {IMessage} from "../../interfaces";


type ButtonEditPinMessageProps = {
    message: IMessage,
    onSuccess?: any
}


export const ButtonEditPinMessage: React.FC<ButtonEditPinMessageProps> = ({message, onSuccess}) => {

    const [form] = Form.useForm();
    const { data: userIdentity } = useGetIdentity();
    const { mutate } = useUpdate();
    const {
        modalProps,
        formProps,
        show,
        formLoading,
        formResult,
        visible
    } = useModalForm({
        defaultVisible: false,
        autoSubmitClose: true,
        autoResetForm: true,
        async submit({text}) {
            mutate({
                resource: "message",
                id: message.id,
                values: {
                    text: text,
                    from: userIdentity.id,
                    conversation: message.conversation,
                    isPinnedMessage: true
                },
            }, {
                onSuccess: () => window.location.reload()
            });
        },
        form,
    });


    return (
        <>
            <Modal {...modalProps} title="Edit PIN message" okText="submit" width={600}>
                <Spin spinning={formLoading}>
                    <>
                        {formResult && <p>Result: {formResult}</p>}
                        <Form layout="vertical" {...formProps}>
                            <Form.Item
                                label="Message Content"
                                name="text"
                                initialValue={message.messageContent}
                                rules={[{required: true, message: 'Please enter the message content'}]}
                            >
                                <Input placeholder="Message content"/>
                            </Form.Item>
                        </Form>
                    </>
                </Spin>
            </Modal>
            <Button icon={<EditOutlined />} onClick={show}></Button>
        </>
    );
}