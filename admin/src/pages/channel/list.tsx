import { IResourceComponentsProps, useMany } from "@pankod/refine-core";

import {
    List,
    Table,
    TextField,
    useTable,
    Space,
    EditButton,
    ShowButton, TagField,
} from "@pankod/refine-antd";

import {IChannel, ICategory, IUser} from "interfaces";
import dayjs from "dayjs";

export const ChannelList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IChannel>();

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="name" title="Name" />
                <Table.Column
                    dataIndex={"memberObjects"}
                    title="Members"
                    render={(value) => {
                        return value.map((item: IUser) => {
                            return (
                                <TagField
                                    key={item.id}
                                    color="blue"
                                    value={item.username}
                                />
                            );
                        });
                    }}
                />
                <Table.Column dataIndex="createdAt" title="Created At" render={(_, record: IChannel) => (dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY'))}
                />
                <Table.Column<IChannel>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            {/*<ShowButton*/}
                            {/*    hideText*/}
                            {/*    size="small"*/}
                            {/*    recordItemId={record.id}*/}
                            {/*/>*/}
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
