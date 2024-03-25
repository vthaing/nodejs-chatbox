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

import {IBrand, ICategory, IUser} from "interfaces";
import dayjs from "dayjs";

export const BrandList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IBrand>();

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="name" title="Name" />
                
                <Table.Column dataIndex="createdAt" title="Created At" render={(_, record: IBrand) => (dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY'))}
                />
                <Table.Column<IBrand>
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
