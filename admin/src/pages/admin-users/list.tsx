import {
    getDefaultFilter,
    IResourceComponentsProps,
} from "@pankod/refine-core";

import {
    List,
    Table,
    useTable,
    Space,
    ShowButton, TagField, FilterDropdownProps, FilterDropdown, Input, EditButton,
} from "@pankod/refine-antd";

import {IUser} from "interfaces";
import dayjs from "dayjs";
import React from "react";
import {ButtonUnbanAdminUser} from "./button-unban-admin-user";
import {ButtonBanAdminUser} from "./button-ban-admin-user";

export const AdminUserList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, filters } = useTable<IUser>({
        syncWithLocation: true,
    });

    const displayBannedStatus = (user: IUser) => {
        if (!user.isBanned) {
            return <TagField color="green" value="No"/>
        }
        let text = '';
        if (user.bannedFrom) {
            text = 'From ' + dayjs(user.bannedFrom).format('H:mm:ss MMM DD, YYYY');
        }
        if (user.bannedTo) {
            text += ' To ' +  dayjs(user.bannedTo).format('H:mm:ss MMM DD, YYYY');
        } else {
            text += ' To: Until admin unban';
        }
        return <TagField color="red" value={text}/>
    }



    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID"  />
                <Table.Column dataIndex="displayName" title="Name"
                    filterDropdown={(props: FilterDropdownProps) => (
                      <FilterDropdown
                          {...props}
                      >
                          <Input placeholder="Enter the user name"/>
                      </FilterDropdown>
                    )}
                    defaultFilteredValue={getDefaultFilter(
                      "displayName",
                      filters,
                      "eq",
                    )}
                />
                <Table.Column dataIndex="email" title="Email"
                              filterDropdown={(props: FilterDropdownProps) => (
                                  <FilterDropdown
                                      {...props}
                                  >
                                      <Input placeholder="Enter the user email"/>
                                  </FilterDropdown>
                              )}
                              defaultFilteredValue={getDefaultFilter(
                                  "email",
                                  filters,
                                  "eq",
                              )}
                />
                <Table.Column dataIndex="isBanned" title="Is Banned"
                      render={(_, record: IUser) => (
                          displayBannedStatus(record)
                      )}
                      filterMultiple={false}
                      filters={[
                          {text: 'Banned', value: true},
                          {text: 'Not banned', value: false}
                      ]}
                      defaultFilteredValue={getDefaultFilter(
                          "isBanned",
                          filters,
                          "in",
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
                            <Space>
                                <EditButton
                                    hideText
                                    size="small"
                                    recordItemId={record.id}
                                />
                            </Space>
                            {
                                !record.isBanned &&
                                <ButtonBanAdminUser onSuccess={() => window.location.reload()} record={record}/>
                            }
                            {
                                record.isBanned &&
                                <ButtonUnbanAdminUser onSuccess={() => window.location.reload()} record={record}/>
                            }
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
