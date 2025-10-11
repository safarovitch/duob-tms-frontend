import React from "react";
import {TableCell, TableRow} from "@material-ui/core";
import {CargoInvoiceProjection} from "../../../model/Invoice";
import {CargoCustomCode, CargoProduct} from "../../../model/Cargo";

interface RowInvoiceInterface {
    row: CargoInvoiceProjection;
    index: number;
    cargoProducts: CargoProduct[];
    cargoCustomCodes: CargoCustomCode[];
}

const RowInvoice: React.FC<RowInvoiceInterface> = (props) => {
    let {row, index, cargoProducts, cargoCustomCodes} = props
    let productName = cargoProducts.find((item: CargoProduct) => item.id === row.productId)!.name;
    let cargoCustomCode = cargoCustomCodes.find((item: CargoCustomCode) => item.productDto!.id === row.productId)!

    return (
        <TableRow>
            <TableCell>{++index}</TableCell>
            <TableCell>{productName}</TableCell>
            <TableCell>{cargoCustomCode.code}</TableCell>
            <TableCell>{cargoCustomCode.price}</TableCell>
            <TableCell>{Number(cargoCustomCode.vat) + Number(cargoCustomCode.baseRate)}</TableCell>
            <TableCell>{cargoCustomCode.kgPerPlace}</TableCell>
            <TableCell>{row.quantity}</TableCell>
            <TableCell>{row.weight}</TableCell>
            <TableCell>{row.price}</TableCell>
            <TableCell>{row.totalPrice}</TableCell>
            <TableCell>{row.ccPrice}</TableCell>
        </TableRow>
    )
}

export default RowInvoice