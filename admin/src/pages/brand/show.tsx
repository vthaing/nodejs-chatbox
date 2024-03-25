import {useShow, IResourceComponentsProps, useMany} from "@pankod/refine-core";

import {Col, DateField, List, Row, Show, Table, TagField, TextField, Typography, useTable} from "@pankod/refine-antd";

import {IBrand, IBrandChannel, IBrandRoom, IUser, IUserBanRequest} from "../../interfaces";
import {Link} from "@pankod/refine-react-router-v6";

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


    const getChannelIds = (): string[] => {
        let result: string[] = [];
        roomTableProps?.dataSource?.map(function (brandRoom: IBrandRoom) {
            if (brandRoom.brandChannelId && !result.includes(brandRoom.brandChannelId)) {
                result.push(brandRoom.brandChannelId);
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

    return (
        <>
            <Row>
                <Col xl={7} xs={24}>
                    <Show isLoading={isLoading}>
                        <Title level={5}>Id</Title>
                        <Text>{record?.id}</Text>

                        <Title level={5}>Name</Title>
                        <Text>{record?.name}</Text>

                        <Title level={5}>Secret key</Title>
                        <Text>{record?.secretKey}</Text>
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
        </>
    );
};
