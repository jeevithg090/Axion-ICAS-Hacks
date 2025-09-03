import { useEffect, useState } from "react";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getBuddyProfile,
  createBuddyProfile,
  findPotentialMatches,
  createBuddyMatch,
  subscribeToUserMatches,
  updateMatchStatus,
  sendBuddyMessage,
  subscribeToMatchMessages,
  type BuddyProfile,
  type BuddyMatch,
  type BuddyMessage,
} from "@/lib/buddy-system";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function BuddySystem() {
  const { user, loading } = useFirebaseAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<BuddyProfile | null>(null);
  const [matches, setMatches] = useState<BuddyMatch[]>([]);
  const [potentialMatches, setPotentialMatches] = useState<BuddyProfile[]>([]);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [messages, setMessages] = useState<BuddyMessage[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    // Load buddy profile
    getBuddyProfile(user.uid).then(setProfile);

    // Subscribe to matches
    const unsubMatches = subscribeToUserMatches(user.uid, setMatches);

    return () => {
      unsubMatches();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (selectedMatch) {
      const unsubMessages = subscribeToMatchMessages(selectedMatch, setMessages);
      return () => unsubMessages();
    }
  }, [selectedMatch]);

  const handleCreateProfile = async (formData: FormData) => {
    if (!user?.uid) return;

    const interests = (formData.get('interests') as string).split(',').map(s => s.trim());
    
    await createBuddyProfile({
      userId: user.uid,
      name: user.name,
      email: user.email,
      role: formData.get('role') as "mentor" | "mentee",
      program: formData.get('program') as string,
      year: parseInt(formData.get('year') as string),
      targetCountry: formData.get('targetCountry') as string,
      targetUniversity: formData.get('targetUniversity') as string,
      interests,
      bio: formData.get('bio') as string,
      isAvailable: true,
    });

    const newProfile = await getBuddyProfile(user.uid);
    setProfile(newProfile);
    setShowCreateProfile(false);
    
    toast({
      title: "Profile created",
      description: "Your buddy profile has been created successfully!",
    });
  };

  const handleFindMatches = async () => {
    if (!profile) return;
    
    const matches = await findPotentialMatches(profile);
    setPotentialMatches(matches);
    
    toast({
      title: "Matches found",
      description: `Found ${matches.length} potential matches for you!`,
    });
  };

  const handleSendMatch = async (mentorId: string, score: number) => {
    if (!user?.uid) return;
    
    await createBuddyMatch(mentorId, user.uid, score);
    
    toast({
      title: "Match request sent",
      description: "Your buddy request has been sent!",
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedMatch || !user?.uid) return;
    
    await sendBuddyMessage(selectedMatch, user.uid, content);
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
        title="ICAS Buddy System — Connect with Mentors"
        description="Get matched with seniors and alumni for guidance on your transfer journey"
      />
      <section className="container py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              ICAS Buddy System
            </h1>
            <p className="text-sm text-muted-foreground">
              Connect with mentors who've been through your journey
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/portal">Back to Portal</Link>
            </Button>
          </div>
        </div>

        {!profile ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Create Your Buddy Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create a profile to get matched with mentors or become a mentor yourself.
              </p>
              <Button onClick={() => setShowCreateProfile(true)}>
                Create Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="matches" className="w-full">
                <TabsList>
                  <TabsTrigger value="matches">My Matches</TabsTrigger>
                  <TabsTrigger value="discover">Discover</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="matches" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your Matches</h3>
                    <Badge variant="secondary">{matches.length} active</Badge>
                  </div>
                  
                  {matches.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">No matches yet. Try discovering potential buddies!</p>
                        <Button className="mt-4" onClick={handleFindMatches}>
                          Find Matches
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {matches.map(match => (
                        <Card key={match.id}>
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>M</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">Match #{match.id.slice(-6)}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Score: {match.matchScore}% • {match.status}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {match.status === "pending" && (
                                  <Button 
                                    size="sm"
                                    onClick={() => updateMatchStatus(match.id, "accepted")}
                                  >
                                    Accept
                                  </Button>
                                )}
                                {match.status === "accepted" && (
                                  <Button 
                                    size="sm"
                                    onClick={() => setSelectedMatch(match.id)}
                                  >
                                    Chat
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="discover" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Discover Mentors</h3>
                    <Button onClick={handleFindMatches}>
                      Find New Matches
                    </Button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {potentialMatches.map(mentor => (
                      <Card key={mentor.id}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {mentor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{mentor.name}</div>
                              <div className="text-sm text-muted-foreground font-normal">
                                Year {mentor.year} • {mentor.program}
                              </div>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="text-sm">{mentor.bio}</div>
                          
                          {mentor.targetCountry && (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Target: </span>
                              {mentor.targetCountry}
                              {mentor.targetUniversity && ` • ${mentor.targetUniversity}`}
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {mentor.interests.slice(0, 3).map(interest => (
                              <Badge key={interest} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={() => handleSendMatch(mentor.id, (mentor as any).matchScore || 0)}
                          >
                            Send Match Request
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="profile" className="space-y-4">
                  <ProfileSection profile={profile} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Chat Sidebar */}
            <div className="space-y-6">
              {selectedMatch && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Chat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChatSection 
                      matchId={selectedMatch}
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      currentUserId={user.uid}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Create Profile Dialog */}
        <Dialog open={showCreateProfile} onOpenChange={setShowCreateProfile}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Buddy Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateProfile(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Role</label>
                <select name="role" className="w-full mt-1 p-2 border rounded-md" required>
                  <option value="mentee">Looking for a mentor</option>
                  <option value="mentor">Want to be a mentor</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Program</label>
                <select name="program" className="w-full mt-1 p-2 border rounded-md" required>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Aeronautical Engineering">Aeronautical Engineering</option>
                  <option value="Mechatronics">Mechatronics</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Current Year</label>
                <Input name="year" type="number" min="1" max="4" required />
              </div>
              
              <div>
                <label className="text-sm font-medium">Target Country</label>
                <Input name="targetCountry" placeholder="e.g., USA, Germany, Australia" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Target University</label>
                <Input name="targetUniversity" placeholder="e.g., UC Berkeley" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Interests (comma-separated)</label>
                <Input name="interests" placeholder="e.g., AI, Robotics, Web Development" required />
              </div>
              
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea name="bio" placeholder="Tell others about yourself..." required />
              </div>
              
              <Button type="submit" className="w-full">
                Create Profile
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}

function ProfileSection({ profile }: { profile: BuddyProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{profile.name}</div>
            <div className="text-sm text-muted-foreground">
              {profile.role} • Year {profile.year} • {profile.program}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Target: </span>
            {profile.targetCountry}
            {profile.targetUniversity && ` • ${profile.targetUniversity}`}
          </div>
          
          <div className="text-sm">{profile.bio}</div>
          
          <div className="flex flex-wrap gap-1">
            {profile.interests.map(interest => (
              <Badge key={interest} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${profile.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-sm text-muted-foreground">
            {profile.isAvailable ? 'Available for matching' : 'Not available'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ChatSection({ 
  matchId, 
  messages, 
  onSendMessage, 
  currentUserId 
}: { 
  matchId: string;
  messages: BuddyMessage[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
}) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="space-y-4">
      <div className="h-64 overflow-y-auto space-y-2 p-3 border rounded-lg">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs p-2 rounded-lg text-sm ${
              message.senderId === currentUserId 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}