import { useAuthStore } from "../store/authStore";

function Logout() {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout(); // Ensure we await logout if you expect it to be async
    // Optionally, navigate to the login page after logout
    // navigate("/login"); // Uncomment if you're using navigate
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 py-2 px-16 rounded-md text-white"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
