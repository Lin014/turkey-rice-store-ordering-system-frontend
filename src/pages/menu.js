import { useEffect, useState } from "react";
import { Navs } from "../components/nav";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';

import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form';
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
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '../components/theme';

import Axios from 'axios';
import { API_GET_MenuCategories, API_POST_MenuItems, API_GET_MenuItems, API_DELETE_MenuItems, API_UPDATE_MenuItems } from '../components/constants';

const filterMenuItems = (type, menuItems) => {
    return menuItems.filter((val) => val.category_id === type)
}

const Menu = () => {

    const [menuItems, setMenuItems] = useState([])
    const [categories, setCategories] = useState([])

    const [newItemName, setNewItemName] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [newUnitPrice, setNewUnitPrice] = useState("")
    const [newCategory, setNewCategory] = useState("")

    const [isLoding, setIsLoding] = useState(false)

    const getMenuItems = () => {
        Axios.get(API_GET_MenuItems).then((res) => {
            setMenuItems(res.data)
        })
    }

    const getCategories = async () => {
        await Axios.get(API_GET_MenuCategories).then((res) => {
            setCategories(res.data)
            if (res.data.length !== 0) {
                setNewCategory(res.data[0].name)
            }
            setIsLoding(true)
        })
    }

    const addMenuItem = () => {
        Axios.post(API_POST_MenuItems, {
            item_name: newItemName,
            description: newDescription,
            unit_price: newUnitPrice,
            category_id: newCategory
        }).then((res) => {
            window.location.reload(false)
        })
    }

    useEffect(() => {
        getCategories()
        getMenuItems()
    }, [])

    return (
        <div>
            <Navs id="top" />
            <ThemeProvider theme={theme}>
                <div className="container content">
                    <h3 className="sub-title">Menu</h3>
                    <hr className="margin-bottom" />
                    <h5>Add Menu Item</h5>

                    {
                        isLoding ?
                            <Form className="margin-bottom">
                                <div className="top-area">

                                    <TextField
                                        sx={{ minWidth: 130, width: 450 }}
                                        id="outlined-number"
                                        label="Menu Item Name"
                                        value={newItemName}
                                        type="text"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(event) => setNewItemName(event.target.value)}
                                    />
                                    <TextField
                                        sx={{ minWidth: 80, width: 200 }}
                                        id="outlined-number"
                                        label="Price"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(event) => setNewUnitPrice(event.target.value)}
                                    />
                                    <FormControl sx={{ minWidth: 100, width: 300 }} >
                                        <InputLabel id="demo-simple-select-label" >Category</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Category"
                                            value={newCategory}
                                            onChange={(event) => setNewCategory(event.target.value)}
                                        >
                                            {
                                                categories.map((val, key) => (
                                                    <MenuItem key={key} value={val.name}>{val.name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>

                                    <Button variant="primary" onClick={addMenuItem} style={{ marginLeft: "auto", marginRight: "0.5rem" }}>Submit</Button>
                                </div>
                                <div className="top-area">
                                    <TextField
                                        fullWidth
                                        id="outlined-number"
                                        label="Description"
                                        type="text"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(event) => setNewDescription(event.target.value)}
                                    />
                                </div>
                            </Form>
                            : <div></div>
                    }


                    <hr className="margin-bottom" />

                    <MenuTable menuItems={menuItems} />
                </div>
            </ThemeProvider>
        </div>

    )
}

const MenuTable = ({ menuItems }) => {

    const [categories, setCategories] = useState([])

    const [updateItemId, setUpdateItemId] = useState("")
    const [updateItemName, setUpdateItemName] = useState("")
    const [updateUnitPrice, setUpdateUnitPrice] = useState("")
    const [updateCategory, setUpdateCategory] = useState("")
    const [updateDescription, setUpdateDescription] = useState("")

    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)

    const updateMenuItems = (id) => {
        console.log(id)
        Axios.put(API_UPDATE_MenuItems, {
            id: id,
            item_name: updateItemName,
            description: updateDescription,
            unit_price: updateUnitPrice,
            category_id: updateCategory
        }).then((res) => {
            console.log(res)
            window.location.reload(false)
        })
    }

    const deleteMenuItem = (id) => {
        Axios.delete(`${API_DELETE_MenuItems}/${id}`).then((res) => {
            window.location.reload(false)
        })
    }

    useEffect(() => {
        const getCategories = async () => {
            await Axios.get(API_GET_MenuCategories).then((res) => {
                setCategories(res.data)
            })
        }
        getCategories()
    }, [])

    return (
        <div>
            {
                categories.map((val, key) => (
                    <div>
                        <h5>{val.name}</h5>
                        <TableContainer key={key} component={Paper} className="margin-bottom">
                            <Table sx={{ minWidth: 200 }} aria-label="simple table">
                                <TableHead>
                                    <TableCell width="40%">Name</TableCell>
                                    <TableCell width="10%" align="left">Unit Price</TableCell>
                                    <TableCell width="30%" align="left">Description</TableCell>
                                    <TableCell width="20%" align="left"></TableCell>
                                </TableHead>
                                <TableBody>
                                    {filterMenuItems(val.name, menuItems).map((val, key) => (
                                        <TableRow
                                            key={key}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {val.item_name}
                                            </TableCell>
                                            <TableCell align="left">{val.unit_price}</TableCell>
                                            <TableCell align="left">{val.description}</TableCell>
                                            <TableCell className="icon-table-cell" align="right">
                                                <IconButton edge="end" aria-label="edit" onClick={() => {
                                                    setUpdateItemId(val._id)
                                                    setUpdateItemName(val.item_name);
                                                    setUpdateUnitPrice(val.unit_price);
                                                    setUpdateDescription(val.description);
                                                    setUpdateCategory(val.category_id)
                                                    setUpdateDialogOpen(true);
                                                }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                                                    <DialogTitle>Edit Menu Item</DialogTitle>
                                                    <DialogContent>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="name"
                                                            label="Name"
                                                            type="text"
                                                            value={updateItemName}
                                                            defaultValue={val.item_name}
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setUpdateItemName(event.target.value)}
                                                            style={{marginBottom: "1rem"}}
                                                        />
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="name"
                                                            label="Unit Price"
                                                            type="number"
                                                            value={updateUnitPrice}
                                                            defaultValue={val.unit_price}
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setUpdateUnitPrice(event.target.value)}
                                                            style={{marginBottom: "2rem"}}
                                                        />
                                                        <FormControl sx={{ minWidth: 100, width: 300 }} style={{marginBottom: "1rem"}}>
                                                            <InputLabel id="demo-simple-select-label" >Category</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                label="Category"
                                                                value={updateCategory}
                                                                defaultValue={val.name}
                                                                onChange={(event) => setUpdateCategory(event.target.value)}
                                                            >
                                                                {
                                                                    categories.map((val, key) => (
                                                                        <MenuItem key={key} value={val.name}>{val.name}</MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            id="name"
                                                            label="Description"
                                                            type="text"
                                                            value={updateDescription}
                                                            defaultValue={val.description}
                                                            fullWidth
                                                            variant="standard"
                                                            onChange={(event) => setUpdateDescription(event.target.value)}
                                                            style={{marginBottom: "1rem"}}
                                                        />
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                                                        <Button onClick={() => updateMenuItems(updateItemId)}>Submit</Button>
                                                    </DialogActions>
                                                </Dialog>
                                                <IconButton edge="end" aria-label="delete" onClick={() => deleteMenuItem(val._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ))
            }
        </div>

    )

}

export default Menu;