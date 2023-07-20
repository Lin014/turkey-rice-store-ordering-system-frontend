import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';

import { Outlet, useMatch, useResolvedPath } from "react-router-dom"

export const Navs = () => {

    return (
        <div>
            <div style={{ width: "100%", position: "fixed", top: "0px", zIndex: "1" }}>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">Turkey Rice Store Ordering System</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll"/>
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                                <CustomLink href="/" className='nav-link-active'>Home</CustomLink>
                                <CustomLink href="/order" className='nav-link-active'>Order</CustomLink>
                                <CustomLink href="/orderlist" className='nav-link-active'>Order List</CustomLink>
                                <CustomLink href="/menu" className='nav-link-active'>Menu</CustomLink>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
            <Outlet />
        </div>

    )
}

const CustomLink = ({ href, children }) => {
    const resolvedPath = useResolvedPath(href)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <Nav.Link className={isActive ? "active" : ""} href={href}>{children}</Nav.Link>
    )
}