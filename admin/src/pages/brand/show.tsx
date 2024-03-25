import { useShow, IResourceComponentsProps } from "@pankod/refine-core";

import {Col, DateField, List, Row, Show, Table, Typography, useTable} from "@pankod/refine-antd";

import {IBrand, IBrandChannel, IUserBanRequest} from "../../interfaces";

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
        IBrandChannel
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

    return (
        <>
            <Row>
                <Show isLoading={isLoading}>
                    <Title level={5}>Id</Title>
                    <Text>{record?.id}</Text>

                    <Title level={5}>Name</Title>
                    <Text>{record?.name}</Text>

                    <Title level={5}>Secret key</Title>
                    <Text>{record?.secretKey}</Text>
                </Show>
            </Row>
            <Row>
                <Col xl={8} xs={24}>
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
                <Col xl={1}></Col>

                <Col xl={14} xs={24}>
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
