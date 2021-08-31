import {Button} from "@material-ui/core";
import React from "react";

function CustomerProfile() {
    return (
        <div>
            Profile is works via {'customer.name'}

            <Button
                color="secondary"
                size="large"
                type="button"
                variant="contained"
            >
                Удалить
            </Button>
        </div>
    );
}

export default CustomerProfile;
