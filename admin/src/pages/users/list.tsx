import {IResourceComponentsProps, useMany, useNavigation, useResourceWithRoute} from "@pankod/refine-core";

import {
    List,
    Table,
    TextField,
    useTable,
    Space,
    ShowButton, Tag, TagField,
} from "@pankod/refine-antd";

import {IBrand, IUser} from "interfaces";
import dayjs from "dayjs";
import {Link} from "@pankod/refine-react-router-v6";
import {StopOutlined} from "@ant-design/icons";
import {Button} from "antd";
import React from "react";
import {ButtonUnbanUser} from "./button-unban-user";

export const UserList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IUser>();

    const { editUrl: generateEditUrl, list } = useNavigation();

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
                <Table.Column dataIndex="externalId" title="External ID" />
                <Table.Column dataIndex="displayName" title="Display Name" />
                <Table.Column dataIndex="online" title="Is Online"
                  render={(_, record: IUser) => (record.online ? 'Yes' : 'No')}
                />
                <Table.Column
                    title="Brand"
                    render={(record) => {
                        if (isLoading) {
                            return <TextField value="Loading..." />;
                        }

                        return (
                            <Link  to={generateEditUrl('brands', record.brandId)}>
                                <TagField
                                    value={
                                        brands?.data.find(
                                            (item) => record.brandId === item.id,
                                        )?.name
                                    }
                                />
                            </Link>
                        );
                    }}
                />
                <Table.Column dataIndex="isBanned" title="Is Banned"
                      render={(_, record: IUser) => (
                          <TagField color={record.isBanned ? 'red' : 'green'} value={record.isBanned ? 'Banned' : 'No'}/>
                      )}
                />
                <Table.Column dataIndex="createdAt" title="Created At"
                              render={(_, record: IUser) => (dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY'))}
                />
                <Table.Column<IUser>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: IUser) => (
                        <Space>
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            {
                                !record.isBanned &&
                                <Button
                                    danger
                                    icon={<StopOutlined  />}
                                    title={'Ban user'}
                                >
                                </Button>
                            }
                            {
                                record.isBanned && <ButtonUnbanUser onSuccess={() => window.location.reload()} record={record}/>

                            }
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
