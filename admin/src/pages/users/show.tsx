import {useShow, IResourceComponentsProps, useOne, useNavigation} from "@pankod/refine-core";

import {Show, Typography, MarkdownField, TagField, TextField, Col} from "@pankod/refine-antd";
import {IBrand, IUser} from "../../interfaces";
import dayjs from "dayjs";
import {Link} from "@pankod/refine-react-router-v6";


const { Title, Text } = Typography;

export const UserShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IUser>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    const { showUrl: generateShowUrl } = useNavigation();

    const { data: brandData, isLoading: brandIsLoading } =
        useOne<IBrand>({
            resource: "brands",
            id: record?.brandId || "",
            queryOptions: {
                enabled: !!record,
            },
        });

    return (
        <Show isLoading={isLoading}>

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
        </Show>
    );
};
