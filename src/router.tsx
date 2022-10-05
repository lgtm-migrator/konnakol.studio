import { createBrowserRouter } from "react-router-dom";
import Dojo from "./pages/Dojo/Dojo";
import Library from "./pages/Library/Library";

const router = createBrowserRouter([
  {
    path: "dojo/:compositionId",
    element: <Dojo />,
  },
  {
    path: "library",
    element: <Library />,
  },
]);

export default router;
