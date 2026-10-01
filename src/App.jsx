import { HashRouter, Route, Routes } from "react-router-dom";
import HanssenPortfolioPage from "./pages/HanssenPortfolioPage";
import { PortfolioThemeProvider } from "./components/PortfolioTheme";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectPage from "./pages/ProjectPage";
import ColabsConceptPage from "./pages/ColabsConceptPage";
import CaiConceptPage from "./pages/CaiConceptPage";
import ScrollToTop from "./components/ScrollToTop";
import { ProjectTransitionProvider } from "./components/ProjectTransition";
import "./styles.css";

export default function App() {
  return (
    <HashRouter>
      <PortfolioThemeProvider>
        <ProjectTransitionProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HanssenPortfolioPage />} />
            <Route path="/about" element={<HanssenPortfolioPage />} />
            <Route path="/blog" element={<HanssenPortfolioPage />} />
            <Route path="/blog/:slug" element={<HanssenPortfolioPage />} />
            <Route path="/work" element={<HanssenPortfolioPage />} />
            <Route path="/original" element={<HomePage />} />
            <Route path="/concepts/colabs" element={<ColabsConceptPage />} />
            <Route path="/concepts/cai" element={<CaiConceptPage />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ProjectTransitionProvider>
      </PortfolioThemeProvider>
    </HashRouter>
  );
}
