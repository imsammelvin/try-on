import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2 } from "lucide-react";

const Index = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!baseImage || !outfitImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both your photo and the outfit image.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('virtual-tryon', {
        body: { baseImage, outfitImage, userPrompt }
      });

      if (error) throw error;

      if (data?.image) {
        setGeneratedImage(data.image);
        toast({
          title: "Success!",
          description: "Your virtual try-on is ready!",
        });
      } else {
        throw new Error("No image returned from API");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate try-on. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-fashion py-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold text-primary-foreground tracking-tight">
              FitRoom
            </h1>
            <p className="text-2xl md:text-3xl text-primary-foreground/80 font-semibold">
              Virtual Try-On Studio
            </p>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              See yourself in any outfit instantly with AI-powered fashion technology
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload Section */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-card rounded-xl p-6 shadow-glow border border-border">
              <ImageUpload
                label="Your Photo"
                onImageSelect={setBaseImage}
                selectedImage={baseImage}
              />
            </div>

            <div className="bg-card rounded-xl p-6 shadow-glow border border-border">
              <ImageUpload
                label="Outfit Image"
                onImageSelect={setOutfitImage}
                selectedImage={outfitImage}
              />
            </div>

            <div className="bg-card rounded-xl p-6 shadow-glow border border-border">
              <label className="text-sm font-medium text-foreground mb-3 block">
                Styling Instructions (Optional)
              </label>
              <Input
                placeholder="e.g., Make it more formal, adjust fit..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !baseImage || !outfitImage}
              className="w-full h-14 text-lg font-semibold bg-gradient-fashion hover:opacity-90 transition-all shadow-glow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Try-On
                </>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-card rounded-xl p-6 shadow-glow border border-border h-full">
              <h2 className="text-2xl font-bold text-foreground mb-6">Your Virtual Try-On</h2>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[500px] space-y-6">
                  <div className="relative">
                    {/* Outer spinning ring */}
                    <div className="w-32 h-32 border-4 border-primary/20 rounded-full absolute animate-spin" style={{ animationDuration: '3s' }}></div>
                    {/* Middle spinning ring */}
                    <div className="w-24 h-24 border-4 border-primary/40 border-t-transparent rounded-full absolute top-4 left-4 animate-spin" style={{ animationDuration: '2s' }}></div>
                    {/* Inner spinning ring */}
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full absolute top-8 left-8 animate-spin" style={{ animationDuration: '1s' }}></div>
                    {/* Center sparkle icon */}
                    <div className="absolute top-12 left-12 w-8 h-8 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                  </div>

                  {/* Animated loading messages */}
                  <div className="space-y-3 text-center">
                    <p className="text-lg font-semibold text-foreground animate-pulse">
                      Creating your perfect look...
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md">
                      AI is analyzing your images and styling the perfect outfit for you
                    </p>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="space-y-4">
                  <img
                    src={generatedImage}
                    alt="Generated try-on"
                    className="w-full rounded-lg shadow-xl"
                  />
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedImage;
                      link.download = 'virtual-tryon.png';
                      link.click();
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
                  <Sparkles className="w-16 h-16 text-muted-foreground/50" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground">
                      Upload your images to begin
                    </p>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Your AI-powered virtual try-on will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
