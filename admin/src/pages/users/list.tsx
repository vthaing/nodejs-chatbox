import { IResourceComponentsProps, useMany } from "@pankod/refine-core";

import {
    List,
    Table,
    TextField,
    useTable,
    Space,
    EditButton,
    ShowButton,
} from "@pankod/refine-antd";

import { IUser } from "interfaces";

export const UserList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IUser>();

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="online" title="Title" />
                <Table.Column dataIndex="username" title="Email" />
                <Table.Column dataIndex="email" title="Email" />
                <Table.Column<IUser>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
