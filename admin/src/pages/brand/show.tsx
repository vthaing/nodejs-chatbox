import {useShow, IResourceComponentsProps, useMany} from "@pankod/refine-core";

import {
    Col,
    DateField, EditButton,
    List,
    Row,
    Show, ShowButton,
    Space,
    Table,
    TagField,
    TextField,
    Typography,
    useTable
} from "@pankod/refine-antd";

import {IBrand, IBrandChannel, IBrandRoom, IConversation} from "../../interfaces";
import React from "react";
import dayjs from "dayjs";
import {ButtonShowSecretKey} from "./button-view-secret-key";

const { Title, Text } = Typography;

export const BrandShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IBrand>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const { tableProps: channelTableProps } = useTable<
        IBrandChannel
    >({
        resource: "brand-channels",
        initialSorter: [
            {
                field: "createdAt",
                order: "desc",
            },
        ],
        permanentFilter: [
            {
                field: "brandId",
                operator: "eq",
                value: record?.id,
            },
        ],
        initialPageSize: 5,
        queryOptions: {
            enabled: record !== undefined,
        },
        syncWithLocation: false,
    });

    const { tableProps: roomTableProps } = useTable<
        IBrandRoom
    >({
        resource: "brand-rooms",
        initialSorter: [
            {
                field: "createdAt",
                order: "desc",
            },
        ],
        permanentFilter: [
            {
                field: "brandId",
                operator: "eq",
                value: record?.id,
            },
        ],
        initialPageSize: 5,
        queryOptions: {
            enabled: record !== undefined,
        },
        syncWithLocation: false,
    });

    const { tableProps: conversationTableProps } = useTable<
        IConversation
    >({
        resource: "conversations",
        initialSorter: [
            {
                field: "createdAt",
                order: "desc",
            },
        ],
        permanentFilter: [
            {
                field: "brandId",
                operator: "eq",
                value: record?.id,
            },
        ],
        initialPageSize: 10,
        queryOptions: {
            enabled: record !== undefined,
        },
        syncWithLocation: false,
    });


    const getChannelIds = (): string[] => {
        let result: string[] = [];
        roomTableProps?.dataSource?.map(function (brandRoom: IBrandRoom) {
            if (brandRoom.brandChannelId && !result.includes(brandRoom.brandChannelId)) {
                result.push(brandRoom.brandChannelId);
            }
        });
        conversationTableProps?.dataSource?.map(function (conversation: IConversation) {
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
        conversationTableProps?.dataSource?.map(function (conversation: IConversation) {
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
        <>
            <Row>
                <Col xl={7} xs={24}>
                    <Show isLoading={isLoading}>
                        <Title level={5}>Id</Title>
                        <Text>{record?.id}</Text>

                        <Title level={5}>Name</Title>
                        <Text>{record?.name}</Text>

                        {
                            record &&
                            <>
                                <Title level={5}>Secret key</Title>
                                <ButtonShowSecretKey brand={record}/>
                            </>
                        }

                        <Title level={5}>Enabled</Title>
                        <Text>{record && (record.enabled ? 'Yes' : 'No')}</Text>

                        <Title level={5}>Created At</Title>
                        <Text>{dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY')}</Text>
                    </Show>
                </Col>
                <Col xl={1}></Col>
                <Col xl={16} xs={24}>
                    <List
                        title={"Brand Channels"}
                        breadcrumb={false}
                        headerProps={{
                            extra: <></>,
                            style: {
                                marginTop: "2em",
                            },
                        }}
                    >

                        <Table {...channelTableProps} rowKey="id">
                            <Table.Column
                                key="id"
                                dataIndex={'id'}
                                title={"id"}
                            />
                            <Table.Column
                                key="name"
                                dataIndex={'name'}
                                title={"Name"}
                            />
                            <Table.Column
                                key="externalId"
                                dataIndex={'externalId'}
                                title={"External Id"}
                            />
                            <Table.Column
                                key="createdAt"
                                dataIndex="createdAt"
                                title={'Created At'}
                                render={(value) => (
                                    <DateField value={value} format="LLL" />
                                )}
                            />
                        </Table>
                    </List>
                </Col>
            </Row>
            <Row>
                <Col xl={24} xs={24}>
                    <List
                        title={"Brand Rooms"}
                        breadcrumb={false}
                        headerProps={{
                            extra: <></>,
                            style: {
                                marginTop: "2em",
                            },
                        }}

                    >
                        <Table {...roomTableProps} rowKey="id">
                            <Table.Column
                                key="id"
                                dataIndex={'name'}
                                title={"Name"}
                            />
                            <Table.Column
                                key="externalId"
                                dataIndex={'externalId'}
                                title={"External Id"}
                            />
                            <Table.Column
                                key="externalBrandChannelId"
                                dataIndex={'externalBrandChannelId'}
                                title={"External Channel Id"}
                            />
                            <Table.Column
                                title="Channel"
                                render={(record) => {
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
                            />
                            <Table.Column
                                key="createdAt"
                                dataIndex="createdAt"
                                title={'Created At'}
                                render={(value) => (
                                    <DateField value={value} format="LLL" />
                                )}
                            />
                        </Table>
                    </List>
                </Col>

            </Row>
            <Row>
                <Col xl={24} xs={24}>
                    <List
                        title={"Conversations"}
                        breadcrumb={false}
                        headerProps={{
                            extra: <></>,
                            style: {
                                marginTop: "2em",
                            },
                        }}

                    >
                        <Table {...conversationTableProps} rowKey="id">
                            <Table.Column
                                key="id"
                                dataIndex={'name'}
                                title={"Name"}
                            />
                            <Table.Column
                                title="Channel"
                                render={(record) => {
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
                            />
                            <Table.Column
                                title="Room"
                                render={(record) => {
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
                            />
                            <Table.Column
                                key="createdAt"
                                dataIndex="createdAt"
                                title={'Created At'}
                                render={(value) => (
                                    <DateField value={value} format="LLL" />
                                )}
                            />
                            <Table.Column<IConversation>
                                title="Actions"
                                dataIndex="actions"
                                render={(_, conversation) => (
                                    <Space>
                                        <EditButton
                                            hideText
                                            size="small"
                                            resourceNameOrRouteName={'conversations'}
                                            recordItemId={conversation.id}
                                        />
                                        <ShowButton
                                            hideText
                                            size="small"
                                            resourceNameOrRouteName={'conversations'}
                                            recordItemId={conversation.id}
                                        />
                                    </Space>
                                )}
                            />
                        </Table>
                    </List>
                </Col>

            </Row>
        </>
    );
};
