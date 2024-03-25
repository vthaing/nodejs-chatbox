import { useShow, IResourceComponentsProps } from "@pankod/refine-core";

import { Show, Typography } from "@pankod/refine-antd";

import { IConversation } from "../../interfaces";

const { Title, Text } = Typography;

export const ConversationShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IConversation>();
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
