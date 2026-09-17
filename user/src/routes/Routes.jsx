import { createBrowserRouter } from "react-router"
import Login from "../Features/login/UI/page/Login"
import Buzz from "../Features/login/UI/page/Buzz"


const route = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/user",
        element: <Buzz />
    }
])

export default route