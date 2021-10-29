import React from "react";
import {IconButton, SvgIcon} from "@material-ui/core";
import {Image as ImageIcon} from "react-feather";

const ImageModal: React.FC = () => {
    return (
        <>
            <IconButton
            >
                <SvgIcon fontSize="small">
                    <ImageIcon />
                </SvgIcon>
            </IconButton>
        </>
    )
}

export default ImageModal