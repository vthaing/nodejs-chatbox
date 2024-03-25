import React, {useState} from "react";
import {IUser} from "../../interfaces";
import {Button} from "antd";
import {StopOutlined} from "@ant-design/icons";
import {UpdatePasswordFormTypes, useApiUrl, useCustomMutation} from "@pankod/refine-core";
import {Form, Input, InputNumber, Modal} from "@pankod/refine-antd";

type ButtonChangePasswordProps = {
    record: IUser
    onSuccess?: any
}

export const ButtonChangePassword: React.FC<ButtonChangePasswordProps> = ({record, onSuccess}) => {

    const [form] = Form.useForm();

    const apiUrl = useApiUrl();
    const [open, setOpen] = useState(false);
    const { mutate, isLoading } = useCustomMutation();

    const handleFormSubmit = (values: any) => {
        mutate({
            url: `${apiUrl}/admin-user/${record.id}/update-password`,
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
                title={'Change password of admin user ' + record.displayName}
                onClick={() => setOpen(true)}
            >
                Change Password
            </Button>
            <Modal open={open}
               title={`Change admin user password ${record.displayName}`}
               footer={[
                   <Button key="back" onClick={() => setOpen(false)}>
                       Close
                   </Button>,
                   <Button key="submit" type="primary" loading={isLoading} onClick={onOk}>
                       Change Password
                   </Button>,
               ]}
            >
                <Form<UpdatePasswordFormTypes>
                    layout="vertical"
                    form={form}
                    onFinish={handleFormSubmit}
                    requiredMark={false}
                >
                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[{ required: true }]}
                        style={{ marginBottom: "12px" }}
                    >
                        <Input
                            type="password"
                            placeholder="●●●●●●●●"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        hasFeedback
                        dependencies={["newPassword"]}
                        rules={[
                            {
                                required: true,
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("newPassword") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            'Password do not match'
                                        ),
                                    );
                                },
                            }),
                        ]}
                        style={{ marginBottom: "12px" }}
                    >
                        <Input
                            type="password"
                            placeholder="●●●●●●●●"
                            size="large"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}