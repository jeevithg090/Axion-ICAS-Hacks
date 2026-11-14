import "./global.css";

import { lazy, Suspense, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteLayout from "@/components/layout/SiteLayout";
import ThemeProvider from "@/components/theme/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLoading from "@/components/PageLoading";
import Protected from "@/components/auth/Protected";
import RequireRole from "@/components/auth/RequireRole";
import RequireFirebase from "@/components/auth/RequireFirebase";
import { AuthProvider } from "@/context/AuthContext";
import { isFirebaseConfigured } from "@/lib/firebase";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Public content pages and portal features are code-split per route.
const About = lazy(() => import("@/pages/About"));
const Academics = lazy(() => import("@/pages/Academics"));
const Research = lazy(() => import("@/pages/Research"));
const StudentLife = lazy(() => import("@/pages/StudentLife"));
const Enigma = lazy(() => import("@/pages/Enigma"));
const AdmissionsAid = lazy(() => import("@/pages/AdmissionsAid"));
const Transfer = lazy(() => import("@/pages/Transfer"));
const News = lazy(() => import("@/pages/News"));
const Events = lazy(() => import("@/pages/Events"));
const Faculty = lazy(() => import("@/pages/Faculty"));
const FinancialAid = lazy(() => import("@/pages/FinancialAid"));
const MedicalAid = lazy(() => import("@/pages/MedicalAid"));
const Impact = lazy(() => import("@/pages/Impact"));
const Contact = lazy(() => import("@/pages/Contact"));
const PortalLogin = lazy(() => import("@/pages/PortalLogin"));
const Admin = lazy(() => import("@/pages/Admin"));
const Portal = lazy(() => import("@/pages/Portal"));
const PortalCourses = lazy(() => import("@/pages/PortalCourses"));
const PortalCourse = lazy(() => import("@/pages/PortalCourse"));
const PortalTransfer = lazy(() => import("@/pages/PortalTransfer"));
const PortalTransferCloud = lazy(() => import("@/pages/PortalTransferCloud"));
const StudyCentre = lazy(() => import("@/pages/StudyCentre"));
const AcademicPlanner = lazy(() => import("@/pages/AcademicPlanner"));
const BuddySystem = lazy(() => import("@/pages/BuddySystem"));
const ResearchHub = lazy(() => import("@/pages/ResearchHub"));

const queryClient = new QueryClient();

/** A portal page that needs a signed-in user and a Firebase backend. */
function cloudFeature(feature: string, page: ReactElement) {
  return (
    <Protected>
      <RequireFirebase feature={feature}>{page}</RequireFirebase>
    </Protected>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SiteLayout>
              <ErrorBoundary>
                <Suspense fallback={<PageLoading />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/academics" element={<Academics />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/student-life" element={<StudentLife />} />
                    <Route path="/enigma" element={<Enigma />} />
                    <Route path="/admissions-aid" element={<AdmissionsAid />} />
                    <Route path="/transfer" element={<Transfer />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/faculty" element={<Faculty />} />
                    <Route path="/financial-aid" element={<FinancialAid />} />
                    <Route path="/medical-aid" element={<MedicalAid />} />
                    <Route path="/impact" element={<Impact />} />
                    <Route path="/contact" element={<Contact />} />

                    <Route path="/login" element={<PortalLogin />} />

                    <Route
                      path="/admin"
                      element={
                        <RequireRole role="admin">
                          <Admin />
                        </RequireRole>
                      }
                    />

                    <Route
                      path="/portal"
                      element={
                        <Protected>
                          <Portal />
                        </Protected>
                      }
                    />
                    <Route
                      path="/portal/courses"
                      element={
                        <Protected>
                          <PortalCourses />
                        </Protected>
                      }
                    />
                    <Route
                      path="/portal/courses/:code"
                      element={
                        <Protected>
                          <PortalCourse />
                        </Protected>
                      }
                    />
                    <Route
                      path="/portal/transfer"
                      element={
                        <Protected>
                          {isFirebaseConfigured ? (
                            <PortalTransferCloud />
                          ) : (
                            <PortalTransfer />
                          )}
                        </Protected>
                      }
                    />
                    <Route
                      path="/portal/study-centre"
                      element={cloudFeature("Study Centre", <StudyCentre />)}
                    />
                    <Route
                      path="/portal/planner"
                      element={cloudFeature(
                        "Academic Planner",
                        <AcademicPlanner />,
                      )}
                    />
                    <Route
                      path="/portal/buddies"
                      element={cloudFeature("Buddy System", <BuddySystem />)}
                    />
                    <Route
                      path="/portal/research-hub"
                      element={cloudFeature("Research Hub", <ResearchHub />)}
                    />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </SiteLayout>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
