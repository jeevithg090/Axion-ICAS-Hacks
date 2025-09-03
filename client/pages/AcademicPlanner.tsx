import { useEffect, useState } from "react";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAcademicPlan,
  createAcademicPlan,
  updateAcademicPlan,
  getAllCourses,
  getRecommendedCourses,
  calculateGPA,
  calculateProjectedGPA,
  gradeToGPA,
  validateTransferCredits,
  type AcademicPlan,
  type Course,
  type CourseGrade,
  type GPAScenario,
} from "@/lib/academic-planner";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function AcademicPlanner() {
  const { user, loading } = useFirebaseAuth();
  const { toast } = useToast();
  
  const [plan, setPlan] = useState<AcademicPlan | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [gpaScenarios, setGpaScenarios] = useState<GPAScenario[]>([]);
  const [selectedSemester, setSelectedSemester] = useState(3);
  const [selectedYear, setSelectedYear] = useState(2);

  useEffect(() => {
    if (!user?.uid) return;

    // Load academic plan
    getAcademicPlan(user.uid).then(existingPlan => {
      if (existingPlan) {
        setPlan(existingPlan);
        setSelectedSemester(existingPlan.currentSemester + 1);
        setSelectedYear(existingPlan.currentYear);
      } else {
        // Create initial plan
        const newPlan: Omit<AcademicPlan, 'createdAt' | 'updatedAt'> = {
          userId: user.uid,
          currentSemester: 2,
          currentYear: 1,
          program: "Computer Science",
          targetGPA: 8.5,
          selectedCourses: [],
          completedCourses: [
            {
              courseId: "cs101",
              courseCode: "CS101",
              courseName: "Programming Fundamentals",
              grade: "A",
              gpa: 9,
              credits: 4,
              semester: 1,
              year: 1,
            },
            {
              courseId: "math101",
              courseCode: "MATH101", 
              courseName: "Calculus I",
              grade: "B+",
              gpa: 8,
              credits: 3,
              semester: 1,
              year: 1,
            },
          ],
          plannedCourses: [],
          transferCredits: [],
        };
        createAcademicPlan(newPlan).then(() => {
          getAcademicPlan(user.uid).then(setPlan);
        });
      }
    });

    // Load all courses
    getAllCourses().then(setAllCourses);
  }, [user?.uid]);

  useEffect(() => {
    if (plan) {
      // Get recommended courses for next semester
      getRecommendedCourses(user.uid!, plan, selectedSemester, selectedYear)
        .then(setRecommendedCourses);
    }
  }, [plan, selectedSemester, selectedYear, user?.uid]);

  const currentGPA = plan ? calculateGPA(plan.completedCourses) : 0;

  const handleAddCourse = async (courseId: string) => {
    if (!plan || !user?.uid) return;

    const updatedPlan = {
      ...plan,
      plannedCourses: [
        ...plan.plannedCourses,
        {
          courseId,
          semester: selectedSemester,
          year: selectedYear,
          priority: "medium" as const,
        }
      ]
    };

    await updateAcademicPlan(user.uid, updatedPlan);
    setPlan(updatedPlan);
    
    toast({
      title: "Course added",
      description: "Course added to your academic plan",
    });
  };

  const handleCreateScenario = (scenarioName: string, courses: { courseId: string; expectedGrade: string }[]) => {
    if (!plan) return;

    const coursesWithCredits = courses.map(c => {
      const course = allCourses.find(ac => ac.id === c.courseId);
      return {
        ...c,
        credits: course?.credits || 3,
      };
    });

    const projectedGPA = calculateProjectedGPA(plan.completedCourses, coursesWithCredits);
    
    const scenario: GPAScenario = {
      name: scenarioName,
      courses,
      projectedGPA,
    };

    setGpaScenarios([...gpaScenarios, scenario]);
  };

  if (loading) {
    return (
      <main className="container py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in</h1>
          <Button asChild className="mt-4">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <SEO
        title="ICAS Navigator — Academic Planner"
        description="Plan your courses and track your academic progress"
      />
      <section className="container py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              ICAS Navigator
            </h1>
            <p className="text-sm text-muted-foreground">
              Academic planning and course selection assistant
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/portal">Back to Portal</Link>
            </Button>
          </div>
        </div>

        {plan && (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="planner" className="w-full">
                <TabsList>
                  <TabsTrigger value="planner">Course Planner</TabsTrigger>
                  <TabsTrigger value="gpa">GPA Calculator</TabsTrigger>
                  <TabsTrigger value="transfer">Transfer Credits</TabsTrigger>
                </TabsList>

                <TabsContent value="planner" className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Select value={selectedSemester.toString()} onValueChange={(v) => setSelectedSemester(parseInt(v))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Semester 3</SelectItem>
                        <SelectItem value="4">Semester 4</SelectItem>
                        <SelectItem value="5">Semester 5</SelectItem>
                        <SelectItem value="6">Semester 6</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Year 2</SelectItem>
                        <SelectItem value="3">Year 3</SelectItem>
                        <SelectItem value="4">Year 4</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Badge variant="secondary">
                      {recommendedCourses.length} recommended courses
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {recommendedCourses.map(course => (
                      <Card key={course.id}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-start justify-between">
                            <div>
                              <div>{course.name}</div>
                              <div className="text-sm text-muted-foreground font-normal">
                                {course.code} • {course.credits} credits
                              </div>
                            </div>
                            <Badge variant={
                              course.category === "core" ? "default" :
                              course.category === "elective" ? "secondary" : "outline"
                            }>
                              {course.category}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {course.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs">
                            <Badge variant="outline">{course.difficulty}</Badge>
                            {course.instructor && (
                              <span className="text-muted-foreground">
                                {course.instructor}
                              </span>
                            )}
                          </div>
                          
                          {course.prerequisites.length > 0 && (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Prerequisites: </span>
                              {course.prerequisites.join(", ")}
                            </div>
                          )}
                          
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleAddCourse(course.id)}
                            disabled={plan.plannedCourses.some(pc => pc.courseId === course.id)}
                          >
                            {plan.plannedCourses.some(pc => pc.courseId === course.id) 
                              ? "Added to Plan" 
                              : "Add to Plan"
                            }
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="gpa" className="space-y-4">
                  <GPACalculatorSection 
                    plan={plan}
                    allCourses={allCourses}
                    scenarios={gpaScenarios}
                    onCreateScenario={handleCreateScenario}
                  />
                </TabsContent>

                <TabsContent value="transfer" className="space-y-4">
                  <TransferCreditsSection 
                    completedCourses={plan.completedCourses}
                    targetUniversityId={plan.targetUniversityId}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Academic Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current GPA:</span>
                      <span className="font-semibold">{currentGPA.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target GPA:</span>
                      <span className="font-semibold">{plan.targetGPA.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credits Earned:</span>
                      <span className="font-semibold">{plan.creditsEarned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Planned Courses:</span>
                      <span className="font-semibold">{plan.plannedCourses.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completed Courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {plan.completedCourses.map(course => (
                    <div key={course.courseId} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium">{course.courseCode}</div>
                        <div className="text-xs text-muted-foreground">
                          {course.credits} credits
                        </div>
                      </div>
                      <Badge variant="outline">{course.grade}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function GPACalculatorSection({ 
  plan, 
  allCourses, 
  scenarios, 
  onCreateScenario 
}: {
  plan: AcademicPlan;
  allCourses: Course[];
  scenarios: GPAScenario[];
  onCreateScenario: (name: string, courses: { courseId: string; expectedGrade: string }[]) => void;
}) {
  const [scenarioName, setScenarioName] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<{ courseId: string; expectedGrade: string }[]>([]);

  const addCourseToScenario = (courseId: string) => {
    setSelectedCourses([...selectedCourses, { courseId, expectedGrade: "A" }]);
  };

  const updateCourseGrade = (index: number, grade: string) => {
    const updated = [...selectedCourses];
    updated[index].expectedGrade = grade;
    setSelectedCourses(updated);
  };

  const removeCourseFromScenario = (index: number) => {
    setSelectedCourses(selectedCourses.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What-If GPA Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Scenario Name</label>
            <Input
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="e.g., Next Semester Plan"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Add Courses</label>
            <Select onValueChange={addCourseToScenario}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course to add" />
              </SelectTrigger>
              <SelectContent>
                {allCourses
                  .filter(course => !selectedCourses.some(sc => sc.courseId === course.id))
                  .map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name} ({course.credits} credits)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourses.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Selected Courses</div>
              {selectedCourses.map((sc, index) => {
                const course = allCourses.find(c => c.id === sc.courseId);
                return (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <div className="flex-1 text-sm">
                      {course?.code} - {course?.name}
                    </div>
                    <Select value={sc.expectedGrade} onValueChange={(grade) => updateCourseGrade(index, grade)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="C+">C+</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => removeCourseFromScenario(index)}
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          <Button 
            onClick={() => {
              if (scenarioName && selectedCourses.length > 0) {
                onCreateScenario(scenarioName, selectedCourses);
                setScenarioName("");
                setSelectedCourses([]);
              }
            }}
            disabled={!scenarioName || selectedCourses.length === 0}
          >
            Calculate Scenario
          </Button>
        </CardContent>
      </Card>

      {scenarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">GPA Scenarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scenarios.map((scenario, index) => (
              <div key={index} className="p-3 border rounded">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{scenario.name}</div>
                  <Badge variant={scenario.projectedGPA >= plan.targetGPA ? "default" : "secondary"}>
                    GPA: {scenario.projectedGPA.toFixed(2)}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {scenario.courses.length} courses • 
                  {scenario.projectedGPA >= plan.targetGPA ? " Meets target" : " Below target"}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TransferCreditsSection({ 
  completedCourses, 
  targetUniversityId 
}: {
  completedCourses: CourseGrade[];
  targetUniversityId?: string;
}) {
  const [validation, setValidation] = useState<{ valid: any[]; invalid: CourseGrade[] } | null>(null);

  useEffect(() => {
    if (targetUniversityId) {
      validateTransferCredits(completedCourses, targetUniversityId)
        .then(setValidation);
    }
  }, [completedCourses, targetUniversityId]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transfer Credit Validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!targetUniversityId ? (
            <p className="text-muted-foreground">
              Select a target university in the Transfer Portal to validate credits.
            </p>
          ) : validation ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2">
                  Likely to Transfer ({validation.valid.length} courses)
                </h4>
                <div className="space-y-2">
                  {validation.valid.map((credit, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded bg-green-50 dark:bg-green-950">
                      <div className="text-sm">
                        <div className="font-medium">{credit.originalCourse}</div>
                        <div className="text-xs text-muted-foreground">
                          {credit.credits} credits
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        Transferable
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {validation.invalid.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-600 mb-2">
                    May Need Review ({validation.invalid.length} courses)
                  </h4>
                  <div className="space-y-2">
                    {validation.invalid.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded bg-orange-50 dark:bg-orange-950">
                        <div className="text-sm">
                          <div className="font-medium">{course.courseCode}</div>
                          <div className="text-xs text-muted-foreground">
                            {course.credits} credits • Grade: {course.grade}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600">
                          Review Required
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Validating credits...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}