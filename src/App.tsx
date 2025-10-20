import React, { useState } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  CssBaseline,
  IconButton,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import axios from "axios";

//linkedin search params
//https://www.linkedin.com/jobs/search/?currentJobId=3967518280&geoId=106204383&keywords=react&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&refresh=true&start=100&trk=d_flagship3_company
const roles = [
  "Full Stack Developer",
  "Frontend Developer",
  "React Developer",
  "UI Developer",
  "UI/UX Developer",
];

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: { default: "#f0f4ff", paper: "#ffffff" },
            text: { primary: "#000", secondary: "#555" },
          }
        : {
            background: { default: "#121212", paper: "#1e1e1e" },
            text: { primary: "#fff", secondary: "#ccc" },
          }),
    },
  });

  const [form, setForm] = useState({
    sender: "mbbasith456@gmail.com",
    receiver: "",
    name: "",
    role: "Full Stack Developer",
  });

  const [mailContent, setMailContent] = useState({
    title: "",
    description: "",
  });
  const [noteContent, setNotContent] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "name"
        ? value.replace(/\b\w/g, (char) => char.toUpperCase())
        : value;
    setForm({ ...form, [name]: formattedValue });
  };

  const handleGenerate = () => {
    if (!form.role || !form.name) {
      alert("Please fill out all fields before generating mail.");
      return;
    }
    const title = `Application for ${form.role} Position`;
    const description = `
Hi ${form.name},

I hope you’re doing well. I came across your company’s recent job openings and was excited to see opportunities for a ${form.role}.

I’m a Full Stack Developer with 3 years of experience in building scalable, high-performance web applications using React.js, Node.js, Express.js, and AWS. In my current role at Sony India Software Center (via Ignitarium), I’ve optimized Next.js applications, integrated AWS services, and improved deployment pipelines by 40%.

I’m confident my skills in microservices, cloud infrastructure, and frontend optimization could bring value to your team.
Please find my resume attached for your review.

Best regards,
Mohamed Basith
📩 mbbasith456@gmail.com
    `;
    const note = `Hi ${form.name}, I’m a Full Stack Developer (3 yrs) skilled in React, Node, Express & AWS. Excited your company is looking for a ${form.role} role. Resume:https://tinyurl.com/2u7vmtsr`;
    setMailContent({ title, description });
    setNotContent(note);
  };

  const handleSend = async () => {
    if (!form.sender || !form.receiver) {
      alert("Please enter both sender and receiver email addresses.");
      return;
    }
    const mails = form.receiver.split(",");
    try {
      mails.map(async (receiver) => {
        const payload = {
          sender: form.sender,
          receiver,
          name: form.name,
          role: form.role,
        };
        await axios.post("http://localhost:8090/send-mail", {
          ...payload,
          ...mailContent,
        });
        alert(`Mail sent successfully! ${receiver}`);
      });
    } catch (err) {
      console.error(err);
      alert("Error sending mail. Please check your server connection.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(noteContent)
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            width: "100%",
            maxWidth: "1000px",
            backgroundColor: "background.paper",
            color: "text.primary",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              align="center"
              gutterBottom
            >
              Cold Mail Sender test
            </Typography>
            <IconButton
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
            >
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
            justifyContent="space-between"
          >
            {/* Left Side — Form */}
            <Box flex={1} display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Sender Email"
                name="sender"
                value={form.sender}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Receiver Email"
                name="receiver"
                value={form.receiver}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Name of the Person"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                select
                label="Job Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
              >
                {roles.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                size="large"
                onClick={handleGenerate}
                sx={{ mt: 1 }}
              >
                Generate Mail
              </Button>
            </Box>

            {/* Right Side — Generated Mail Preview */}
            <Box flex={1} display="flex" flexDirection="column">
              {mailContent.title ? (
                <>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor:
                        theme.palette.mode === "light" ? "#f9fafc" : "#2c2c2c",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {mailContent.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          whiteSpace: "pre-line",
                          fontFamily: "monospace",
                          color: "text.primary",
                        }}
                      >
                        {mailContent.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleSend}
                      sx={{ mt: 3, alignSelf: "flex-end" }}
                    >
                      Send Mail
                    </Button>
                  </Paper>

                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor:
                        theme.palette.mode === "light" ? "#f9fafc" : "#2c2c2c",
                      flexGrow: 1,
                      mt: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          whiteSpace: "pre-line",
                          fontFamily: "monospace",
                          color: "text.primary",
                        }}
                      >
                        {noteContent}
                      </Typography>
                      <Typography>Count : {noteContent.length}</Typography>
                      <Button onClick={handleCopy}>Copy</Button>
                    </Box>
                  </Paper>
                </>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 5, fontStyle: "italic" }}
                >
                  Generate a mail to preview it here ✉️
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
