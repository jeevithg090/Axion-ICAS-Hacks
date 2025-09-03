import { useEffect, useState } from "react";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  getTransferProfile,
  createTransferProfile,
  updateTransferProfile,
  uploadTransferDocument,
  subscribeToTransferDocuments,
  subscribeToDeadlines,
  subscribeToTimeline,
  addTimelineEvent,
  addDeadline,
  updateDeadline,
  UNIVERSITIES,
  checkEligibility,
  calculateProgress,
  type TransferProfile,
  type TransferDocument,
  type Deadline,
  type TimelineEvent,
  type DocumentItem,
} from "@/lib/transfer-firebase";
import { Link } from "react-router-dom";

const REQUIRED_DOCUMENTS: DocumentItem[] = [
  { id: "transcript-sem1", label: "Semester 1 Transcript", category: "academic", required: true, status: "pending" },
  { id: "transcript-sem2", label: "Semester 2 Transcript", category: "academic", required: true, status: "pending" },
  { id: "transcript-sem3", label: "Semester 3 Transcript", category: "academic", required: true, status: "pending" },
  { id: "transcript-sem4", label: "Semester 4 Transcript", category: "academic", required: true, status: "pending" },
  { id: "gpa-sheet", label: "Consolidated GPA Sheet", category: "academic", required: true, status: "pending" },
  { id: "passport", label: "Passport Copy", category: "personal", required: true, status: "pending" },
  { id: "visa-form", label: "Visa Application Form", category: "personal", required: true, status: "pending" },
  { id: "bank-statement", label: "Bank Statement (6 months)", category: "financial", required: true, status: "pending" },
  { id: "affidavit", label: "Affidavit of Support", category: "financial", required: false, status: "pending" },
];

