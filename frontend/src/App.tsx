import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./layout/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import NotFound from "./pages/404";
import { RecoilRoot } from "recoil";
import useAuth, { AuthProvider } from "./hooks/useAuth";
import PageLoader from "./components/shared/PageLoader";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import PublicRoute from "./routes/PublicRoute";
import ParkingLots from "./pages/dashboard/Slots";
import Vehicles from "./pages/dashboard/Vehicles";
import CheckIn from "./pages/dashboard/CheckIn";
import History from "./pages/dashboard/History";
import Reports from "./pages/dashboard/Report";

function AppRoutes() {
  const { user, initialLoading } = useAuth();

  const isAuthenticated = !!user;

  if (initialLoading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Home />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="slots" element={<ParkingLots />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="find-parking" element={<CheckIn />}/>
        <Route path="history" element={<History />}/>
         <Route path="reports" element={<Reports  />}/>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <RecoilRoot>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </RecoilRoot>
  );
}

export default App;
