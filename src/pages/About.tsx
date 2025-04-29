
import { ApiKeyProvider } from "@/contexts/ApiKeyContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Users, Map, BookOpen, MessageSquare, ChartLine } from "lucide-react";

const About = () => {
  return (
    <ApiKeyProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2 text-foreground">
                <Map className="h-8 w-8 text-primary" />
                <span>About ClearCity</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Real-time urban pollution tracking and community engagement platform
              </p>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="text-lg mb-4">
                  ClearCity is dedicated to providing accessible, real-time information about air quality in cities worldwide. 
                  We believe that increased awareness of air pollution levels is the first step toward cleaner, healthier urban environments.
                </p>
                <p className="text-lg">
                  By combining accurate scientific data with community engagement, we aim to empower citizens, researchers, and policymakers 
                  to make informed decisions that improve air quality and public health in urban areas.
                </p>
              </CardContent>
            </Card>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
              <Info className="h-6 w-6 text-primary" />
              Key Features
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    Interactive Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    Our Leaflet-powered interactive map allows users to view air quality data for any location globally. 
                    Simply click on the map to see real-time Air Quality Index (AQI) values and detailed pollutant information.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <ChartLine className="h-5 w-5 text-primary" />
                    Data Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    Using Recharts, we provide comprehensive visualizations of both historical and forecast air quality data,
                    allowing users to track trends and plan activities accordingly.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    City Guides
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    Our detailed city guides provide information on common pollutants, health recommendations, 
                    and environmental regulations specific to major cities around the world.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Community Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>
                    A collaborative platform where users can share and discuss innovative solutions for 
                    improving air quality in their communities and cities.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
              <Users className="h-6 w-6 text-primary" />
              Our Team
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              <Card>
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <Users className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-center">Rishan</CardTitle>
                  <CardDescription className="text-center">Team Member</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  <p>
                    Contributing expertise in environmental data analysis and visualization.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <Users className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-center">Keerthi</CardTitle>
                  <CardDescription className="text-center">Team Member</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  <p>
                    Focused on frontend development and user experience design.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <Users className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-center">Sathish</CardTitle>
                  <CardDescription className="text-center">Team Member</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  <p>
                    Specializing in data integration and API development.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <Users className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-center">Chinmay</CardTitle>
                  <CardDescription className="text-center">Team Member</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  <p>
                    Working on community engagement features and documentation.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Technology</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-4">
                  ClearCity is built using modern web technologies to ensure a fast, reliable,
                  and user-friendly experience:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Frontend:</strong> React, TypeScript, Tailwind CSS, Shadcn/UI
                  </li>
                  <li>
                    <strong>Data Management:</strong> TanStack Query (React Query)
                  </li>
                  <li>
                    <strong>Mapping:</strong> Leaflet for interactive maps
                  </li>
                  <li>
                    <strong>Data Visualization:</strong> Recharts for charts and graphs
                  </li>
                  <li>
                    <strong>API Integration:</strong> OpenWeatherMap Air Pollution API
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="mb-4">
                  We welcome feedback, questions, and collaboration opportunities. Please reach out to us at:
                </p>
                <p className="font-medium text-primary">rishanmenezes05@gmail.com</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ApiKeyProvider>
  );
};

export default About;
