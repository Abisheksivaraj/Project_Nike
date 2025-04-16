import React, { useState } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TableViewIcon from "@mui/icons-material/TableView";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const colorOptions = [
  { value: "#f44336", label: "Red" },
  { value: "#e91e63", label: "Pink" },
  { value: "#9c27b0", label: "Purple" },
  { value: "#673ab7", label: "Deep Purple" },
  { value: "#3f51b5", label: "Indigo" },
  { value: "#2196f3", label: "Blue" },
  { value: "#03a9f4", label: "Light Blue" },
  { value: "#00bcd4", label: "Cyan" },
  { value: "#009688", label: "Teal" },
  { value: "#4caf50", label: "Green" },
];

const AddEmployee = () => {
  const theme = useTheme();
  const [view, setView] = useState("table"); // 'table' or 'form'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    colorCode: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.colorCode) {
      alert("Please fill in all required fields");
      return;
    }

    if (editMode && editEmployeeId) {
      // Update existing employee
      const updatedEmployees = employees.map((employee) =>
        employee.id === editEmployeeId
          ? {
              ...employee,
              firstName: formData.firstName,
              lastName: formData.lastName,
              colorCode: formData.colorCode,
              imageSrc: previewImage || employee.imageSrc,
            }
          : employee
      );

      setEmployees(updatedEmployees);
      setEditMode(false);
      setEditEmployeeId(null);
    } else {
      // Create a new employee object with an ID
      const newEmployee = {
        id: Date.now(), // Simple unique ID generation
        firstName: formData.firstName,
        lastName: formData.lastName,
        colorCode: formData.colorCode,
        imageSrc: previewImage || "", // Store the image as base64 string
      };

      // Add to employees array
      setEmployees([...employees, newEmployee]);
    }

    // Switch to table view to show the newly added/edited employee
    setView("table");

    // Clear form after submission
    setFormData({
      firstName: "",
      lastName: "",
      colorCode: "",
      image: null,
    });
    setPreviewImage(null);
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  const handleEditEmployee = (employee) => {
    // Set form data with employee details
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      colorCode: employee.colorCode,
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

  const getColorLabel = (colorValue) => {
    const color = colorOptions.find((c) => c.value === colorValue);
    return color ? color.label : colorValue;
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      colorCode: "",
      image: null,
    });
    setPreviewImage(null);
    setEditMode(false);
    setEditEmployeeId(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 2,
          background: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PeopleAltIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h5" component="h1" fontWeight="500">
              Employee Management
            </Typography>
          </Box>

          <Box>
            {view === "table" ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={() => handleViewChange("form")}
                sx={{
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Add Employee
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<TableViewIcon />}
                onClick={() => {
                  handleViewChange("table");
                  resetForm();
                }}
                sx={{
                  borderRadius: 2,
                  px: 3,
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
              p: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              color: "white",
            }}
          >
            <Typography variant="h5" fontWeight="500">
              {editMode ? "Edit Employee" : "Add New Employee"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              {editMode
                ? "Update the employee information below"
                : "Fill in the details to add a new team member"}
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
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

                <Grid item xs={12} sx={{width:"10rem"}}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                  >
                    <InputLabel id="color-code-label">Color Code</InputLabel>
                    <Select
                      labelId="color-code-label"
                      id="colorCode"
                      name="colorCode"
                      value={formData.colorCode}
                      onChange={handleInputChange}
                      label="Color Code"
                    >
                      {colorOptions.map((color) => (
                        <MenuItem
                          key={color.value}
                          value={color.value}
                          sx={{
                            "&::before": {
                              content: '""',
                              display: "inline-block",
                              width: "20px",
                              height: "20px",
                              backgroundColor: color.value,
                              marginRight: "10px",
                              borderRadius: "3px",
                            },
                          }}
                        >
                          {color.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      border: "2px dashed",
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      borderRadius: 2,
                      
                      textAlign: "center",
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.05
                        ),
                      },
                    }}
                  >
                    <Button
                      variant="text"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{  }}
                    >
                      Upload Profile Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                    </Button>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      {previewImage ? (
                        <Avatar
                          src={previewImage}
                          alt="Employee Preview"
                          sx={{ width: 100, height: 100, boxShadow: 3 }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            color: theme.palette.primary.main,
                          }}
                        >
                          <Typography variant="body2" color="inherit">
                            No image
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
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
                      size="large"
                      sx={{ px: 4 }}
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
              p: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight="500">
                Employee Directory
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
                {employees.length}{" "}
                {employees.length === 1 ? "employee" : "employees"} total
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ p: 0 , height:"20.5rem"}}>
            {employees.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    mb: 3,
                  }}
                >
                  <PeopleAltIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  No employees yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
                >
                  Your employee list is empty. Add your first team member by
                  clicking the "Add Employee" button.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={() => handleViewChange("form")}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Add First Employee
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table aria-label="employee table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Profile</TableCell>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Color</TableCell>
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
                                src={employee.imageSrc || ""}
                                alt={`${employee.firstName} ${employee.lastName}`}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  boxShadow: employee.imageSrc ? 1 : 0,
                                  bgcolor: employee.imageSrc
                                    ? "transparent"
                                    : employee.colorCode,
                                }}
                              >
                                {!employee.imageSrc &&
                                  `${employee.firstName[0]}${employee.lastName[0]}`}
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {employee.firstName}
                              </Typography>
                            </TableCell>
                            <TableCell>{employee.lastName}</TableCell>
                            <TableCell>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: employee.colorCode,
                                    borderRadius: "3px",
                                    marginRight: 1,
                                    boxShadow: 1,
                                  }}
                                />
                                {getColorLabel(employee.colorCode)}
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
                                    mr: 1,
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
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={employees.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
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
