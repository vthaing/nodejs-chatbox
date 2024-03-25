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

    const apiUrl = useApiUrl();
    const [open, setOpen] = useState(false);
    const { mutate, isLoading } = useCustomMutation();

    const handleFormSubmit = (values: any) => {
        mutate({
            url: `${apiUrl}/user/${record.id}/ban`,
            method: "patch",
            values: values,
        }, {
            onSuccess: onSuccess,
        });
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
                onClick={() => setOpen(true)}
            >
                Ban
            </Button>
            <Modal open={open}
               title={`Ban user ${record.displayName}`}
               footer={[
                   <Button key="back" onClick={() => setOpen(false)}>
                       Close
                   </Button>,
                   <Button key="submit" type="primary" loading={isLoading} onClick={onOk}>
                       Submit
                   </Button>,
               ]}
            >
                <Form form={form} onFinish={handleFormSubmit}>
                    <Form.Item label="Reason" name="reason">
                        <Input onChange={handleOnChange} />
                    </Form.Item>
                    <Form.Item label="Duration" name="duration">
                        <Input placeholder={'Empty is meaning ban forever'} onChange={handleOnChange} type={'number'} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}