import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        <Navbar />
        <Outlet />
      </main>
      <div className="text-center pb-6 mt-8">
        Made with 🔥 by Prabhu Kalyan Korivi
      </div>
    </div>
  );
};

export default AppLayout;
