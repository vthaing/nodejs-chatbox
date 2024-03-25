import {
    getDefaultFilter,
    IResourceComponentsProps,
} from "@pankod/refine-core";

import {
    List,
    Table,
    useTable,
    Space,
    ShowButton, TagField, FilterDropdownProps, FilterDropdown, Input,
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
                <Table.Column dataIndex="externalId" title="External ID"
                    filterDropdown={(props: FilterDropdownProps) => (
                      <FilterDropdown
                          {...props}
                      >
                          <Input placeholder="enter the user external id"/>
                      </FilterDropdown>
                    )}
                      defaultFilteredValue={getDefaultFilter(
                          "externalId",
                          filters,
                          "eq",
                      )}
                />
                <Table.Column dataIndex="displayName" title="Display Name"
                    filterDropdown={(props: FilterDropdownProps) => (
                      <FilterDropdown
                          {...props}
                      >
                          <Input placeholder="enter the user display name"/>
                      </FilterDropdown>
                    )}
                    defaultFilteredValue={getDefaultFilter(
                      "displayName",
                      filters,
                      "eq",
                    )}
                />
                <Table.Column dataIndex="online" title="Is Online"
                  render={(_, record: IUser) => (record.online ? 'Yes' : 'No')}
                     filters={[
                         {text: 'Yes', value: true},
                         {text: 'No', value: false}
                     ]}
                      filterMultiple={false}
                      defaultFilteredValue={getDefaultFilter(
                          "online",
                          filters,
                          "in",
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
                <Table.Column dataIndex="brandStatus" title="Status on brand"
                    render={(_, record: IUser) => (
                      <TagField color={record.brandStatus ? 'green' : 'red'} value={record.brandStatus ? 'Enabled' : 'Disabled'}/>
                    )}
                    filterMultiple={false}
                    filters={[
                      {text: 'Enabled', value: true},
                      {text: 'Disabled', value: false}
                    ]}
                    defaultFilteredValue={getDefaultFilter(
                      "brandStatus",
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
