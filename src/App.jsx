import Sidebar from './Components/Sidebar';
import Layout from './Components/Layout';
import { Outlet } from 'react-router-dom';
import Login from './index';

function App() {
  const token = localStorage.getItem("token");

  return (
    token ? (
      <div className="flex h-screen">
        <div className="fixed top-0 left-0 h-full">
          <Sidebar />
        </div>
        <div className="ml-56 flex-1">
          <Layout>
            <Outlet />
          </Layout>
        </div>
      </div>
    ) : (
      <div>
        <Login />
      </div>
    )
  );
}

export default App;