
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  apiKey: z.string().min(30, {
    message: "API key must be at least 30 characters.",
  }),
});

const ApiKeyForm = () => {
  const { validateKey, isKeyValid } = useApiKey();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await validateKey(values.apiKey);
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-primary">OpenWeatherMap API Key</CardTitle>
        <CardDescription>
          Please enter your OpenWeatherMap API key to access air quality data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your OpenWeatherMap API key"
                      {...field}
                      className="font-mono"
                      type="password"
                    />
                  </FormControl>
                  <FormDescription>
                    You can get your API key by registering at{" "}
                    <a 
                      href="https://home.openweathermap.org/users/sign_up" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      OpenWeatherMap
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Validating..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
