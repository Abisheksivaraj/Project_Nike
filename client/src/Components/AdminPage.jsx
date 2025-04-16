import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, styled } from "@mui/material/styles";
import { Routes, Route, Navigate } from "react-router-dom";

import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PaletteIcon from "@mui/icons-material/Palette";
import WarningIcon from "@mui/icons-material/Warning";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CreateIcon from "@mui/icons-material/Create";
import Dashboard from "./Dashboard";
import AdminProcess from "./AdminProcess";
import IssueMaster from "./IssueMaster";
import AddEmployee from "./AddEmployee";
import ColorCodeMaster from "./ColorCodeMAster";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      marginLeft: 0,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function AdminPage(props) {
  const { window } = props;
  const router = useDemoRouter("/dashboard");
  const demoWindow = window !== undefined ? window() : undefined;
  const [open, setOpen] = React.useState(true);

  return (
    <AppProvider
      navigation={[
        {
          segment: "dashboard",
          title: "Dashboard",
          icon: <LeaderboardIcon />,
        },
        {
          segment: "master",
          title: "Admin Master",
          icon: <CreateIcon />,
          children: [
            {
              segment: "issue-master",
              title: "Creating Defect Type",
              icon: <WarningIcon />,
            },
            {
              segment: "color-code-master",
              title: "Color Code",
              icon: <PaletteIcon />,
            },
            {
              segment: "employee-master",
              title: "Add Employee",
              icon: <AddBoxIcon />,
            },
          ],
        },
        {
          segment: "admin-process",
          title: "Admin Process",
          icon: <VerifiedUserIcon />,
        },
      ]}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <Main open={open}>
          <DrawerHeader />
          <Routes>
            {/* Add a redirect from root path to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/master/issue-master" element={<IssueMaster />} />
            <Route
              path="/master/color-code-master"
              element={<ColorCodeMaster />}
            />
            <Route path="/master/employee-master" element={<AddEmployee />} />
            <Route path="/admin-process" element={<AdminProcess />} />
            {/* Add a catch-all route to handle any undefined routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Main>
      </DashboardLayout>
    </AppProvider>
  );
}

AdminPage.propTypes = {
  window: PropTypes.func,
};

export default AdminPage;
