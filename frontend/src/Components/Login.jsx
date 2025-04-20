import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Email } from "@mui/icons-material";
import login from "../assets/fw1.jpg";
import { api } from "../../apiConfig";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    try {
      const response = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      toast.success("Login Successful", { position: "top-right" });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.admin.role);

      console.log("Login Success:", response.data);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed", {
        position: "top-right",
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${login})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay for better contrast
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 2,
          opacity: 0.9,
        }}
      >
        <Paper
          elevation={6}
          sx={{ p: 4, borderRadius: 3, color: "#045F85", fontWeight: "bold" }}
        >
          <Typography variant="h4" gutterBottom textAlign="center">
            FAIRWAY ENTERPRISES
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            textAlign="center"
            mb={3}
            sx={{
              fontWeight: "bold",
            }}
          >
            Admin Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              margin="normal"
              value={form.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              variant="outlined"
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                backgroundColor: "#045F85",
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
      <ToastContainer />
    </Box>
  );
};

export default Login;
