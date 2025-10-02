import React from "react";
import {useParams} from "react-router";
import {Redirect} from "react-router-dom";

const RedirectToRoadMain: React.FC = () => {
    const {id} = useParams<{ id: string }>();

    return <Redirect to={`/app/roads/${id}/main`} />
}

export default RedirectToRoadMain;
