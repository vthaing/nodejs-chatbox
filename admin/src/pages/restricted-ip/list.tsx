import { IResourceComponentsProps, useMany } from "@pankod/refine-core";

import {
    List,
    Table,
    TextField,
    useTable,
    Space,
    EditButton,
    ShowButton, TagField, DateField,
} from "@pankod/refine-antd";

import {IRestrictedIp, IUser} from "interfaces";
import dayjs from "dayjs";

export const RestrictedIpList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IRestrictedIp>();

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="ip" title="IP" />
                <Table.Column dataIndex="enabled" title="Enabled"
                  render={(_, record: IRestrictedIp) => (record.enabled ? 'Yes' : 'No')}
                />
                <Table.Column dataIndex="createdAt" title="Created At" render={(_, record: IRestrictedIp) => (dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY'))}
                />
                <Table.Column<IRestrictedIp>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <EditButton
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
