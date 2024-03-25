import { useShow, IResourceComponentsProps } from "@pankod/refine-core";

import { Show, Typography } from "@pankod/refine-antd";

import { IChannel } from "../../interfaces";

const { Title, Text } = Typography;

export const ChannelShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IChannel>();
    const { data, isLoading } = queryResult;
    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Id</Title>
            <Text>{record?.id}</Text>

            <Title level={5}>Name</Title>
            <Text>{record?.name}</Text>

            <Title level={5}>Category</Title>
        </Show>
    );
};
