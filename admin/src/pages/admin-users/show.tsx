import {useShow, IResourceComponentsProps} from "@pankod/refine-core";

import {
    Show,
    Typography,
    TagField,
    Col,
    List,
    Table,
    DateField, useTable, Row
} from "@pankod/refine-antd";
import {IUser, IUserBanRequest} from "../../interfaces";
import dayjs from "dayjs";
import {ButtonBanAdminUser} from "./button-ban-admin-user";
import {ButtonUnbanAdminUser} from "./button-unban-admin-user";
import React from "react";


const { Title, Text } = Typography;

export const AdminUserShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IUser>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const { tableProps } = useTable<
        IUserBanRequest
    >({
        resource: "user-ban-requests",
        initialSorter: [
            {
                field: "createdAt",
                order: "desc",
            },
        ],
        permanentFilter: [
            {
                field: "userId",
                operator: "eq",
                value: record?.id,
            },
        ],
        initialPageSize: 6,
        queryOptions: {
            enabled: record !== undefined,
        },
        syncWithLocation: false,
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
        <Show isLoading={isLoading}
              headerButtons={({ defaultButtons }) => (
                  <>
                      {defaultButtons}
                      {
                          record?.isBanned &&
                          <ButtonUnbanAdminUser record={record} onSuccess={() => window.location.reload()}/>
                      }
                      {
                          record?.isBanned === false &&
                          <ButtonBanAdminUser record={record} onSuccess={() => window.location.reload()}/>
                      }
                  </>
              )}
        >
            <Row>
                <Col xl={12} xs={24}>

                    <Title level={5}>Id</Title>
                    <Text>{record?.id}</Text>

                    <Title level={5}>Display Name</Title>
                    <Text>{record?.displayName}</Text>
                    {
                        record?.username && <>
                            <Title level={5}>Username</Title>
                            <Text>{record?.username}</Text>
                        </>
                    }
                    {
                        record?.email && <>
                            <Title level={5}>Email</Title>
                            <Text>{record?.email}</Text>
                        </>
                    }
                    <Title level={5}>Is Online</Title>
                    <Text>{record && (record.online ? 'Yes' : 'No')}</Text>

                    <Title level={5}>Is Banned</Title>
                    {record && displayBannedStatus(record)}

                    <Title level={5}>Created At</Title>
                    <Text>{dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY')}</Text>
                </Col>


                <Col xl={12} xs={24}>
                    <Row>
                        <List
                            title={"Banned History"}
                            breadcrumb={false}
                            headerProps={{
                                extra: <></>,
                            }}
                        >

                            <Table {...tableProps} rowKey="id">
                                <Table.Column
                                    title={"Type"}
                                    render={(value) => {
                                        return value.isUnbanned ?
                                            <TagField color={'green'} value={value.typeLabel}/> :
                                            <TagField color={'red'} value={value.typeLabel}/>
                                    }}
                                />
                                <Table.Column
                                    dataIndex={'reason'}
                                    title={"Reason"}
                                />
                                <Table.Column
                                    key="duration"
                                    dataIndex={'duration'}
                                    title={"Duration (Days)"}
                                />

                                <Table.Column
                                    dataIndex="createdAt"
                                    title={'Time'}
                                    render={(value) => (
                                        <DateField value={value} format="LLL" />
                                    )}
                                />
                            </Table>
                        </List>
                    </Row>
                </Col>
            </Row>
        </Show>
    );
};
