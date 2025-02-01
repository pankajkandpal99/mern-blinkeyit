import { Outlet } from "react-router-dom";
import UserMenu from "../components/UserMenu";

const Dashboard = () => {
  return (
    <section className="bg-white mx-auto">
      <div className="container mx-auto p-3 lg:px-8 lg:grid grid-cols-[200px,1fr]">
        {/* left for menu */}
        <div className="py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block broder border-r">
          <UserMenu />
        </div>

        {/* right for menu */}
        <div className="bg-white w-full lg:px-3 min-h-[70.5vh] lg:min-h-[73vh]">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
