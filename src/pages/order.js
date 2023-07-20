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
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '../components/theme';

import Axios from 'axios';
import { API_GET_MenuItems, API_GET_MenuCategories, API_GET_OrderNumber, API_GET_OrderType, API_POST_Order } from '../components/constants';

const Order = () => {

    const [menuItems, setMenuItems] = useState([])
    const [categories, setCategories] = useState([])
    const [orderNumber, setOrderNumber] = useState(0)

    const [newType, setNewType] = useState("")
    const [newPaymentStatus, setNewPaymentStatus] = useState("待付款")
    const [newOrderStatus, setNewOrderStatus] = useState("待出餐")
    const [newTotalPrice, setNewTotalPrice] = useState(0)

    const [orderTypes, setOrderTypes] = useState([])

    const [isLoding, setIsLoding] = useState(false)

    const [orderList, setOrderList] = useState([])

    const filterMenuItems = (type, menuItems) => {
        return menuItems.filter((val) => val.category_id === type)
    }

    const getMenuItems = () => {
        Axios.get(API_GET_MenuItems).then((res) => {
            setMenuItems(res.data)
        })
    }

    const getCategories = async () => {
        await Axios.get(API_GET_MenuCategories).then((res) => {
            setCategories(res.data)
        })
    }

    const getOrderNumber = async () => {
        await Axios.get(API_GET_OrderNumber).then((res) => {
            setOrderNumber(res.data.count + 1)
            console.log(orderNumber)
        })
    }

    const getOrderTypes = async () => {
        await Axios.get(API_GET_OrderType).then((res) => {
            setOrderTypes(res.data)
            if (res.data.length !== 0) {
                setNewType(res.data[0].type_name)
            }
            setIsLoding(true)
        })
    }

    const handleItem = (name, price) => {
        console.log(name, price)
        let index = -1
        orderList.forEach((val, key) => {
            if (val.name === name) {
                index = key
            }
        })

        if (index === -1) {
            setOrderList((pre) => {
                const newItem = { name: name, price: price, quantity: 1 }
                return [...pre, newItem]
            })
        } else {
            setOrderList(orderList.map(item => {
                if (item.name === name) {
                    return { ...item, quantity: item.quantity + 1 }
                }
                return item
            }))
        }
    }

    const deleteItem = (key) => {
        const updatedList = orderList.filter((order, index) => index !== key);
        setOrderList(updatedList)
        console.log(orderList)
    }

    const updateItem = (key, q) => {
        console.log(q)
        if (q <= 0) {
            deleteItem(key)
        } else {
            setOrderList(orderList.map((item, index) => {
                if (index === key) {
                    return { ...item, quantity: q }
                }
                return item
            }))
        }
    }

    useEffect(() => {
        getCategories()
        getMenuItems()
        getOrderNumber()
        getOrderTypes()
    }, [])

    useEffect(() => {
        let totalPrice = 0
        orderList.forEach((val, key) => {
            if (val.quantity > 0) {
                totalPrice += val.price * val.quantity
            }
        })
        setNewTotalPrice(totalPrice)
    }, [orderList])

    const renderOrderTable = () => {
        return (
            orderList.map((val, key) => (
                <TableRow
                    key={key}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                        {val.name}
                    </TableCell>
                    <TableCell align="left">{val.price}</TableCell>
                    <TableCell align="left">
                        <Input defaultValue={val.quantity} value={val.quantity} type="number" onChange={(event) => updateItem(key, event.target.value)} />
                    </TableCell>
                    <TableCell align="right">
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon onClick={() => deleteItem(key)} />
                        </IconButton>
                    </TableCell>
                </TableRow>
            )

            )
        )
    }

    const addOrder = () => {
        const items = []
        orderList.forEach(item => {
            items.push({
                name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
            })
        })
        Axios.post(API_POST_Order, {
            order_no: orderNumber,
            total_price: newTotalPrice,
            payment_status: newPaymentStatus,
            order_status: newOrderStatus,
            type: newType,
            items: items
        }).then((res) => {
            window.location.reload(false)
        })
    }

    return (
        <div>
            <Navs id="top" />
            <ThemeProvider theme={theme}>
                <div className="container content">
                    <h3 className="sub-title">Order</h3>
                    <hr className="margin-bottom" />
                    <div className="order-area">
                        <div className="order-left-area">
                            {
                                categories.map((val, key) => (
                                    <div>
                                        <h5>{val.name}</h5>
                                        <TableContainer key={key} component={Paper} className="margin-bottom">
                                            <Table sx={{ minWidth: 200 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableCell width="40%">Name</TableCell>
                                                    <TableCell width="10%" align="left">Unit Price</TableCell>
                                                </TableHead>
                                                <TableBody>
                                                    {filterMenuItems(val.name, menuItems).map((val, key) => (
                                                        <TableRow
                                                            key={key}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            onClick={() => handleItem(val.item_name, val.unit_price)}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                {val.item_name}
                                                            </TableCell>
                                                            <TableCell align="left">{val.unit_price}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="order-right-area">
                            <div className="top">
                                <h5>Order List</h5>
                                <div className="margin-bottom" />
                                {
                                    isLoding ?
                                        <div className="grid-container">

                                            {/* <div>Order Number : {orderNumber}</div> */}
                                            <TextField
                                                disabled
                                                fullWidth
                                                id="outlined-number"
                                                label="Order Number"
                                                value={orderNumber}
                                                type="text"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label" >Order Type</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Order Type"
                                                    value={newType}
                                                    onChange={(event) => setNewType(event.target.value)}
                                                >
                                                    {
                                                        orderTypes.map((val, key) => (
                                                            <MenuItem key={key} value={val.type_name}>{val.type_name}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div> : <div />
                                }
                                <div className="grid-container2">
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label" >Payment Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Order Type"
                                            value={newPaymentStatus}
                                            onChange={(event) => setNewPaymentStatus(event.target.value)}
                                        >
                                            <MenuItem value="待付款">待付款</MenuItem>
                                            <MenuItem value="已付款">已付款</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label" >Order Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Order Type"
                                            value={newOrderStatus}
                                            onChange={(event) => setNewOrderStatus(event.target.value)}
                                        >
                                            <MenuItem value="待出餐">待出餐</MenuItem>
                                            <MenuItem value="已出餐">已出餐</MenuItem>
                                            <MenuItem value="已完成">已完成</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="middle">
                                <TableContainer component={Paper} className="margin-bottom">
                                    <Table sx={{ minWidth: 200 }} aria-label="simple table">
                                        <TableHead>
                                            <TableCell width="30%">Name</TableCell>
                                            <TableCell width="25%" align="left">Unit Price</TableCell>
                                            <TableCell width="25%" align="left">Quantity</TableCell>
                                            <TableCell width="10%" align="right"></TableCell>
                                        </TableHead>
                                        <TableBody>
                                            {renderOrderTable()}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <div className="bottom">
                                <div style={{ alignSelf: "flex-start" }}>總金額： {newTotalPrice} 元</div>
                                <Button style={{ alignSelf: "flex-end" }} variant="primary" onClick={() => addOrder()}>Submit</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        </div>
    )
}

export default Order;