import {getDefaultFilter, IResourceComponentsProps, useMany} from "@pankod/refine-core";

import {
    List,
    Table,
    TextField,
    useTable,
    Space,
    EditButton,
    ShowButton, TagField, DateField, FilterDropdownProps, FilterDropdown, Input,
} from "@pankod/refine-antd";

import {IRestrictedIp, IUser} from "interfaces";
import dayjs from "dayjs";
import React from "react";

export const RestrictedIpList: React.FC<IResourceComponentsProps> = () => {
    const {tableProps, filters} = useTable<IRestrictedIp>({
        syncWithLocation: true
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID"/>
                <Table.Column dataIndex="ip" title="IP"
                              filterDropdown={(props: FilterDropdownProps) => (
                                  <FilterDropdown
                                      {...props}
                                  >
                                      <Input placeholder="Enter the IP"></Input>
                                  </FilterDropdown>
                              )}
                              defaultFilteredValue={getDefaultFilter(
                                  "ip",
                                  filters,
                                  "eq",
                              )}
                />
                <Table.Column dataIndex="enabled" title="Enabled"
                              render={(_, record: IRestrictedIp) => (record.enabled ?
                                      <TagField color="green" value="Yes"/> :
                                      <TagField color="red" value="No"/>
                              )}
                />
                <Table.Column dataIndex="notes" title="Notes"/>
                <Table.Column dataIndex="createdAt" title="Created At"
                              render={(_, record: IRestrictedIp) => (dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY'))}
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
