import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Backdrop,
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
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userData, setUserData] = useState(null);

  // Effect to handle navigation after minimum loader display time
  useEffect(() => {
    let timer;
    if (loginSuccess && userData) {
      timer = setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // 5 seconds minimum loading time
    }
    return () => clearTimeout(timer);
  }, [loginSuccess, userData, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);

    setIsLoading(true); // Start loading

    try {
      const response = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      toast.success("Login Successful", { position: "top-right" });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.admin.role);

      console.log("Login Success:", response.data);

      // Store user data and set login success
      setUserData(response.data);
      setLoginSuccess(true);

      // The useEffect will handle navigation after the minimum display time
    } catch (error) {
      setIsLoading(false); // Stop loading on error
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
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            color: "#045F85",
            fontWeight: "bold",
            width: "100%",
            maxWidth: { xs: "100%", sm: "100%" },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            FAIRWAY ENTERPRISES
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            textAlign="center"
            mb={3}
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.875rem", sm: "1rem" },
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
              sx={{ mb: { xs: 1, sm: 2 } }}
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
              sx={{ mb: { xs: 1, sm: 2 } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: { xs: 2, sm: 3 },
                py: 1.5,
                fontWeight: "bold",
                backgroundColor: "#045F85",
                "&:hover": {
                  backgroundColor: "#034661",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              ) : null}
              Login
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Full page loader with company name that displays for at least 5 seconds */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
          backgroundColor: "rgba(4, 95, 133, 0.9)", // Brand color with opacity
        }}
        open={isLoading || loginSuccess}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "2rem" },
              letterSpacing: "0.05em",
            }}
          >
            FAIRWAY ENTERPRISES
          </Typography>
          <CircularProgress
            color="inherit"
            size={60}
            thickness={4}
            sx={{ mb: 3 }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {loginSuccess
              ? "Welcome! Preparing your dashboard..."
              : "Authenticating..."}
          </Typography>

          {loginSuccess && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Redirecting in a moment...
              </Typography>
            </Box>
          )}
        </Box>
      </Backdrop>

      <ToastContainer />
    </Box>
  );
};

export default Login;
