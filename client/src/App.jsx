import { Routes, Route } from "react-router-dom";

import Home from "./screens/Home";
import CoverPage from "./screens/CoverPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="bodyBackground"> {/* Apply the CSS class here */}
        <div>
          <Routes>
            <Route path="/" element={<CoverPage />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
