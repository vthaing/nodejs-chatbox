import { useShow, IResourceComponentsProps } from "@pankod/refine-core";

import { Show, Typography } from "@pankod/refine-antd";

import { IBrand } from "../../interfaces";

const { Title, Text } = Typography;

export const BrandShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IBrand>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Id</Title>
            <Text>{record?.id}</Text>

            <Title level={5}>Name</Title>
            <Text>{record?.name}</Text>

            <Title level={5}>Secret key</Title>
            <Text>{record?.secretKey}</Text>
        </Show>
    );
};
