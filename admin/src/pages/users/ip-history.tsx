import React, {useEffect, useState} from "react";
import { IRestrictedIp, IUser, IUserIp} from "../../interfaces";
import {Checkbox, DateField, DeleteButton, EditButton, List, Table, TagField} from "@pankod/refine-antd";
import {ButtonAddToRestrictedIp} from "./button-add-to-restricted-ip";
import {useList, useMany} from "@pankod/refine-core";



type UserIpHistoryProps = {
    user: IUser,
}


export const UserIpHistory: React.FC<UserIpHistoryProps> = ({user}) => {

    const [showAllHistory, setShowAllHistory] = useState(true);
    const [ipDataSource, setIpDataSource] = useState<Array<IUserIp>>(user.ipHistory);

    useEffect(() => {
        if (showAllHistory) {
            setIpDataSource(user.ipHistory);
        } else {
            const existedList: string[] = [];
            const result = user.ipHistory.filter(element => {
                if (existedList.includes(element.ip)) {
                    return false;
                }
                existedList.push(element.ip);
                return true;
            });
            setIpDataSource(result);
        }

    }, [ipDataSource, showAllHistory]);

    const getRestrictedIpsText = (): string[] => {
        let result: string[] = [];
        user.ipHistory.map(userIp => {
            if (!result.includes(userIp.ip)) {
                result.push(userIp.ip);
            }
        })

        return result;
    }
    const restrictedIpsText = getRestrictedIpsText();

    const { data: restrictedIps, isLoading: isRestrictedIPLoading } = useList<IRestrictedIp>({
        resource: "restricted-ips",
        queryOptions: {
            enabled: restrictedIpsText.length > 0,
        },
        config: {
            hasPagination: false,
            filters: [
                {
                    field: 'ips',
                    operator:"in",
                    value: restrictedIpsText
                }
            ]
        }
    });



    return (
        <List
            breadcrumb={false} title={"User IP History"}
            headerButtons={() => (
                <>
                    <Checkbox defaultChecked={true} onChange={(e) => {
                        setShowAllHistory(e.target.checked);
                    }}>
                        Show Duplicated IPs
                    </Checkbox>
                </>
            )}
        >

            <Table
               loading={isRestrictedIPLoading && user.ipHistory.length > 0}
               dataSource={ipDataSource}
               pagination={{
                    defaultPageSize: 6
                }}
               rowKey={"time"}
            >
                <Table.Column
                    dataIndex={'ip'}
                    title={"IP"}
                    render={(_, value: IUserIp) => (<TagField value={value.ip}/>)}
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
                    render={(_ ,userIp: IUserIp) => {
                        const restrictedIp = restrictedIps?.data.find((item) => userIp.ip === item.ip);
                        if (restrictedIp) {
                            return  <>
                                {
                                    !restrictedIp.enabled && <TagField color={"warning"} value={"The restricted IP was disabled"}/>
                                }
                                <EditButton
                                    target={'_blank'}
                                    resourceNameOrRouteName={'restricted-ips'}
                                    recordItemId={restrictedIp.id}
                                >
                                    Edit IP
                                </EditButton>
                                <DeleteButton
                                    resourceNameOrRouteName={'restricted-ips'}
                                    recordItemId={restrictedIp.id}
                                    confirmOkText={"Allow to access"}
                                    onSuccess={() => window.location.reload()}
                                >
                                    Remove from restricted IPs
                                </DeleteButton>
                            </>
                        } else {
                            return <ButtonAddToRestrictedIp ip={userIp.ip} user={user}/>
                        }
                    }}
                />
            </Table>
        </List>
    )
}