import { useEffect, useState } from "react";
import { Navs } from "../components/nav";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';

import Button from "react-bootstrap/Button";
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Collapse from '@mui/material/Collapse';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarBorder from '@mui/icons-material/StarBorder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '../components/theme';

import Axios from 'axios';
import { API_GET_Order, API_GET_OrderItem, API_UPDATE_Order } from '../components/constants';


const OrderList = () => {

    const [orders, setOrders] = useState([])
    const [orderItems, setOrderItems] = useState([])

    const getOrders = () => {
        Axios.get(API_GET_Order).then((res) => {
            setOrders(res.data)
        })
    }

    const getOrderItems = () => {
        Axios.get(API_GET_OrderItem).then((res) => {
            setOrderItems(res.data)
        })
    }

    const filterItems = (orderID, orderItems) => {
        const items = []

        orderItems.forEach((val) => {
            if (val.order_id === orderID) {
                items.push(val)
            }
        })
        
        return items
    }

    useEffect(() => {
        getOrders()
        getOrderItems()
    }, [])

    return (
        <div>
            <Navs id="top" />
            <ThemeProvider theme={theme}>
                <div className="container content">
                    <h3 className="sub-title">Order List</h3>
                    <hr className="margin-bottom" />
                    <div>
                        <Table sx={{ minWidth: 200 }} aria-label="simple table">
                            <TableHead>
                                <TableCell width="15%" component="th" scope="row">Order Date</TableCell>
                                <TableCell width="10%" scope="row">Order Number</TableCell>
                                <TableCell width="10%" align="left">Order Type</TableCell>
                                <TableCell width="15%" align="left">Total Price</TableCell>
                                <TableCell width="20%" align="left">Payment Status</TableCell>
                                <TableCell width="20%" align="left">Order Status</TableCell>
                                <TableCell width="10%" align="right"></TableCell>
                            </TableHead>
                        </Table>
                        {
                            orders.map((val, key) =>
                                <OrderTable
                                    key={key}
                                    order={val}
                                    orderLists={filterItems(val._id, orderItems)}
                                />
                            )
                        }
                    </div>
                </div>
            </ThemeProvider>
        </div>
    )

}

const OrderTable = ({ order, orderLists }) => {
    const [open, setOpen] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status)
    const [orderStatus, setOrdeStatus] = useState(order.order_status)

    const updateOrder = (id, payment_status, order_status) => {
        Axios.put(API_UPDATE_Order, {
            id: id,
            payment_status: payment_status,
            order_status: order_status
        })
    }

    return (
        <TableContainer component={Paper} className="margin-bottom">
            <Table sx={{ minWidth: 200 }} aria-label="simple table">
                <TableBody>
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell width="15%" component="th" scope="row">{order.order_date}</TableCell>
                        <TableCell width="10%" scope="row">{order.order_no}</TableCell>
                        <TableCell width="10%" align="left">{order.type}</TableCell>
                        <TableCell width="15%" align="left">{order.total_price} 元</TableCell>
                        <TableCell width="20%" align="left">
                            <FormControl fullWidth>
                                <Select
                                    defaultValue={paymentStatus}
                                    value={paymentStatus}
                                    onChange={(event) => { setPaymentStatus(event.target.value); updateOrder(order._id, event.target.value, orderStatus) }}
                                >
                                    <MenuItem value="待付款">待付款</MenuItem>
                                    <MenuItem value="已付款">已付款</MenuItem>
                                </Select>
                            </FormControl>
                        </TableCell>
                        <TableCell width="20%" align="left">
                            <FormControl fullWidth>
                                <Select
                                    defaultValue={orderStatus}
                                    value={orderStatus}
                                    onChange={(event) => { setOrdeStatus(event.target.value); updateOrder(order._id, paymentStatus, event.target.value) }}
                                >
                                    <MenuItem value="待出餐">待出餐</MenuItem>
                                    <MenuItem value="已出餐">已出餐</MenuItem>
                                    <MenuItem value="已完成">已完成</MenuItem>
                                </Select>
                            </FormControl>
                        </TableCell>
                        <TableCell width="10%" align="right" style={{ cursor: "pointer" }} onClick={() => setOpen(!open)}>{open ? <ExpandLess /> : <ExpandMore />}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <hr />
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Table sx={{ minWidth: 200 }} aria-label="simple table">
                    <TableHead>
                        <TableCell width="10%"></TableCell>
                        <TableCell width="30%" style={{ fontSize: "0.8rem" }}>Name</TableCell>
                        <TableCell width="20%" align="left" style={{ fontSize: "0.8rem" }}>Quantity</TableCell>
                        <TableCell width="20%" align="left" style={{ fontSize: "0.8rem" }}>Unit Price</TableCell>
                    </TableHead>

                    <TableBody>
                        {
                            orderLists.map((val, key) =>
                                <TableRow
                                    key={key}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell width="10%" component="th" scope="row"></TableCell>
                                    <TableCell width="30%" scope="row" style={{ fontSize: "0.8rem" }}>{val.name}</TableCell>
                                    <TableCell width="30%" align="left" style={{ fontSize: "0.8rem" }}>{val.quantity}</TableCell>
                                    <TableCell width="30%" align="left" style={{ fontSize: "0.8rem" }}>{val.unit_price}</TableCell>
                                </TableRow>
                            )
                        }

                    </TableBody>
                </Table>
            </Collapse>
        </TableContainer>
    )
}

export default OrderList;