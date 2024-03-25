import React, {useState} from "react";
import {IUser} from "../../interfaces";
import {Button} from "antd";
import {StopOutlined} from "@ant-design/icons";
import {useApiUrl, useCustomMutation} from "@pankod/refine-core";
import {Form, Input, InputNumber, Modal} from "@pankod/refine-antd";

type ButtonBanAdminUserProps = {
    record: IUser
    onSuccess?: any
}

export const ButtonBanAdminUser: React.FC<ButtonBanAdminUserProps> = ({record, onSuccess}) => {

    const [form] = Form.useForm();

    const apiUrl = useApiUrl();
    const [open, setOpen] = useState(false);
    const { mutate, isLoading } = useCustomMutation();

    const handleFormSubmit = (values: any) => {
        mutate({
            url: `${apiUrl}/admin-user/${record.id}/ban`,
            method: "patch",
            values: values,
        }, {
            onSuccess: onSuccess,
        });
    }

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
                        <Input />
                    </Form.Item>
                    <Form.Item help={'Empty is meaning Ban forever'} label="Duration" name="duration" rules={[{type: "number", min: 1}]}>
                        <InputNumber />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}