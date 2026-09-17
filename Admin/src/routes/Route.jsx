import { createBrowserRouter } from "react-router"
import Home from "../Features/home/UI/page/Home"


const route = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    }
])

export default route