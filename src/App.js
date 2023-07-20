import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import Home from './pages/home';
import Menu from './pages/menu';
import Order from './pages/order';
import OrderList from './pages/orderlist';

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/menu", element: <Menu /> },
  { path: "/order", element: <Order /> },
  { path: "/orderlist", element: <OrderList /> },
])

function App() {
  return (
    <div className="App">
      <RouterProvider
        router={router}
      />
    </div>
  );
}

export default App;
