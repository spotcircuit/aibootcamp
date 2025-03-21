
import { BUCKET_URL } from "@/lib/constants";

const images = [
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop", // AI technology
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop", // Digital code
  "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop", // AI discussion
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop", // Programming
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop", // Meeting room
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop", // Team collaboration
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop", // AI robot
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop", // Technology
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=800&auto=format&fit=crop"  // Tech learning
];

export default function BootcampGallery() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Bootcamp Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={image}
                alt={`Bootcamp preview ${index + 1}`}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
