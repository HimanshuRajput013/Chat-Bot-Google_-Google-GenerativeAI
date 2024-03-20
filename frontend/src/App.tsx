import { useState } from "react";
import { TextField, Button, Container, Typography, Chip, Box, Snackbar, SnackbarOrigin, AlertColor, Alert } from "@mui/material";
// import "./App.css";

export default function App() {
  const [result, setResult] = useState(null);
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [errorMsg , setErrorMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [type, setAlertType] = useState<AlertColor>();

  const snackBarPosition: SnackbarOrigin = {
      vertical: "top",
      horizontal: "right"
  }

  const handleDeleteFile = () => {
    setAlertMessage("File removed successfully!");
    setAlertType("success");
    if(question) {
        setIsSubmitDisabled(false)
    } else {
        setIsSubmitDisabled(true);
    }
    if(result) {
        setResult(null);
    }
    setFile(null);
  };

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
    if(event.target.value !== "") {
        setIsSubmitDisabled(false)
    } else {
        setIsSubmitDisabled(true);
        setResult(null);
    }
  };

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const maxSize = 100 * 1024 * 1024;
        if (event.target.files && event.target.files.length > 0) {
          const selectedFile = event.target.files[0];
          if (selectedFile.size > maxSize) {
            setAlertMessage("The file size should be less than 100MB");
            setAlertType("warning");
            setSnackbarOpen(true);
          } else if (!["csv", "document", "pdf", "text/plain"].some((type) => selectedFile.type.includes(type))) {
            setAlertMessage("The file should be .csv, .docx, .pdf, or .txt");
            setAlertType("warning");
            setSnackbarOpen(true);
          } else {
            setFile(selectedFile);
            setIsSubmitDisabled(false);
            setAlertMessage("File uploaded successfully!");
            setAlertType("success")
            setSnackbarOpen(true);
          }
        }
    };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }
    if (question) {
      formData.append("question", question);
    }

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data.result);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="lightskyblue"
    >
      <Container maxWidth="sm">
        <Box bgcolor="white" p={3} borderRadius={4} boxShadow={2}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>
              Predict Content
            </Typography>
            <TextField
              label="Question"
              variant="outlined"
              fullWidth
              value={question}
              onChange={handleQuestionChange}
              margin="normal"
              InputProps={{ style: { backgroundColor: "white" } }}
            />
            <input
              type="file"
              accept=".txt, .docx, .pdf, .csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="file"
            />
            <label htmlFor="file">
              <Button variant="contained" component="span">
                Upload File
              </Button>
            </label>
            {file && (
              <Chip
                label={file.name}
                onDelete={handleDeleteFile}
                style={{ marginLeft: "5px" }}
              />
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitDisabled}
              style={{ marginTop: "15px" }}
            >
              Submit
            </Button>
          </form>
          {result && (
            <Typography variant="body1" gutterBottom style={{ marginTop: "20px" }}>
              Result: {result}
            </Typography>
          )}
          <Snackbar
            anchorOrigin={snackBarPosition}
            open={snackbarOpen}
            autoHideDuration={1000}
            onClose={handleCloseSnackbar}
          >
            <Alert severity={type} variant="filled" onClose={handleCloseSnackbar}>{alertMessage}</Alert>
          </Snackbar>
        </Box>
      </Container>
    </Box>
  );
}
