import React from "react";
import {TableCell, TableRow, TextField} from "@material-ui/core";
import {CargoInvoiceProjection} from "../../../model/Invoice";
import {CargoCustomCode, CargoProduct} from "../../../model/Cargo";
import {Autocomplete} from "@material-ui/lab";

interface RowInvoiceEditInterface {
    row: CargoInvoiceProjection;
    index: number;
    cargoProducts: CargoProduct[];
    cargoCustomCodes: CargoCustomCode[];
    handleRowCustomCode: Function;
    handleRowQuantity: Function;
    handleRowWeight: Function;
    updateLoading: boolean;
}

const RowInvoiceEdit: React.FC<RowInvoiceEditInterface> = (props) => {
    let {row, index, cargoProducts, cargoCustomCodes, handleRowCustomCode, handleRowQuantity, handleRowWeight, updateLoading} = props
    const cargoProduct = cargoProducts.find(item => item.id === row.productId)!
    const cargoCustomCode = cargoCustomCodes.find(item => item.id === row.customCodeId)!

    const handleQuantity = (value: number) => {
        if (isNaN(value)) return;

        handleRowQuantity(index, value)
    }

    const handleWeight = (value: number) => {
        if (isNaN(value)) return;

        handleRowWeight(index, value)
    }

    return (
        <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
                <Autocomplete
                    options={cargoProducts}
                    getOptionLabel={option => option.name}
                    getOptionSelected={(option, value) => option.name === value.name}
                    value={cargoProduct}
                    onChange={(e, value) => {
                        e.persist()
                        const newValue = value || cargoProduct;
                        const customCode = cargoCustomCodes.find(item => item.productDto!.id === newValue.id!)!

                        handleRowCustomCode(index, customCode)
                    }}
                    size="small"
                    style={{width: 230}}
                    disabled={updateLoading}
                    renderInput={params => (
                        <TextField
                            variant="outlined"
                            {...params}
                        />
                    )}
                />
            </TableCell>
            <TableCell>
                <Autocomplete
                    options={cargoCustomCodes.filter(item => item.productDto?.id === row.productId)}
                    getOptionLabel={option => option.code!}
                    getOptionSelected={(option, value) => option.code === value.code}
                    value={cargoCustomCode}
                    onChange={(e, value) => {
                        e.persist()
                        handleRowCustomCode(index, value || cargoCustomCode)
                    }}
                    size="small"
                    style={{width: 180}}
                    disabled={updateLoading}
                    renderInput={params => (
                        <TextField
                            variant="outlined"
                            {...params}
                        />
                    )}
                />
            </TableCell>
            <TableCell>{cargoCustomCode.price}</TableCell>
            <TableCell>{Number(cargoCustomCode.vat) + Number(cargoCustomCode.baseRate)}</TableCell>
            <TableCell>{cargoCustomCode.kgPerPlace}</TableCell>
            <TableCell>
                <TextField
                    size="small"
                    style={{width: 80}}
                    fullWidth
                    onChange={(e) => {
                        e.persist()
                        handleQuantity(Number(e.target.value))
                    }}
                    value={row.quantity}
                    variant="outlined"
                    disabled={updateLoading}
                />
            </TableCell>
            <TableCell>
                <TextField
                    size="small"
                    style={{width: 80}}
                    fullWidth
                    onChange={(e) => {
                        e.persist()
                        handleWeight(Number(e.target.value))
                    }}
                    value={row.weight}
                    variant="outlined"
                    disabled={updateLoading}
                />
            </TableCell>
            <TableCell>{row.price}</TableCell>
            <TableCell>{row.totalPrice}</TableCell>
            <TableCell>{row.ccPrice}</TableCell>
        </TableRow>
    )
}

export default RowInvoiceEdit