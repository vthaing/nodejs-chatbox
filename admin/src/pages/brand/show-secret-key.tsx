import React, {useState} from "react";
import {IBrand, IBrandWithSecret} from "../../interfaces";
import {useShow} from "@pankod/refine-core";
import {Show, Typography} from "@pankod/refine-antd";
const { Text } = Typography;


type ShowSecretKeyProps = {
    brand: IBrand
}

export const ShowSecretKey: React.FC<ShowSecretKeyProps> = ({brand}) => {
    const { queryResult } = useShow<IBrandWithSecret>({
        resource: `brands/${brand.id}`,
        id: 'secret-key'
    });
    const { data, isLoading } = queryResult;


    return (
        <Show isLoading={isLoading} title={false} breadcrumb={false} headerButtons={[]} goBack={false}>
            <Text>{data?.data.secretKey}</Text>
        </Show>
    );
}