import {getDefaultFilter, IResourceComponentsProps} from "@pankod/refine-core";

import {
    List,
    Table,
    useTable,
    Space,
    EditButton,
    TagField, FilterDropdownProps, FilterDropdown, Input,
} from "@pankod/refine-antd";

import {IBadWord} from "interfaces";
import dayjs from "dayjs";
import React from "react";

export const BadWordList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, filters } = useTable<IBadWord>({
        syncWithLocation: true
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="term" title="Term"
                  filterDropdown={(props: FilterDropdownProps) => (
                      <FilterDropdown
                          {...props}
                      >
                          <Input placeholder="Enter the bad word"></Input>
                      </FilterDropdown>
                  )}

                  defaultFilteredValue={getDefaultFilter(
                      "term",
                      filters,
                      "eq",
                  )}
                />
                <Table.Column
                    title="Categories"
                    render={(value: IBadWord) => {
                        return value.categories.map((item: string) => {
                            return (
                                <TagField
                                    key={value.id + item }
                                    color="blue"
                                    value={item}
                                />
                            );
                        });
                    }}
                />
                <Table.Column dataIndex="createdAt" title="Created At" render={(_, record: IBadWord) => (dayjs(record?.createdAt).format('H:mm:ss MMM DD, YYYY'))}
                />
                <Table.Column<IBadWord>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <EditButton
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
