import Login from '@/pages/login';
import Notes from '@/pages/notes';
import Signup from '@/pages/signup';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: '/',
    element: <Notes />
  },
  {
    path: '/notes/:id',
    element: <Notes />
  }
]);