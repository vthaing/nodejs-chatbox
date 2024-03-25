import React from "react";
import {IUser} from "../../interfaces";
import {DateField, List, Table} from "@pankod/refine-antd";



type UserIpHistoryProps = {
    user: IUser,
}


export const UserIpHistory: React.FC<UserIpHistoryProps> = ({user}) => {

    return (
        <List breadcrumb={false} title={"User IP History"}>
            <Table dataSource={user.ipHistory}>
                <Table.Column
                    dataIndex={'ip'}
                    title={"IP"}
                />

                <Table.Column
                    dataIndex="time"
                    title={'Time'}
                    render={(value) => (
                        <DateField value={value} format="LLL" />
                    )}
                />
            </Table>
        </List>
    )
}