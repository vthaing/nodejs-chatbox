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

import {IBrand, IUser} from "interfaces";
import dayjs from "dayjs";

export const UserList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IUser>();

    const getBrandIds = (): string[] => {
        let result: string[] = [];
        tableProps?.dataSource?.map(function (user: IUser) {
            if (user.brandId && !result.includes(user.brandId)) {
                result.push(user.brandId);
            }
        });

        return result;
    }
    const brandIds = getBrandIds();

    const { data: brands, isLoading } = useMany<IBrand>({
        resource: "brands",
        ids: brandIds,
        queryOptions: {
            enabled: brandIds.length > 0,
        },
    });


    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="displayName" title="Display Name" />
                <Table.Column dataIndex="online" title="Is Online"
                  render={(_, record: IUser) => (record.online ? 'Yes' : 'No')}
                />
                <Table.Column
                    title="Category"
                    render={(record) => {
                        if (isLoading) {
                            return <TextField value="Loading..." />;
                        }

                        console.log(brands);

                        return (
                            <TextField
                                value={
                                    brands?.data.find(
                                        (item) => record.brandId === item.id,
                                    )?.name
                                }
                            />
                        );
                    }}
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
