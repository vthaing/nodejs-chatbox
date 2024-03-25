import React from "react";
import {IUser, IUserIp} from "../../interfaces";
import {DateField, List, Table} from "@pankod/refine-antd";
import {ButtonAddToRestrictedIp} from "./button-add-to-restricted-ip";



type UserIpHistoryProps = {
    user: IUser,
}


export const UserIpHistory: React.FC<UserIpHistoryProps> = ({user}) => {

    return (
        <List breadcrumb={false} title={"User IP History"}>
            <Table dataSource={user.ipHistory} pagination={{
                defaultPageSize: 6
            }}>
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
                <Table.Column
                    title={'Actions'}
                    render={(_ ,userIp: IUserIp) => (
                        <ButtonAddToRestrictedIp ip={userIp.ip} user={user}/>
                    )}
                />
            </Table>
        </List>
    )
}