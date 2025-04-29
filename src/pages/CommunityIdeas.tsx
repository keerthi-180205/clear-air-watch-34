
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

const CommunityIdeas = () => {
  const [ideas, setIdeas] = useState(sampleIdeas);
  const [author, setAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Transportation");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [filter, setFilter] = useState("all");

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
      category: selectedCategory
    };
    
    setIdeas([newIdea, ...ideas]);
    setAuthor("");
    setSelectedQuestion("");
    
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
