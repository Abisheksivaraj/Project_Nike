import * as React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PaletteIcon from "@mui/icons-material/Palette";
import WarningIcon from "@mui/icons-material/Warning";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CreateIcon from "@mui/icons-material/Create";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

// Pages
import Dashboard from "./Dashboard";
import AdminProcess from "./AdminProcess";
import IssueMaster from "./IssueMaster";
import AddEmployee from "./AddEmployee";
import ColorCodeMaster from "./ColorCodeMaster";

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const CustomAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#045F85", // Fairway Enterprises blue
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const CustomDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
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
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

function AdminPage() {
  const [open, setOpen] = React.useState(true);
  const [adminMasterOpen, setAdminMasterOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Profile menu state
  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  const profileMenuOpen = Boolean(profileAnchorEl);

  React.useEffect(() => {
    // Open admin master submenu if current route is under admin master
    if (location.pathname.includes("/master/")) {
      setAdminMasterOpen(true);
    }
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleAdminMasterClick = () => {
    setAdminMasterOpen(!adminMasterOpen);
  };

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...");
    handleProfileMenuClose();
    // You would typically redirect to login page or clear session
  };

  // Handle navigation with auto-close sidebar on mobile/tablet devices
  const handleNavigation = (path) => {
    navigate(path);

    // Auto close sidebar when item is selected (on smaller screens)
    if (window.innerWidth < 960) {
      setOpen(false);
    }
  };

  const navigationItems = [
    {
      path: "/dashboard",
      title: "Dashboard",
      icon: <DashboardIcon />,
      tooltip: "View Dashboard",
    },
    {
      title: "Admin Master",
      icon: <CreateIcon />,
      isSubmenu: true,
      tooltip: "Admin Configuration",
      children: [
        {
          path: "/master/issue-master",
          title: "Creating Defect Type",
          icon: <WarningIcon />,
          tooltip: "Manage Defect Types",
        },
        {
          path: "/master/color-code-master",
          title: "Color Code",
          icon: <PaletteIcon />,
          tooltip: "Configure Color Codes",
        },
        {
          path: "/master/employee-master",
          title: "Add Employee",
          icon: <AddBoxIcon />,
          tooltip: "Manage Employees",
        },
      ],
    },
    {
      path: "/admin-process",
      title: "Admin Process",
      icon: <VerifiedUserIcon />,
      tooltip: "Admin Process Management",
    },
  ];

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CustomAppBar position="fixed" open={open}>
        <Toolbar>
          <Tooltip title={open ? "Close Sidebar" : "Open Sidebar"}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Tooltip>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Fairway Enterprises
          </Typography>
          <Tooltip title="Profile">
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
              aria-controls={profileMenuOpen ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={profileMenuOpen ? "true" : undefined}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="profile-menu"
            anchorEl={profileAnchorEl}
            open={profileMenuOpen}
            onClose={handleProfileMenuClose}
            MenuListProps={{
              "aria-labelledby": "profile-button",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </CustomAppBar>
      <CustomDrawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              pb: 1,
              pt: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#045F85",
                fontWeight: "bold",
                display: open ? "block" : "none",
              }}
            >
              FAIRWAY
            </Typography>
          </Box>
        </DrawerHeader>
        <Divider />
        <List>
          {navigationItems.map((item) => {
            if (item.isSubmenu) {
              return (
                <React.Fragment key={item.title}>
                  <Tooltip
                    title={item.tooltip}
                    placement="right"
                    disableHoverListener={open}
                  >
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleAdminMasterClick}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                        {adminMasterOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                  <Collapse in={adminMasterOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <Tooltip
                          key={child.title}
                          title={child.tooltip}
                          placement="right"
                          disableHoverListener={open}
                        >
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => handleNavigation(child.path)}
                              sx={{ pl: 4 }}
                              selected={isCurrentPath(child.path)}
                            >
                              <ListItemIcon>{child.icon}</ListItemIcon>
                              <ListItemText primary={child.title} />
                            </ListItemButton>
                          </ListItem>
                        </Tooltip>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            } else {
              return (
                <Tooltip
                  key={item.title}
                  title={item.tooltip}
                  placement="right"
                  disableHoverListener={open}
                >
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      selected={isCurrentPath(item.path)}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.title} />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              );
            }
          })}
        </List>
      </CustomDrawer>
      <Main open={open}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/master/issue-master" element={<IssueMaster />} />
          <Route
            path="/master/color-code-master"
            element={<ColorCodeMaster />}
          />
          <Route path="/master/employee-master" element={<AddEmployee />} />
          <Route path="/admin-process" element={<AdminProcess />} />
        </Routes>
      </Main>
    </Box>
  );
}

export default AdminPage;
