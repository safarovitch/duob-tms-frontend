import React, {useEffect, useState} from "react";
import MainForm from "./RoadCreateView/MainForm";
import {useSnackbar} from "notistack";
import {Driver, Road, Truck} from "../../model/Road";
import roadService from "../../services/RoadService";
import errorMessageHandler from "../../utils/errorMessageHandler";
import LoadingLayout from "../../components/LoadingLayout";

const RoadMain: React.FC<{road: Road, updateRoad: Function}> = ({road, updateRoad}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [trucks, setTrucks] = useState<Truck[]>([])
    const [drivers, setDrivers] = useState<Driver[]>([])

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)

                const fetchTrucks: any = await roadService.getTrucks()
                const fetchDrivers: any = await roadService.getFilteredDrivers(1, 1000)

                setTrucks(fetchTrucks)
                setDrivers(fetchDrivers.content)
            } catch (error: any) {
                setHasError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        (trucks.length > 0 && drivers.length > 0 && road)
            ? <MainForm road={road} updateRoad={updateRoad} trucks={trucks} drivers={drivers} />
            : <LoadingLayout loading={loading} hasError={hasError} />
    )
}

export default RoadMain
