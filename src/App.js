import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import "./App.css";
import Configure from "./components/Configure";
import Counter from "./components/Counter";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <h1>Hello World</h1>
          <Link to="about">About Us</Link>
        </div>
      ),
    },
    {
      path: "about",
      element: <div>About</div>,
    },
    {
      path: "configure",
      element: <Configure />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
