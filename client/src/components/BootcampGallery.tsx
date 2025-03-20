
import { BUCKET_URL } from "@/lib/constants";

const images = [
  "image_1742407702036.png",
  "image_1742408404985.png",
  "image_1742408440211.png",
  "image_1742408487798.png",
  "image_1742408546572.png",
  "image_1742408574966.png",
  "image_1742408591793.png",
  "image_1742408641990.png",
  "image_1742408666665.png",
  "image_1742408738311.png",
  "image_1742408756740.png",
  "image_1742408880727.png",
  "image_1742409548460.png",
  "image_1742409573981.png"
];

export default function BootcampGallery() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Bootcamp Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image) => (
            <div key={image} className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={`${BUCKET_URL}/images/bootcamp/${image}`}
                alt="Bootcamp preview"
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
