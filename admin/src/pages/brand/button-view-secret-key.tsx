import React, {useState} from "react";
import {EyeOutlined} from "@ant-design/icons";
import {Modal, Button} from 'antd';
import {IBrand} from "../../interfaces";
import {ShowSecretKey} from "./show-secret-key";


type ButtonShowSecretKeyProps = {
    brand: IBrand
}

export const ButtonShowSecretKey: React.FC<ButtonShowSecretKeyProps> = ({brand}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)} icon={<EyeOutlined />}>View Secret key</Button>
            {
                open &&
                <Modal open={open}
                       title={`View Secret key ${brand.name}`}
                       footer={[
                           <Button key="back" onClick={() => setOpen(false)}>
                               Close
                           </Button>,
                       ]}
                >
                    <ShowSecretKey brand={brand}/>
                </Modal>
            }
        </>
    );
}