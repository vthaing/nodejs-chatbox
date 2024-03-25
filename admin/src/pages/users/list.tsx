import {
    getDefaultFilter,
    IResourceComponentsProps,
    useMany,
    useNavigation,
    useResourceWithRoute
} from "@pankod/refine-core";

import {
    List,
    Table,
    TextField,
    useTable,
    Space,
    ShowButton, TagField, useSelect, FilterDropdownProps, FilterDropdown, Select,
} from "@pankod/refine-antd";

import {IBrand, IUser} from "interfaces";
import dayjs from "dayjs";
import {Link} from "@pankod/refine-react-router-v6";
import React from "react";
import {ButtonUnbanUser} from "./button-unban-user";
import {ButtonBanUser} from "./button-ban-user";

export const UserList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, filters } = useTable<IUser>({
        syncWithLocation: true,
    });

    const { editUrl: generateEditUrl } = useNavigation();


    const { selectProps: brandSelectProps } = useSelect<IBrand>({
        resource: "brands",
        optionLabel: "name",
        optionValue: "id",
        defaultValue: getDefaultFilter("brandId", filters, "in"),
    });

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
                <Table.Column dataIndex="id" title="ID"  />
                <Table.Column dataIndex="externalId" title="External ID" />
                <Table.Column dataIndex="displayName" title="Display Name" />
                <Table.Column dataIndex="online" title="Is Online"
                  render={(_, record: IUser) => (record.online ? 'Yes' : 'No')}
                />
                <Table.Column
                    title="Brand"
                    dataIndex={'brandId'}
                    render={(_, record: IUser) => {

                        if (isLoading) {
                            return <TextField value="Loading..." />;
                        }

                        return (
                            <>
                                {
                                    record?.brandId &&
                                    <Link  to={generateEditUrl('brands', record.brandId)}>
                                        <TagField
                                            value={
                                                brands?.data.find(
                                                    (item) => record.brandId === item.id,
                                                )?.name
                                            }
                                        />
                                    </Link>
                                }
                            </>
                        );
                    }}
                    filterDropdown={(props: FilterDropdownProps) => (
                        <FilterDropdown
                            {...props}
                        >
                            <Select
                                style={{ minWidth: 200 }}
                                {...brandSelectProps}
                            />
                        </FilterDropdown>
                    )}
                    defaultFilteredValue={getDefaultFilter(
                        "brandId",
                        filters,
                        "in",
                    )}
                />
                <Table.Column dataIndex="isBanned" title="Is Banned"
                      render={(_, record: IUser) => (
                          <TagField color={record.isBanned ? 'red' : 'green'} value={record.isBanned ? 'Banned' : 'No'}/>
                      )}
                />
                <Table.Column dataIndex="brandStatus" title="Status on brand"
                              render={(_, record: IUser) => (
                                  <TagField color={record.brandStatus ? 'green' : 'red'} value={record.brandStatus ? 'Enabled' : 'Disabled'}/>
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
                                <ButtonBanUser onSuccess={() => window.location.reload()} record={record}/>
                            }
                            {
                                record.isBanned &&
                                <ButtonUnbanUser onSuccess={() => window.location.reload()} record={record}/>
                            }
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
