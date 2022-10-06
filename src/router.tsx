import { createBrowserRouter } from "react-router-dom";
import Dojo from "./pages/Dojo/Dojo";
import Editor from './pages/Editor/Editor';
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
  {
    path: "editor/:compositionId",
    element: <Editor />,
  },
]);

export default router;
