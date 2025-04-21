import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
  AppBar,
  Chip,
  Badge,
  Stack,
  useTheme,
  alpha,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TableViewIcon from "@mui/icons-material/TableView";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import RefreshIcon from "@mui/icons-material/Refresh";
import { api } from "../../apiConfig";
import defaultImg from "../assets/default.png";

// At the top of your component, add this import and media query hook:
import { useMediaQuery } from '@mui/material';




const AddEmployee = () => {
  const theme = useTheme();
  const [view, setView] = useState("table"); 
  const matchesXS = useMediaQuery(theme.breakpoints.down("sm"));// 'table' or 'form'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    hexCode: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for color options from API
  const [colorOptions, setColorOptions] = useState([]);
  const [colorsLoading, setColorsLoading] = useState(false);
  const [colorsError, setColorsError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch employees and colors when component mounts
  useEffect(() => {
    fetchEmployees();
    fetchColors();
  }, []);

  // Fetch colors from your API endpoint
  const fetchColors = async () => {
    try {
      setColorsLoading(true);
      setColorsError(null);

      // Call the API endpoint to get colors
      const response = await api.get("/get-Color");

      // Transform the API response to the required format
      const formattedColors = response.data.map((color) => ({
        value: color.hexCode,
        label: color.colorName,
        id: color._id,
      }));

      if (formattedColors && formattedColors.length > 0) {
        setColorOptions(formattedColors);
      } else {
        console.warn("API returned empty color list");
        setColorOptions([]);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
      setColorsError("Failed to load color options.");
      setColorOptions([]);
    } finally {
      setColorsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/getEmployee");

      // Transform the data from API format to component format
      const formattedEmployees = response.data.data.map((emp) => ({
        id: emp._id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        colorCode: emp.colorCode,
        imageSrc: emp.image || defaultImg, // Use default image if no image provided
      }));

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Convert default image to base64 when needed
  const getDefaultImageBase64 = async () => {
    try {
      // Create a new Image object
      const img = new Image();
      img.src = defaultImg;

      // Wait for the image to load
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Draw the image on a canvas and convert to base64
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Return as base64 string
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error converting default image to base64:", error);
      return ""; // Return empty string if there's an error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.hexCode) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Get the color name from the selected hex code
      const selectedColor = colorOptions.find(
        (c) => c.value === formData.hexCode
      );
      const colorName = selectedColor ? selectedColor.label : "";

      // Create data object to send
      const employeeData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        colorCode: formData.hexCode,
        colorName: colorName, // Add the colorName field
      };

      // If there's an image, convert it to base64
      if (formData.image) {
        employeeData.image = await fileToBase64(formData.image);
      } else {
        // Use default image if no image provided
        employeeData.image = await getDefaultImageBase64();
      }

      if (editMode && editEmployeeId) {
        // Update existing employee
        await api.put(`/updateEmployee/${editEmployeeId}`, employeeData);

        // Update local state
        const updatedEmployees = employees.map((employee) =>
          employee.id === editEmployeeId
            ? {
                ...employee,
                firstName: formData.firstName,
                lastName: formData.lastName,
                colorCode: formData.hexCode,
                imageSrc: previewImage || defaultImg, // Use default image if no preview
              }
            : employee
        );

        setEmployees(updatedEmployees);
        setEditMode(false);
        setEditEmployeeId(null);
      } else {
        // Create a new employee via API
        const response = await api.post("/addEmployee", employeeData);

        // Add returned employee (with DB-generated ID) to state
        const newEmployee = {
          id: response.data.data._id || response.data.data.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          colorCode: formData.hexCode,
          imageSrc: previewImage || defaultImg, // Use default image if no preview
        };

        // Add to employees array
        setEmployees([...employees, newEmployee]);
      }

      // Switch to table view to show the newly added/edited employee
      setView("table");

      // Clear form after submission
      resetForm();
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee data. Please try again.");
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      // Call the API to delete the employee
      await api.delete(`/deleteEmployee/${id}`);

      // Update local state only after successful API call
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

  const handleEditEmployee = (employee) => {
    // Set form data with employee details
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      hexCode: employee.colorCode,
      image: null, // We can't directly set the file object
    });

    // Set preview image
    setPreviewImage(employee.imageSrc);

    // Enable edit mode
    setEditMode(true);
    setEditEmployeeId(employee.id);

    // Switch to form view
    setView("form");
  };

  // Helper function to get color label from value
  const getColorLabel = (colorValue) => {
    const color = colorOptions.find((c) => c.value === colorValue);
    return color ? color.label : colorValue;
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      hexCode: "",
      image: null,
    });
    setPreviewImage(null);
    setEditMode(false);
    setEditEmployeeId(null);
  };

return (
  <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        mb: { xs: 2, sm: 4 },
        borderRadius: 2,
        background: alpha(theme.palette.primary.main, 0.05),
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          p: { xs: 1.5, sm: 2 },
          gap: { xs: 1.5, sm: 0 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PeopleAltIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
          <Typography variant="h6" component="h1" fontWeight="500">
            Employee Management
          </Typography>
        </Box>

        <Box width={{ xs: "100%", sm: "auto" }}>
          {view === "table" ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth={matchesXS}
              startIcon={<PersonAddIcon />}
              onClick={() => handleViewChange("form")}
              sx={{
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                backgroundColor: "#045F85",
              }}
            >
              Add Employee
            </Button>
          ) : (
            <Button
              variant="outlined"
              fullWidth={matchesXS}
              startIcon={<TableViewIcon />}
              onClick={() => {
                handleViewChange("table");
                resetForm();
              }}
              sx={{
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                backgroundColor: "#045F85",
                color: "white",
              }}
            >
              Employee Table
            </Button>
          )}
        </Box>
      </Box>
    </AppBar>

    {view === "form" ? (
      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            background: "#045F85",
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight="500">
            {editMode ? "Edit Employee" : "Add New Employee"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            {editMode
              ? "Update the employee information below"
              : "Fill in the details to add a new team member"}
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  variant="outlined"
                >
                  <InputLabel id="hex-code-label">Color Code</InputLabel>
                  <Select
                    labelId="hex-code-label"
                    id="hexCode"
                    name="hexCode"
                    value={formData.hexCode}
                    onChange={handleInputChange}
                    label="Color Code"
                    disabled={colorsLoading}
                    renderValue={(selected) => {
                      const selectedColor = colorOptions.find(
                        (c) => c.value === selected
                      );

                      return (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            component="span"
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: 1,
                              bgcolor: selected,
                              mr: 1,
                              border: "1px solid rgba(0,0,0,0.1)",
                            }}
                          />
                          {selectedColor
                            ? `${selectedColor.label} (${selected})`
                            : selected}
                        </Box>
                      );
                    }}
                  >
                    {colorsLoading ? (
                      <MenuItem value="">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Loading colors...
                        </Box>
                      </MenuItem>
                    ) : colorOptions.length === 0 ? (
                      <MenuItem value="" disabled>
                        No colors available
                      </MenuItem>
                    ) : (
                      colorOptions.map((color) => (
                        <MenuItem
                          key={color.id}
                          value={color.value}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              backgroundColor: color.value,
                              borderRadius: "3px",
                              marginRight: 1,
                              border: "1px solid rgba(0,0,0,0.1)",
                              display: "inline-block",
                            }}
                          />
                          {color.label} ({color.value})
                        </MenuItem>
                      ))
                    )}
                  </Select>

                  {/* Color information and refresh button */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {colorsLoading
                        ? "Loading colors..."
                        : `${colorOptions.length} colors available`}
                    </Typography>
                    <Tooltip title="Refresh Colors">
                      <IconButton
                        size="small"
                        onClick={fetchColors}
                        disabled={colorsLoading}
                      >
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {colorsError && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {colorsError}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ mt: 1 }}>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    borderRadius: 2,
                    textAlign: "center",
                    backgroundColor: alpha(theme.palette.primary.main, 0.03),
                    padding: { xs: 2, sm: 3 },
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <Button
                    variant="text"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 1.5 }}
                  >
                    Upload Profile Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </Button>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mb: 1.5 }}
                  >
                    Default image will be used if none is provided
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {previewImage ? (
                      <Avatar
                        src={previewImage}
                        alt="Employee Preview"
                        sx={{ width: 80, height: 80, boxShadow: 2 }}
                      />
                    ) : (
                      <Avatar
                        src={defaultImg}
                        alt="Default Employee Image"
                        sx={{ width: 80, height: 80, boxShadow: 2 }}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent={{ xs: "center", sm: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    fullWidth={matchesXS}
                    onClick={() => {
                      resetForm();
                      if (editMode) {
                        setView("table");
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth={matchesXS}
                    size="large"
                    sx={{ px: { xs: 2, sm: 4 }, backgroundColor: "#045F85" }}
                  >
                    {editMode ? "Update Employee" : "Add Employee"}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    ) : (
      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            background: "#045F85",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="500">
              Employee Directory
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
              {employees.length}{" "}
              {employees.length === 1 ? "employee" : "employees"} total
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchEmployees} sx={{ color: "white" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <CardContent sx={{ p: 0, minHeight: { xs: "15rem", sm: "20.5rem" } }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: "15rem", sm: "20.5rem" },
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: { xs: 3, sm: 5 } }}>
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchEmployees}
                sx={{ mt: 2 }}
              >
                Try Again
              </Button>
            </Box>
          ) : employees.length === 0 ? (
            <Box sx={{ textAlign: "center", py: { xs: 3, sm: 5 } }}>
              <Box
                sx={{
                  width: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  borderRadius: "50%",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  mb: { xs: 2, sm: 3 },
                }}
              >
                <PeopleAltIcon
                  color="primary"
                  sx={{ fontSize: { xs: 30, sm: 40 } }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                No employees yet
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: { xs: 2, sm: 3 },
                  maxWidth: 400,
                  mx: "auto",
                  px: 2,
                }}
              >
                Your employee list is empty. Add your first team member by
                clicking the "Add Employee" button.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={() => handleViewChange("form")}
                sx={{ borderRadius: 2, px: 3, backgroundColor: "#045F85" }}
              >
                Add First Employee
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ overflowX: "auto" }}>
                <Table
                  aria-label="employee table"
                  size={matchesXS ? "small" : "medium"}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Profile</TableCell>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        Color
                      </TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((employee) => (
                        <TableRow
                          key={employee.id}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            <Avatar
                              src={employee.imageSrc || defaultImg}
                              alt={`${employee.firstName} ${employee.lastName}`}
                              sx={{
                                width: { xs: 32, sm: 40 },
                                height: { xs: 32, sm: 40 },
                                boxShadow: 1,
                                bgcolor: employee.colorCode,
                              }}
                            >
                              {!employee.imageSrc &&
                                `${employee.firstName[0]}${employee.lastName[0]}`}
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant={matchesXS ? "body2" : "body1"}
                              fontWeight="500"
                            >
                              {employee.firstName}
                            </Typography>
                          </TableCell>
                          <TableCell>{employee.lastName}</TableCell>
                          <TableCell
                            sx={{ display: { xs: "none", md: "table-cell" } }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  backgroundColor: employee.colorCode,
                                  borderRadius: "3px",
                                  marginRight: 1,
                                  boxShadow: 1,
                                  border: "1px solid rgba(0,0,0,0.1)",
                                }}
                              />
                              {getColorLabel(employee.colorCode)} (
                              {employee.colorCode})
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit">
                              <IconButton
                                aria-label="edit"
                                onClick={() => handleEditEmployee(employee)}
                                color="primary"
                                size="small"
                                sx={{
                                  mr: { xs: 0.5, sm: 1 },
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                  "&:hover": {
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.2
                                    ),
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  handleDeleteEmployee(employee.id)
                                }
                                color="error"
                                size="small"
                                sx={{
                                  backgroundColor: alpha(
                                    theme.palette.error.main,
                                    0.1
                                  ),
                                  "&:hover": {
                                    backgroundColor: alpha(
                                      theme.palette.error.main,
                                      0.2
                                    ),
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={employees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                    {
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    },
                  ".MuiTablePagination-select": {
                    paddingRight: { xs: "0.5rem", sm: "1rem" },
                  },
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    )}
  </Container>
);
};

export default AddEmployee;
