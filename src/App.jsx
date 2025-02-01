import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import CreateCourse from "./pages/CreateCourse";
import { CoursesProvider } from "../src/lib/context/courses";
import { VideosProvider } from "../src/lib/context/Videos";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/courses",
        element: (
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        ),
      },
      {
        path: "/course/:id",
        element: (
          <ProtectedRoute>
            <Course />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-course",
        element: (
          <ProtectedRoute>
            <CreateCourse />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  return (
    <CoursesProvider>
      <VideosProvider>
        <RouterProvider router={router} />
      </VideosProvider>
    </CoursesProvider>
  );
};

export default App;

// <div className="App">
//   <h1 className="text-center text-2xl font-bold my-4">YouTube Video</h1>
//   <YouTubePlayer videoId="V0P3Opf-zUs" />
// </div>

// function App() {
//   return (
//     <div className="flex justify-center pt-28">
//       <iframe
//         src="https://www.youtube.com/embed/V0P3Opf-zUs?rel=0&title=0&controls=1"
//         className="w-3/6"
//         height="450"
//         title="Mission Impossible Tribute | Fallout | Rogue Nation | Ghost Protocol | MI:3"
//         frameBorder="0"
//         allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture; web-share"
//         referrerPolicy="strict-origin-when-cross-origin"
//         allowfullscreen
//       ></iframe>
//     </div>
//   );
// }
