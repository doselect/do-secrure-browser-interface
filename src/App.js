import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.scss';
import Configure from './components/Configure/Configure';
import Instruction from './components/Instruction';
import TestAccessUrlInput from './components/TestAccessUrlInput';
import { PAGE_ROUTE } from './util/constant';
import './util/ubaInitialiser';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <></>,
    },
    {
      path: PAGE_ROUTE.CONFIGURE,
      element: <Configure />,
    },
    {
      path: PAGE_ROUTE.INSTRUCTION,
      element: <Instruction />,
    },
    {
      path: PAGE_ROUTE.TEST_ROUTE,
      element: <TestAccessUrlInput />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
