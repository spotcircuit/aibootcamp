
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { uploadImage } from '@/lib/api';

export default function ImagesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: images } = useQuery({
    queryKey: ['/api/images'],
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }

        queryClient.invalidateQueries({ queryKey: ['/api/images'] });
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="max-w-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {images?.map((image: any) => (
              <div key={image.id} className="relative group">
                <img
                  src={`${import.meta.env.VITE_S3_BUCKET_URL}/${image.path}`}
                  alt={image.filename}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white">
                  {image.filename}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
