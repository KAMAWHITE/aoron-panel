import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./index";
import TeamMembers from "./Components/Team";
import Category from "./Components/Category";
import Discount from "./Components/Discount";
import Size from "./Components/Size";
import Color from "./Components/Color";
import Faq from "./Components/Faq";
import Contact from "./Components/Contact";
import New from "./Components/New";

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Category />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "team",
                element: <TeamMembers />,
            },
            {
                path: "category",
                element: <Category />,
            },
            {
                path: "discount",
                element: <Discount />,
            },
            {
                path: "sizes",
                element: <Size />,
            },
            {
                path: "colors",
                element: <Color />,
            },
            {
                path: "faq",
                element: <Faq />,
            },
            {
                path: "contact",
                element: <Contact />,
            },
            {
                path: "news",
                element: <New />,
            },
        ],
    },
]);