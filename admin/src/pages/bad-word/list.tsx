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

import {IBadWord, IUser} from "interfaces";
import dayjs from "dayjs";

export const BadWordList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IBadWord>();

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="term" title="Term" />
                <Table.Column
                    title="Categories"
                    render={(value: IBadWord) => {
                        return value.categories.map((item: string) => {
                            return (
                                <TagField
                                    key={value.id + item }
                                    color="blue"
                                    value={item}
                                />
                            );
                        });
                    }}
                />
                <Table.Column dataIndex="createdAt" title="Created At" render={(_, record: IBadWord) => (dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY'))}
                />
                <Table.Column<IBadWord>
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
