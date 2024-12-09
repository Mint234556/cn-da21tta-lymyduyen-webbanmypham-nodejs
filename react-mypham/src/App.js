import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import "./App.css";

import GuardRoute from "./authentication/guardRoute";
// import Navbar from "./share-view/navbar";
import RouterView from "./web-view/router-view";

import UserRouter from "./user-view/router-user";
// import NavBarUser from "./user-view/components/navBarUser";
// import HeaderUser from "./user-view/components/headerUser";

import RouterAdmin from "./admin-view/router-admin";
import NavBarAdmin from "./admin-view/components/navBarAdmin";
// import HeaderAdmin from "./admin-view/components/headerAdmin";
import { Grid } from "@mui/material";
import Header from "./share-view/css/header";
import Navbar from "./share-view/css/navbar";

function App() {
  return (
    <div className="App">
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration={2000}
      >
        <Router>
          <Routes>
            <Route path="/*" element={<MainLayout />} />
            {/* <Route
              path="/admin/*"
              element={<GuardRoute element={AdminLayout} />}
            />{" "} */}
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/profile/*" element={<RouterUser />} />
            {/* <Route path="/admin/*" element={<RouterAdmin />} /> */}
          </Routes>
        </Router>{" "}
      </SnackbarProvider>
    </div>
  );
}
const MainLayout = () => (
  <>
    <Header />
    <Navbar />{" "}
    <Routes>
      <Route path="/*" element={<RouterView />} />
    </Routes>
    {/* <Footer /> */}
  </>
);
const RouterUser = () => (
  <>
    {/* <HeaderUser /> */}
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={3} md={2.5}>
        {/* <NavBarUser /> */}
      </Grid>
      <Grid item xs={9} md={9}>
        <Routes>
          <Route path="/*" element={<UserRouter />} />
        </Routes>
      </Grid>
    </Grid>
  </>
);

const AdminLayout = () => (
  <>
    {/* <HeaderAdmin /> */}
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={3} md={2.5}>
        <NavBarAdmin />
      </Grid>
      <Grid item xs={9} md={9}>
        <Routes>
          <Route path="/*" element={<RouterAdmin />} />
        </Routes>
      </Grid>
    </Grid>
  </>
);

export default App;
