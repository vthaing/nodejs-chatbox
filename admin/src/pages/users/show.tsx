import {useShow, IResourceComponentsProps, useOne, useNavigation} from "@pankod/refine-core";

import {
    Show,
    Typography,
    MarkdownField,
    TagField,
    TextField,
    Col,
    List,
    Table,
    getDefaultSortOrder, DateField, useTable, Row
} from "@pankod/refine-antd";
import {IBrand, IUser, IUserBanRequest} from "../../interfaces";
import dayjs from "dayjs";
import {Link} from "@pankod/refine-react-router-v6";


const { Title, Text } = Typography;

export const UserShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IUser>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const { showUrl: generateShowUrl } = useNavigation();

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
        initialPageSize: 4,
        queryOptions: {
            enabled: record !== undefined,
        },
        syncWithLocation: false,
    });

    const { data: brandData, isLoading: brandIsLoading } =
        useOne<IBrand>({
            resource: "brands",
            id: record?.brandId || "",
            queryOptions: {
                enabled: !!record,
            },
        });

    return (
        <Show isLoading={isLoading} >
            <Row>
                <Col xl={12} xs={24}>

                    <Title level={5}>Id</Title>
                    <Text>{record?.id}</Text>
                    {
                        record?.brandId &&
                        <>
                            <Title level={5}>Brand</Title>
                            <Link  to={generateShowUrl('brands', record.brandId)}>
                                <TagField
                                    value={brandIsLoading ? 'Loading...' : brandData?.data.name}

                                />
                            </Link>
                        </>
                    }

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
                    <TagField color={record && (record.isBanned ? 'red' : 'green')} value={record && (record.isBanned ? 'Banned' : 'No')}></TagField>

                    <Title level={5}>Created At</Title>
                    <Text>{dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY')}</Text>
                </Col>


                <Col xl={12} xs={24}>
                    <List
                        title={"Banned History"}
                        breadcrumb={false}
                        headerProps={{
                            extra: <></>,
                        }}
                    >

                        <Table {...tableProps} rowKey="id">
                            <Table.Column
                                dataIndex={'reason'}
                                title={"Reason"}
                            />
                            <Table.Column
                                dataIndex={'typeLabel'}
                                title={"Type"}
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
                </Col>
            </Row>
        </Show>
    );
};
