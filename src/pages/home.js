import { useEffect, useState } from "react";
import { Navs } from "../components/nav";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.scss';

const Home = () => {

    return (
        <div>
            <Navs id="top"/>
            <div className="container" style={{ textAlign: "center"}}>
                <img alt="home background" style={{ marginTop: "70px"}} width="80%" height="80%" src={require('../images/chicken-rice.jpg')} />
            </div>
        </div>
    )
}

export default Home;