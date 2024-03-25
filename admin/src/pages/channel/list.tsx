import { IResourceComponentsProps, useMany } from "@pankod/refine-core";

import {
    List,
    Table,
    TextField,
    useTable,
    Space,
    EditButton,
    ShowButton,
} from "@pankod/refine-antd";

import { IChannel, ICategory } from "interfaces";

export const ChannelList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IChannel>();

    // const categoryIds =
    //     tableProps?.dataSource?.map((item) => item.category.id) ?? [];
    // const { data, isLoading } = useMany<ICategory>({
    //     resource: "categories",
    //     ids: categoryIds,
    //     queryOptions: {
    //         enabled: categoryIds.length > 0,
    //     },
    // });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="name" title="Name" />
                {/*<Table.Column*/}
                {/*    dataIndex={["category", "id"]}*/}
                {/*    title="Category"*/}
                {/*    render={(value) => {*/}
                {/*        if (isLoading) {*/}
                {/*            return <TextField value="Loading..." />;*/}
                {/*        }*/}

                {/*        return (*/}
                {/*            <TextField*/}
                {/*                value={*/}
                {/*                    data?.data.find((item) => item.id === value)*/}
                {/*                        ?.title*/}
                {/*                }*/}
                {/*            />*/}
                {/*        );*/}
                {/*    }}*/}
                {/*/>*/}
                <Table.Column<IChannel>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
