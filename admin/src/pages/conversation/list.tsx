import {getDefaultFilter, IResourceComponentsProps, useMany, useNavigation} from "@pankod/refine-core";

import {
    List,
    Table,
    TextField,
    useTable,
    Space,
    ShowButton, TagField, FilterDropdownProps, FilterDropdown, Select, useSelect, Input, EditButton,
} from "@pankod/refine-antd";

import {IConversation, IUser, IBrandRoom, IBrandChannel, IBrand} from "interfaces";
import dayjs from "dayjs";
import {Link} from "@pankod/refine-react-router-v6";
import React from "react";

export const ConversationList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, filters } = useTable<IConversation>({
        syncWithLocation: true,
    });

    const { editUrl: generateEditUrl } = useNavigation();

    const { selectProps: brandSelectProps } = useSelect<IBrand>({
        resource: "brands",
        optionLabel: "name",
        optionValue: "id",
        defaultValue: getDefaultFilter("brandId", filters, "in"),
    });

    const { selectProps: channelSelectProps } = useSelect<IBrandChannel>({
        resource: "brand-channels",
        optionLabel: "name",
        optionValue: "id",
        defaultValue: getDefaultFilter("brandChannelId", filters, "in"),
    });

    const { selectProps: roomSelectProps } = useSelect<IBrandChannel>({
        resource: "brand-rooms",
        optionLabel: "name",
        optionValue: "id",
        defaultValue: getDefaultFilter("brandRoomId", filters, "in"),
    });

    const getBrandIds = (): string[] => {
        let result: string[] = [];
        tableProps?.dataSource?.map(function (conversationItem: IConversation) {
            if (conversationItem && conversationItem.brandId && !result.includes(conversationItem.brandId)) {
                result.push(conversationItem.brandId);
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

    const getChannelIds = (): string[] => {
        let result: string[] = [];
        tableProps?.dataSource?.map(function (conversation: IConversation) {
            if (conversation.brandChannelId && !result.includes(conversation.brandChannelId)) {
                result.push(conversation.brandChannelId);
            }
        });

        return result;
    }
    const channelIds = getChannelIds();

    const { data: brandChannels, isLoading: isBrandChannelLoading } = useMany<IBrandChannel>({
        resource: "brand-channels",
        ids: channelIds,
        queryOptions: {
            enabled: channelIds.length > 0,
        },
    });


    const getRoomIds = (): string[] => {
        let result: string[] = [];
        tableProps?.dataSource?.map(function (conversation: IConversation) {
            if (conversation.brandRoomId && !result.includes(conversation.brandRoomId)) {
                result.push(conversation.brandRoomId);
            }
        });

        return result;
    }
    const roomIds = getRoomIds();

    const { data: brandRooms, isLoading: isBrandRoomLoading } = useMany<IBrandRoom>({
        resource: "brand-rooms",
        ids: roomIds,
        queryOptions: {
            enabled: roomIds.length > 0,
        },
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="name" title="Name"
                    filterDropdown={(props: FilterDropdownProps) => (
                      <FilterDropdown
                          {...props}
                      >
                          <Input placeholder="enter the conversation name"></Input>
                      </FilterDropdown>
                    )}
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
                <Table.Column
                    title="Channel"
                    dataIndex={"brandChannelId"}
                    render={(_, record: IConversation) => {
                        if (isBrandChannelLoading) {
                            return <TextField value="Loading..." />;
                        }

                        return (
                            <TagField
                                value={
                                    brandChannels?.data.find(
                                        (item) => record.brandChannelId === item.id,
                                    )?.name
                                }
                            />
                        );
                    }}

                    filterDropdown={(props: FilterDropdownProps) => (
                        <FilterDropdown
                            {...props}
                        >
                            <Select
                                style={{ minWidth: 200 }}
                                {...channelSelectProps}
                            />
                        </FilterDropdown>
                    )}
                    defaultFilteredValue={getDefaultFilter(
                        "brandChannelId",
                        filters,
                        "in",
                    )}
                />
                <Table.Column
                    title="Room"
                    dataIndex={"brandRoomId"}
                    render={(_, record: IConversation) => {
                        if (isBrandRoomLoading) {
                            return <TextField value="Loading..." />;
                        }

                        return (
                            <TagField
                                value={
                                    brandRooms?.data.find(
                                        (item) => record.brandRoomId === item.id,
                                    )?.name
                                }
                            />
                        );
                    }}

                    filterDropdown={(props: FilterDropdownProps) => (
                        <FilterDropdown
                            {...props}
                        >
                            <Select
                                style={{ minWidth: 200 }}
                                {...roomSelectProps}
                            />
                        </FilterDropdown>
                    )}
                    defaultFilteredValue={getDefaultFilter(
                        "brandRoomId",
                        filters,
                        "in",
                    )}
                />
                <Table.Column
                    dataIndex={"memberObjects"}
                    title="Members"
                    render={(value) => {
                        return value?.map((item: IUser) => {
                            return (
                                <TagField
                                    key={item.id}
                                    color="blue"
                                    value={item.displayName}
                                />
                            );
                        });
                    }}
                />
                <Table.Column dataIndex="createdAt" title="Created At" render={(_, record: IConversation) => (dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY'))}/>
                <Table.Column<IConversation>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
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
