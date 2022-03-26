import React, {DispatchWithoutAction, useReducer, useState} from "react";
import useDebounce from "../hooks/useDebounce";
import moment from "moment";
import {OptionsObject, SnackbarKey, SnackbarMessage, useSnackbar} from "notistack";

type ReactChangeEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

export interface withTableFiltersInterface {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    handlePageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    size: number;
    handleRowsPerPageChange: (event: ReactChangeEvent) => void;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    debouncedSearchTerm: string;
    handleQueryChange: (event: ReactChangeEvent) => void;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    total: number;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    updateRows: number;
    setUpdateRows: DispatchWithoutAction;
    startDate: string;
    handleStartDateChange: (event: ReactChangeEvent) => void;
    endDate: string;
    handleEndDateChange: (event: ReactChangeEvent) => void;
    enqueueSnackbar: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey;
}

export function withTableFilters<T extends withTableFiltersInterface>(
    Component: React.ComponentType<T>,
    defaultSize: number = 20,
    defaultStartDate: number = 7
) {
    return (hocProps: Omit<T, keyof withTableFiltersInterface>) => {
        const [page, setPage] = useState<number>(1)
        const [size, setSize] = useState(defaultSize)
        const [query, setQuery] = useState('')
        const debouncedSearchTerm = useDebounce(query, 500)
        const [loading, setLoading] = useState<boolean>(false)
        const [total, setTotal] = useState<number>(0)
        const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0);
        const [startDate, setStartDate] = useState(moment().subtract(defaultStartDate, 'days').format('YYYY-MM-DD'))
        const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
        const {enqueueSnackbar} = useSnackbar()

        const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
            setPage(newPage + 1);
        };

        const handleRowsPerPageChange = (event: ReactChangeEvent) => {
            event.persist();
            setSize(Number(event.target.value));
            setPage(1);
        }

        const handleQueryChange = (event: ReactChangeEvent) => {
            event.persist()
            setQuery(event.target.value)
            setPage(1);
        }

        const handleStartDateChange = (event: ReactChangeEvent) => {
            event.persist()
            setStartDate(event.target.value)
            setPage(1)
        }

        const handleEndDateChange = (event: ReactChangeEvent) => {
            event.persist()
            setEndDate(event.target.value)
            setPage(1)
        }

        const props = {page, setPage, handlePageChange, size, handleRowsPerPageChange, query, debouncedSearchTerm,
            handleQueryChange, loading, setLoading, total, setTotal, updateRows, setUpdateRows, startDate,
            handleStartDateChange, endDate, handleEndDateChange, enqueueSnackbar};

        return (
            <Component
                {...hocProps as T}
                {...props}
            />
        )
    }
}
