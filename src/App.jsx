import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectPage from "./pages/ProjectPage";
import ColabsConceptPage from "./pages/ColabsConceptPage";
import CaiConceptPage from "./pages/CaiConceptPage";
import ScrollToTop from "./components/ScrollToTop";
import { ProjectTransitionProvider } from "./components/ProjectTransition";
import { PortfolioThemeProvider } from "./components/PortfolioTheme";
import "./styles.css";

export default function App() {
  return (
    <HashRouter>
      <PortfolioThemeProvider>
        <ProjectTransitionProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<CaiConceptPage />} />
            <Route path="/original" element={<HomePage />} />
            <Route path="/concepts/colabs" element={<ColabsConceptPage />} />
            <Route path="/concepts/cai" element={<Navigate to="/" replace />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ProjectTransitionProvider>
      </PortfolioThemeProvider>
    </HashRouter>
  );
}
