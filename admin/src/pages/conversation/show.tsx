import { useShow, IResourceComponentsProps } from "@pankod/refine-core";

import {Col, DateField, List, Row, Show, Table, TagField, Typography, useTable} from "@pankod/refine-antd";

import {IConversation, IMessage, IUserBanRequest} from "../../interfaces";
import {ButtonCreatePinMessage} from "./button-create-pin-message";

const { Title, Text } = Typography;

export const ConversationShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IConversation>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const { tableProps } = useTable<
        IMessage
    >({
        resource: "message/conversation/" + record?.id,
        initialSorter: [
            {
                field: "createdAt",
                order: "desc",
            },
        ],
        permanentFilter: [
            {
                field: "isPinnedMessage",
                operator: "eq",
                value: true,
            },
        ],
        initialPageSize: 6,
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
                </Show>
            </Row>
            <Row>
                <List
                    title={"PIN Messages"}
                    breadcrumb={false}
                    headerButtons={() => (
                        <>
                            {
                                record?.id && <ButtonCreatePinMessage key={'button-create-pi-message'} conversationId={record.id}/>
                            }
                        </>
                    )}
                    headerProps={{
                        style: {
                            marginTop: "2em",
                        },
                    }}
                >

                    <Table {...tableProps} rowKey="id">
                        {/*<Table.Column*/}
                        {/*    dataIndex={'senderInfo'}*/}
                        {/*    title={"User"}*/}
                        {/*    render={(message) => (message?.senderInfo?.displayName)}*/}
                        {/*/>*/}
                        <Table.Column
                            dataIndex={'messageContent'}
                            title={"Message"}


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
        </>

    );
};
