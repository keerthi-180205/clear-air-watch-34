
import React, { useState } from "react";
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Users, ThumbsUp, MessageSquare, Lightbulb } from "lucide-react";

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

const CommunityIdeas = () => {
  const [ideas, setIdeas] = useState(sampleIdeas);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("General");
  const [filter, setFilter] = useState("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !author) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newIdea = {
      id: ideas.length + 1,
      title,
      author,
      content,
      likes: 0,
      comments: 0,
      category: category || "General"
    };
    
    setIdeas([newIdea, ...ideas]);
    setTitle("");
    setContent("");
    setAuthor("");
    setCategory("General");
    
    toast.success("Your idea has been shared with the community!");
  };

  const handleLike = (id: number) => {
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea
    ));
    toast("You liked this idea!");
  };
  
  const filteredIdeas = filter === "all" 
    ? ideas 
    : ideas.filter(idea => idea.category.toLowerCase() === filter);

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
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Share Your Idea
                  </CardTitle>
                  <CardDescription>
                    Contribute your suggestions for improving air quality in urban areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">Title</label>
                      <Input
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Give your idea a catchy title"
                        required
                      />
                    </div>
                    
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
                      <label htmlFor="category" className="text-sm font-medium">Category</label>
                      <select
                        id="category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="General">General</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Green Spaces">Green Spaces</option>
                        <option value="Technology">Technology</option>
                        <option value="Policy">Policy</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="content" className="text-sm font-medium">Your Idea</label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Describe your idea for improving urban air quality..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Share Idea
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
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">{idea.content}</p>
                      </CardContent>
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
                        <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
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
      </div>
    </ApiKeyProvider>
  );
};

export default CommunityIdeas;
