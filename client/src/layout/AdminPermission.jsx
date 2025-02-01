import { useSelector } from "react-redux";
import { isAdmin } from "../utils/isAdmin";

const AdminPermission = ({ children }) => {
  const user = useSelector((state) => state.user);

  return isAdmin(user?.role) ? (
    <div className="p-5 rounded-md shadow-md bg-white">{children}</div>
  ) : (
    <div className="flex items-center justify-center h-full p-6 bg-red-100 rounded-md shadow-md">
      <p className="text-lg font-semibold text-red-600">
        🚫 Access Denied: You do not have permission to view this content.
      </p>
    </div>
  );
};

export default AdminPermission;
