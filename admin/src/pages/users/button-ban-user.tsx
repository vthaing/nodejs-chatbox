import React, {useState} from "react";
import {IUser} from "../../interfaces";
import {Button, Popconfirm} from "antd";
import {CheckOutlined, StopOutlined} from "@ant-design/icons";
import {useApiUrl, useCustom, useCustomMutation, useUpdate} from "@pankod/refine-core";
import {Form, Input, Modal, useForm, useModal} from "@pankod/refine-antd";

type ButtonBanUserProps = {
    record: IUser
    onSuccess?: any
}

export const ButtonBanUser: React.FC<ButtonBanUserProps> = ({record, onSuccess}) => {

    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState({
        reason: '',
        duration: null
    });


    const { modalProps, show } = useModal();
    const handleFormSubmit = (values: any) => {
        alert('sdsdsd');
    }

    const handleOnChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const onOk = () => {
        form.submit();
    }

    return (
        <>
            <Button
                danger
                icon={<StopOutlined  />}
                title={'Ban user'}
                onClick={show}
            >
            </Button>
            <Modal {...modalProps} onOk={() => onOk()}
               title={`Ban user ${record.displayName}`}
            >
                <Form form={form} onFinish={handleFormSubmit}>
                    <Form.Item label="Reason" name="reason">
                        <Input onChange={handleOnChange} />
                    </Form.Item>
                    <Form.Item label="Duration" name="duration">
                        <Input onChange={handleOnChange} type={'number'} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}