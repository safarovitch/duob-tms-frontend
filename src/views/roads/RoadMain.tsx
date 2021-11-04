import React, {useEffect, useState} from "react";
import MainForm from "./RoadCreateView/MainForm";
import {useSnackbar} from "notistack";
import {Road, RoadTruck} from "../../model/Road";
import roadService from "../../services/RoadService";
import errorMessageHandler from "../../utils/errorMessageHandler";
import LoadingLayout from "../../components/LoadingLayout";

const RoadMain: React.FC<{road: Road, updateRoad: Function}> = ({road, updateRoad}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [trucks, setTrucks] = useState<RoadTruck[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const fetchTrucks: any = await roadService.getTrucks()

                !cancel && setTrucks(fetchTrucks)
            } catch (error: any) {
                !cancel && setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar])

    return (
        (trucks.length > 0 && road)
            ? <MainForm road={road} updateRoad={updateRoad} trucks={trucks} />
            : <LoadingLayout loading={loading} hasError={hasError} />
    )
}

export default RoadMain
