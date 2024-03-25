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
import dayjs from "dayjs";

export const UserList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IUser>();

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="username" title="Email" />
                <Table.Column dataIndex="email" title="Email" />
                <Table.Column dataIndex="online" title="Is Online"
                  render={(_, record: IUser) => (record.online ? 'Yes' : 'No')}
                />
                <Table.Column dataIndex="createdAt" title="Is Online"
                      render={(_, record: IUser) => (dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY'))}
                />
                <Table.Column<IUser>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            {/*<EditButton*/}
                            {/*    hideText*/}
                            {/*    size="small"*/}
                            {/*    recordItemId={record.id}*/}
                            {/*/>*/}
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
