
import React, { useState } from "react";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, ThumbsUp, MessageSquare, Lightbulb, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Sample community ideas
const sampleIdeas = [
  {
    id: 1,
    title: "Urban Forest Initiative",
    author: "GreenThumb",
    content: "We should start a community project to plant trees in urban areas with high pollution levels. Trees naturally filter air pollutants and provide oxygen.",
    likes: 24,
    comments: 7,
    category: "Green Spaces"
  },
  {
    id: 2,
    title: "Car-Free Sundays",
    author: "ClearAirAdvocate",
    content: "Implementing car-free Sundays in city centers can significantly reduce emissions and encourage people to use public transport or bicycles.",
    likes: 18,
    comments: 5,
    category: "Transportation"
  },
  {
    id: 3,
    title: "Air Quality Sensors Network",
    author: "DataScientist",
    content: "Creating a network of low-cost air quality sensors throughout the city would provide more accurate and localized pollution data for residents.",
    likes: 32,
    comments: 9,
    category: "Technology"
  },
  {
    id: 4,
    title: "School Air Purification Project",
    author: "HealthyKids",
    content: "We should ensure all schools in high-pollution areas have proper air purification systems to protect children's health during school hours.",
    likes: 41,
    comments: 12,
    category: "Health"
  },
  {
    id: 5,
    title: "Industrial Emission Reporting App",
    author: "CleanIndustry",
    content: "Developing a mobile app where citizens can report excessive industrial emissions would help authorities enforce pollution regulations more effectively.",
    likes: 15,
    comments: 6,
    category: "Technology"
  },
];

// Pre-defined questions by category
const predefinedQuestions = {
  "Transportation": [
    "Should we promote electric vehicles through tax incentives?",
    "Would car-free zones in city centers improve air quality?",
    "Should public transportation be free to reduce car usage?",
    "Should we implement congestion pricing in high-traffic areas?",
    "Would bike-sharing programs help reduce vehicle emissions?",
  ],
  "Green Spaces": [
    "Should we convert unused urban lots into community gardens?",
    "Would rooftop gardens on public buildings improve air quality?",
    "Should we require green spaces in new development projects?",
    "Would urban forests along highways help filter vehicle emissions?",
    "Should we protect existing green spaces from development?",
  ],
  "Technology": [
    "Would a network of air quality sensors help identify pollution hotspots?",
    "Should we develop a mobile app for reporting pollution incidents?",
    "Would smart traffic management systems reduce vehicle emissions?",
    "Should we invest in air purification systems for public spaces?",
    "Would real-time pollution alerts help people make healthier choices?",
  ],
  "Policy": [
    "Should industries near residential areas face stricter emission controls?",
    "Would tax breaks for companies with low carbon footprints be effective?",
    "Should we ban high-emission vehicles from certain areas?",
    "Would international cooperation on air quality standards help?",
    "Should polluting companies pay for public health consequences?",
  ],
  "Health": [
    "Should schools in high-pollution areas install air filtration systems?",
    "Would public health campaigns about air pollution impact behaviors?",
    "Should we subsidize air purifiers for vulnerable populations?",
    "Would more research on pollution's health effects lead to better policies?",
    "Should healthcare providers screen for pollution-related conditions?",
  ],
};

// Comment form schema
const commentSchema = z.object({
  author: z.string().min(1, { message: "Name is required" }),
  content: z.string().min(1, { message: "Comment cannot be empty" })
});

type Comment = {
  id: number;
  author: string;
  content: string;
  createdAt: Date;
};

type Idea = {
  id: number;
  title: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  category: string;
  likedBy: string[]; // Track who has liked this idea
  commentsList: Comment[]; // List of actual comments
};

const CommunityIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>(sampleIdeas.map(idea => ({
    ...idea,
    likedBy: [],
    commentsList: []
  })));
  const [author, setAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Transportation");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [filter, setFilter] = useState("all");
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState<number | null>(null);

  const commentForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      author: "",
      content: ""
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !author) {
      toast.error("Please select a question and enter your name");
      return;
    }
    
    const newIdea = {
      id: ideas.length + 1,
      title: selectedQuestion,
      author,
      content: selectedQuestion,
      likes: 0,
      comments: 0,
      category: selectedCategory,
      likedBy: [],
      commentsList: []
    };
    
    setIdeas([newIdea, ...ideas]);
    setAuthor("");
    setSelectedQuestion("");
    
    toast.success("Your idea has been shared with the community!");
  };

  const handleLike = (id: number) => {
    // Use a unique identifier (for simplicity, we'll use author name)
    // In a real app, you'd use user ID or similar
    const currentUser = "current-user"; 
    
    setIdeas(ideas.map(idea => {
      if (idea.id === id) {
        // Check if this user already liked the idea
        if (idea.likedBy.includes(currentUser)) {
          toast("You've already liked this idea!");
          return idea;
        }
        
        // Add to liked by array and increment like count
        return { 
          ...idea, 
          likes: idea.likes + 1,
          likedBy: [...idea.likedBy, currentUser]
        };
      }
      return idea;
    }));
    
    toast("You liked this idea!");
  };

  const openCommentDialog = (ideaId: number) => {
    setCurrentIdeaId(ideaId);
    setCommentDialogOpen(true);
  };

  const submitComment = (values: z.infer<typeof commentSchema>) => {
    if (!currentIdeaId) return;
    
    setIdeas(ideas.map(idea => {
      if (idea.id === currentIdeaId) {
        const newComment = {
          id: idea.commentsList.length + 1,
          author: values.author,
          content: values.content,
          createdAt: new Date()
        };
        
        return {
          ...idea,
          comments: idea.comments + 1,
          commentsList: [...idea.commentsList, newComment]
        };
      }
      return idea;
    }));
    
    commentForm.reset();
    setCommentDialogOpen(false);
    toast.success("Comment posted successfully!");
  };
  
  // Sort ideas by engagement (likes + comments) in descending order
  const sortedIdeas = [...ideas].sort((a, b) => {
    const engagementA = a.likes + a.comments;
    const engagementB = b.likes + b.comments;
    return engagementB - engagementA;
  });
  
  const filteredIdeas = filter === "all" 
    ? sortedIdeas 
    : sortedIdeas.filter(idea => idea.category.toLowerCase() === filter);
  
  const currentIdea = currentIdeaId ? ideas.find(idea => idea.id === currentIdeaId) : null;

  return (
    <ApiKeyProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container py-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Share Your Opinion
                  </CardTitle>
                  <CardDescription>
                    Select a question and share your thoughts with the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="author" className="text-sm font-medium">Your Name/Username</label>
                      <Input
                        id="author"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        placeholder="How should we identify you?"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select a Category</label>
                      <Tabs 
                        value={selectedCategory} 
                        onValueChange={setSelectedCategory}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-5 w-full">
                          <TabsTrigger value="Transportation" className="text-xs">Transport</TabsTrigger>
                          <TabsTrigger value="Green Spaces" className="text-xs">Green</TabsTrigger>
                          <TabsTrigger value="Technology" className="text-xs">Tech</TabsTrigger>
                          <TabsTrigger value="Policy" className="text-xs">Policy</TabsTrigger>
                          <TabsTrigger value="Health" className="text-xs">Health</TabsTrigger>
                        </TabsList>
                        
                        {Object.entries(predefinedQuestions).map(([category, questions]) => (
                          <TabsContent key={category} value={category} className="pt-4">
                            <RadioGroup
                              value={selectedQuestion}
                              onValueChange={setSelectedQuestion}
                            >
                              {questions.map((question, idx) => (
                                <div key={idx} className="flex items-start space-x-2 mb-3">
                                  <RadioGroupItem value={question} id={`question-${category}-${idx}`} />
                                  <Label 
                                    htmlFor={`question-${category}-${idx}`}
                                    className="text-sm font-normal cursor-pointer"
                                  >
                                    {question}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Share Opinion
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Filter Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={filter === "all" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setFilter("all")}
                    >
                      All
                    </Button>
                    <Button 
                      variant={filter === "transportation" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setFilter("transportation")}
                    >
                      Transportation
                    </Button>
                    <Button 
                      variant={filter === "green spaces" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setFilter("green spaces")}
                    >
                      Green Spaces
                    </Button>
                    <Button 
                      variant={filter === "technology" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setFilter("technology")}
                    >
                      Technology
                    </Button>
                    <Button 
                      variant={filter === "health" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setFilter("health")}
                    >
                      Health
                    </Button>
                    <Button 
                      variant={filter === "policy" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setFilter("policy")}
                    >
                      Policy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content - Ideas */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Users className="h-7 w-7" />
                  Community Ideas
                </h1>
                <div className="text-sm text-muted-foreground">
                  {filteredIdeas.length} ideas shared
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredIdeas.length > 0 ? (
                  filteredIdeas.map(idea => (
                    <Card key={idea.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{idea.title}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                              By {idea.author} · 
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {idea.category}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {idea.likes}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center ml-2">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {idea.comments}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between border-t pt-2 text-xs text-muted-foreground">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs flex items-center gap-1"
                          onClick={() => handleLike(idea.id)}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>{idea.likes} likes</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs flex items-center gap-1"
                          onClick={() => openCommentDialog(idea.id)}
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>{idea.comments} comments</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No ideas found in this category. Be the first to share one!
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Comments Dialog */}
        <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Comments</DialogTitle>
              <DialogDescription>
                {currentIdea && `Idea by ${currentIdea.author}: "${currentIdea.title}"`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="max-h-[300px] overflow-y-auto space-y-4 my-4">
              {currentIdea && currentIdea.commentsList.length > 0 ? (
                currentIdea.commentsList.map(comment => (
                  <div key={comment.id} className="border-b pb-3">
                    <div className="flex justify-between">
                      <p className="font-medium">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {comment.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-6">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
            
            <Form {...commentForm}>
              <form onSubmit={commentForm.handleSubmit(submitComment)} className="space-y-4">
                <FormField
                  control={commentForm.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={commentForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your comment here..." 
                          {...field} 
                          className="min-h-[80px]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCommentDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Post Comment</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </ApiKeyProvider>
  );
};

export default CommunityIdeas;