export default function PortalTransferNew() {
  const { user, loading } = useFirebaseAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<TransferProfile | null>(null);
  const [documents, setDocuments] = useState<TransferDocument[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);

  const progress = profile ? calculateProgress(profile, documents, deadlines) : 0;

  useEffect(() => {
    if (!user?.uid) return;

    // Load or create transfer profile
    getTransferProfile(user.uid).then(existingProfile => {
      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // Create initial profile
        const newProfile: Partial<TransferProfile> = {
          userId: user.uid,
          stage: "application_submitted",
          gpa: 8.0,
          creditsEarned: 60,
          program: "Computer Science",
          year: 2,
        };
        createTransferProfile(user.uid, newProfile).then(() => {
          getTransferProfile(user.uid).then(setProfile);
        });
      }
    });

    // Subscribe to real-time updates
    const unsubDocs = subscribeToTransferDocuments(user.uid, setDocuments);
    const unsubDeadlines = subscribeToDeadlines(user.uid, setDeadlines);
    const unsubTimeline = subscribeToTimeline(user.uid, setTimeline);

    return () => {
      unsubDocs();
      unsubDeadlines();
      unsubTimeline();
    };
  }, [user?.uid]);

  const handleDocumentUpload = async (documentId: string, file: File) => {
    if (!user?.uid) return;
    
    setUploading(documentId);
    try {
      await uploadTransferDocument(user.uid, documentId, file);
      await addTimelineEvent(user.uid, {
        when: new Date().toISOString(),
        description: `Uploaded ${REQUIRED_DOCUMENTS.find(d => d.id === documentId)?.label}`,
        type: "document",
      });
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleStageUpdate = async (newStage: TransferProfile['stage']) => {
    if (!user?.uid || !profile) return;
    
    await updateTransferProfile(user.uid, { stage: newStage });
    await addTimelineEvent(user.uid, {
      when: new Date().toISOString(),
      description: `Stage updated to: ${newStage.replace('_', ' ')}`,
      type: "milestone",
    });
    
    toast({
      title: "Stage updated",
      description: `Transfer stage updated to ${newStage.replace('_', ' ')}`,
    });
  };

  const addCustomDeadline = async (label: string, due: string, type: Deadline['type']) => {
    if (!user?.uid) return;
    
    await addDeadline(user.uid, {
      label,
      due,
      type,
      completed: false,
    });
    
    toast({
      title: "Deadline added",
      description: `Added deadline: ${label}`,
    });
  };

  if (loading) {
    return (
      <main className="container py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in</h1>
          <p className="text-muted-foreground mt-2">You need to be signed in to access the transfer portal.</p>
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
        title="Smart Transfer Portal — ICAS"
        description="Manage your 2+2 transfer journey with real-time tracking"
      />
      <section className="container py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Smart Transfer Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your 2+2 transfer journey in real-time
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/portal">Back to Portal</Link>
            </Button>
          </div>
        </div>

        {profile && (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Transfer Progress</span>
                    <Badge variant="secondary">{progress}% Complete</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-3 mb-4" />
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Current Stage</div>
                      <div className="font-semibold">{profile.stage.replace('_', ' ')}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">GPA</div>
                      <div className="font-semibold">{profile.gpa.toFixed(2)}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Credits</div>
                      <div className="font-semibold">{profile.creditsEarned}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="universities">Universities</TabsTrigger>
                  <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="documents" className="space-y-4">
                  <DocumentsSection 
                    documents={documents}
                    onUpload={handleDocumentUpload}
                    uploading={uploading}
                  />
                </TabsContent>

                <TabsContent value="universities" className="space-y-4">
                  <UniversitiesSection 
                    profile={profile}
                    onSelectUniversity={async (universityId) => {
                      await updateTransferProfile(user.uid, { targetUniversityId: universityId });
                      await addTimelineEvent(user.uid, {
                        when: new Date().toISOString(),
                        description: `Selected target university: ${UNIVERSITIES.find(u => u.id === universityId)?.name}`,
                        type: "milestone",
                      });
                    }}
                  />
                </TabsContent>

                <TabsContent value="deadlines" className="space-y-4">
                  <DeadlinesSection 
                    deadlines={deadlines}
                    onAddDeadline={addCustomDeadline}
                    onUpdateDeadline={updateDeadline}
                  />
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <TimelineSection events={timeline} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => handleStageUpdate("docs_uploaded")}
                    disabled={profile.stage !== "application_submitted"}
                  >
                    Mark Documents Complete
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleStageUpdate("visa_applied")}
                    disabled={profile.stage !== "university_review"}
                  >
                    Applied for Visa
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    onClick={() => window.print()}
                  >
                    Download Progress Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {deadlines.filter(d => !d.completed).slice(0, 3).map(deadline => (
                    <div key={deadline.id} className="p-3 rounded-lg border">
                      <div className="font-medium text-sm">{deadline.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(deadline.due).toLocaleDateString()}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {deadline.type}
                      </Badge>
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

function DocumentsSection({ 
  documents, 
  onUpload, 
  uploading 
}: { 
  documents: TransferDocument[];
  onUpload: (docId: string, file: File) => void;
  uploading: string | null;
}) {
  const getDocumentStatus = (docId: string) => {
    const doc = documents.find(d => d.documentId === docId);
    return doc?.status || "pending";
  };

  const groupedDocs = {
    academic: REQUIRED_DOCUMENTS.filter(d => d.category === "academic"),
    personal: REQUIRED_DOCUMENTS.filter(d => d.category === "personal"),
    financial: REQUIRED_DOCUMENTS.filter(d => d.category === "financial"),
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Object.entries(groupedDocs).map(([category, docs]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg capitalize">{category} Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {docs.map(doc => {
              const status = getDocumentStatus(doc.id);
              const isUploading = uploading === doc.id;
              
              return (
                <div key={doc.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{doc.label}</div>
                    <Badge variant={
                      status === "verified" ? "default" :
                      status === "uploaded" ? "secondary" : "outline"
                    }>
                      {status}
                    </Badge>
                  </div>
                  
                  {doc.required && (
                    <div className="text-xs text-muted-foreground">Required</div>
                  )}
                  
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUpload(doc.id, file);
                      }}
                      disabled={isUploading}
                      className="text-xs"
                    />
                    {isUploading && (
                      <div className="text-xs text-muted-foreground">Uploading...</div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UniversitiesSection({ 
  profile, 
  onSelectUniversity 
}: { 
  profile: TransferProfile;
  onSelectUniversity: (universityId: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm">
        <div className="px-3 py-2 rounded-lg bg-muted">
          <span className="text-muted-foreground">Your GPA: </span>
          <span className="font-semibold">{profile.gpa.toFixed(2)}</span>
        </div>
        <div className="px-3 py-2 rounded-lg bg-muted">
          <span className="text-muted-foreground">Credits: </span>
          <span className="font-semibold">{profile.creditsEarned}</span>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {UNIVERSITIES.map(university => {
          const eligibility = checkEligibility(profile.gpa, profile.creditsEarned, university);
          const isSelected = profile.targetUniversityId === university.id;
          
          return (
            <Card key={university.id} className={isSelected ? "ring-2 ring-primary" : ""}>
              <CardHeader>
                <CardTitle className="text-base flex items-start justify-between">
                  <div>
                    <div>{university.name}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {university.country} • {university.language}
                    </div>
                  </div>
                  <Badge variant={eligibility.eligible ? "default" : "secondary"}>
                    {eligibility.eligible ? "Eligible" : "Review Required"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  {university.description}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Tuition: </span>
                    <span className="font-medium">${university.tuitionUSD.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Min GPA: </span>
                    <span className="font-medium">{university.gpaCutoff}</span>
                  </div>
                </div>
                
                {university.requirements && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium">Requirements:</div>
                    <div className="flex flex-wrap gap-1">
                      {university.requirements.map(req => (
                        <Badge key={req} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full"
                  variant={isSelected ? "secondary" : "default"}
                  onClick={() => onSelectUniversity(university.id)}
                  disabled={!eligibility.eligible}
                >
                  {isSelected ? "Selected" : "Select University"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function DeadlinesSection({ 
  deadlines, 
  onAddDeadline, 
  onUpdateDeadline 
}: { 
  deadlines: Deadline[];
  onAddDeadline: (label: string, due: string, type: Deadline['type']) => void;
  onUpdateDeadline: (id: string, updates: Partial<Deadline>) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Deadlines</h3>
        <Button 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Add Deadline
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="pt-6">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onAddDeadline(
                  formData.get('label') as string,
                  formData.get('due') as string,
                  formData.get('type') as Deadline['type']
                );
                setShowAddForm(false);
                e.currentTarget.reset();
              }}
              className="space-y-3"
            >
              <Input name="label" placeholder="Deadline label" required />
              <Input name="due" type="datetime-local" required />
              <select name="type" className="w-full p-2 border rounded-md" required>
                <option value="application">Application</option>
                <option value="visa">Visa</option>
                <option value="tuition">Tuition</option>
                <option value="travel">Travel</option>
                <option value="custom">Custom</option>
              </select>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Add</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {deadlines.map(deadline => {
          const isOverdue = new Date(deadline.due) < new Date() && !deadline.completed;
          const daysLeft = Math.ceil((new Date(deadline.due).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={deadline.id} className={isOverdue ? "border-destructive" : ""}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{deadline.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(deadline.due).toLocaleDateString()} • 
                      {isOverdue ? " Overdue" : ` ${daysLeft} days left`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{deadline.type}</Badge>
                    <Button
                      size="sm"
                      variant={deadline.completed ? "secondary" : "default"}
                      onClick={() => onUpdateDeadline(deadline.id, { completed: !deadline.completed })}
                    >
                      {deadline.completed ? "Completed" : "Mark Complete"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TimelineSection({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Transfer Timeline</h3>
      <div className="space-y-3">
        {events.map(event => (
          <Card key={event.id}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${
                  event.type === "milestone" ? "bg-primary" :
                  event.type === "document" ? "bg-secondary" :
                  event.type === "deadline" ? "bg-destructive" : "bg-muted"
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{event.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(event.when).toLocaleString()}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {event.type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}