import { useEffect, useState } from "react";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  subscribeToResearchProjects,
  subscribeToUserProjects,
  createResearchProject,
  applyToProject,
  getProjectRecommendations,
  subscribeToProjectApplications,
  updateApplicationStatus,
  addProjectUpdate,
  subscribeToProjectUpdates,
  type ResearchProject,
  type ProjectApplication,
  type ProjectUpdate,
} from "@/lib/research-hub";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function ResearchHub() {
  const { user, loading } = useFirebaseAuth();
  const { toast } = useToast();
  
  const [allProjects, setAllProjects] = useState<ResearchProject[]>([]);
  const [userProjects, setUserProjects] = useState<ResearchProject[]>([]);
  const [recommendations, setRecommendations] = useState<ResearchProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [filter, setFilter] = useState<"all" | "research" | "development" | "robotics">("all");

  useEffect(() => {
    if (!user?.uid) return;

    // Subscribe to all projects
    const unsubAll = subscribeToResearchProjects(setAllProjects);
    
    // Subscribe to user's projects
    const unsubUser = subscribeToUserProjects(user.uid, setUserProjects);

    // Get recommendations
    getProjectRecommendations(user.uid, ["JavaScript", "Python", "React"], ["AI", "Web Development"])
      .then(setRecommendations);

    return () => {
      unsubAll();
      unsubUser();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (selectedProject) {
      const unsubApps = subscribeToProjectApplications(selectedProject.id, setApplications);
      const unsubUpdates = subscribeToProjectUpdates(selectedProject.id, setUpdates);
      
      return () => {
        unsubApps();
        unsubUpdates();
      };
    }
  }, [selectedProject]);

  const handleCreateProject = async (formData: FormData) => {
    if (!user?.uid) return;

    const skillsRequired = (formData.get('skillsRequired') as string).split(',').map(s => s.trim());
    const skillsOffered = (formData.get('skillsOffered') as string).split(',').map(s => s.trim());
    const tags = (formData.get('tags') as string).split(',').map(s => s.trim());

    await createResearchProject({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as "research" | "development" | "robotics",
      skillsRequired,
      skillsOffered,
      maxMembers: parseInt(formData.get('maxMembers') as string),
      currentMembers: [user.uid],
      creatorId: user.uid,
      creatorName: user.name,
      status: "open",
      tags,
      difficulty: formData.get('difficulty') as "beginner" | "intermediate" | "advanced",
      duration: formData.get('duration') as string,
    });

    setShowCreateProject(false);
    toast({
      title: "Project created",
      description: "Your research project has been created successfully!",
    });
  };

  const handleApplyToProject = async (project: ResearchProject, message: string) => {
    if (!user?.uid) return;

    await applyToProject(
      project.id,
      user.uid,
      user.name,
      user.email,
      message,
      ["JavaScript", "Python"] // This would come from user profile
    );

    toast({
      title: "Application sent",
      description: `Your application to "${project.title}" has been sent!`,
    });
  };

  const filteredProjects = allProjects.filter(project => 
    filter === "all" || project.category === filter
  );

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
        title="Research Hub — Collaborate & Learn"
        description="Join research projects, form study groups, and collaborate with peers"
      />
      <section className="container py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Research & Peer Learning Hub
            </h1>
            <p className="text-sm text-muted-foreground">
              Collaborate on projects and learn together
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateProject(true)}>
              Create Project
            </Button>
            <Button asChild variant="outline">
              <Link to="/portal">Back to Portal</Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Tabs defaultValue="discover" className="w-full">
              <TabsList>
                <TabsTrigger value="discover">Discover</TabsTrigger>
                <TabsTrigger value="my-projects">My Projects ({userProjects.length})</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>

              <TabsContent value="discover" className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="robotics">Robotics</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="secondary">{filteredProjects.length} projects</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      onApply={handleApplyToProject}
                      onViewDetails={setSelectedProject}
                      isOwner={project.creatorId === user?.uid}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="my-projects" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {userProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      onApply={handleApplyToProject}
                      onViewDetails={setSelectedProject}
                      isOwner={project.creatorId === user?.uid}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recommended" className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Recommended for You</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on your skills and interests
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {recommendations.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      onApply={handleApplyToProject}
                      onViewDetails={setSelectedProject}
                      isOwner={project.creatorId === user?.uid}
                      showRecommendationScore
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Project Details Sidebar */}
          <div className="space-y-6">
            {selectedProject && (
              <ProjectDetailsSection 
                project={selectedProject}
                applications={applications}
                updates={updates}
                onUpdateApplication={updateApplicationStatus}
                onAddUpdate={(content, type) => addProjectUpdate({
                  projectId: selectedProject.id,
                  authorId: user!.uid,
                  authorName: user!.name,
                  content,
                  type,
                })}
                isOwner={selectedProject.creatorId === user?.uid}
              />
            )}
          </div>
        </div>

        {/* Create Project Dialog */}
        <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Research Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateProject(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Project Title</label>
                  <Input name="title" required />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select name="category" className="w-full p-2 border rounded-md" required>
                    <option value="research">Research</option>
                    <option value="development">Development</option>
                    <option value="robotics">Robotics</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea name="description" required />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Skills Required (comma-separated)</label>
                  <Input name="skillsRequired" placeholder="e.g., Python, Machine Learning" />
                </div>
                <div>
                  <label className="text-sm font-medium">Skills You Offer (comma-separated)</label>
                  <Input name="skillsOffered" placeholder="e.g., JavaScript, UI Design" />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Max Members</label>
                  <Input name="maxMembers" type="number" min="2" max="10" defaultValue="4" required />
                </div>
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <select name="difficulty" className="w-full p-2 border rounded-md" required>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input name="duration" placeholder="e.g., 3 months" required />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input name="tags" placeholder="e.g., AI, Healthcare, Mobile App" />
              </div>
              
              <Button type="submit" className="w-full">
                Create Project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}

function ProjectCard({ 
  project, 
  onApply, 
  onViewDetails, 
  isOwner,
  showRecommendationScore 
}: {
  project: ResearchProject;
  onApply: (project: ResearchProject, message: string) => void;
  onViewDetails: (project: ResearchProject) => void;
  isOwner: boolean;
  showRecommendationScore?: boolean;
}) {
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  const handleApply = () => {
    onApply(project, applicationMessage);
    setShowApplyDialog(false);
    setApplicationMessage("");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-base flex items-start justify-between">
          <div>
            <div>{project.title}</div>
            <div className="text-sm text-muted-foreground font-normal">
              by {project.creatorName}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Badge variant="outline">{project.category}</Badge>
            {showRecommendationScore && (
              <Badge variant="secondary" className="text-xs">
                {(project as any).relevanceScore}% match
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{project.currentMembers.length}/{project.maxMembers} members</span>
          <span>{project.difficulty}</span>
          <span>{project.duration}</span>
        </div>
        
        <div className="space-y-2">
          <div className="text-xs font-medium">Skills Required:</div>
          <div className="flex flex-wrap gap-1">
            {project.skillsRequired.slice(0, 3).map(skill => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {project.skillsRequired.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.skillsRequired.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDetails(project)}
          >
            View Details
          </Button>
          {!isOwner && project.status === "open" && (
            <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
              <DialogTrigger asChild>
                <Button size="sm">Apply</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply to {project.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Why do you want to join this project? What can you contribute?"
                    required
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleApply}>Send Application</Button>
                    <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectDetailsSection({ 
  project, 
  applications, 
  updates, 
  onUpdateApplication, 
  onAddUpdate, 
  isOwner 
}: {
  project: ResearchProject;
  applications: ProjectApplication[];
  updates: ProjectUpdate[];
  onUpdateApplication: (appId: string, status: ProjectApplication['status']) => void;
  onAddUpdate: (content: string, type: ProjectUpdate['type']) => void;
  isOwner: boolean;
}) {
  const [newUpdate, setNewUpdate] = useState("");
  const [updateType, setUpdateType] = useState<ProjectUpdate['type']>("discussion");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">{project.description}</div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Skills & Tags</div>
          <div className="flex flex-wrap gap-1">
            {[...project.skillsRequired, ...project.tags].map(item => (
              <Badge key={item} variant="outline" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {isOwner && applications.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Applications ({applications.length})</div>
            {applications.map(app => (
              <div key={app.id} className="p-2 border rounded text-xs">
                <div className="font-medium">{app.applicantName}</div>
                <div className="text-muted-foreground">{app.message}</div>
                {app.status === "pending" && (
                  <div className="flex gap-1 mt-2">
                    <Button 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => onUpdateApplication(app.id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-6 text-xs"
                      onClick={() => onUpdateApplication(app.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="text-sm font-medium">Project Updates</div>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {updates.map(update => (
              <div key={update.id} className="p-2 border rounded text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{update.authorName}</div>
                  <Badge variant="outline" className="text-xs">{update.type}</Badge>
                </div>
                <div className="text-muted-foreground">{update.content}</div>
                <div className="text-muted-foreground">
                  {new Date(update.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Add Update</div>
          <select 
            value={updateType} 
            onChange={(e) => setUpdateType(e.target.value as ProjectUpdate['type'])}
            className="w-full p-1 border rounded text-xs"
          >
            <option value="discussion">Discussion</option>
            <option value="milestone">Milestone</option>
            <option value="resource">Resource</option>
            <option value="announcement">Announcement</option>
          </select>
          <Textarea
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            placeholder="Share an update..."
            className="text-xs"
          />
          <Button 
            size="sm" 
            onClick={() => {
              if (newUpdate.trim()) {
                onAddUpdate(newUpdate, updateType);
                setNewUpdate("");
              }
            }}
          >
            Post Update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}