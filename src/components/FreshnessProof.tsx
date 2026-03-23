import { Award, Camera, Clock, Leaf, TruckIcon, CheckCircle } from 'lucide-react';

const FreshnessProof = () => {
  const certifications = [
    { icon: <Award className="h-8 w-8" />, title: 'FSSAI Certified', desc: 'All products meet food safety standards' },
    { icon: <Leaf className="h-8 w-8" />, title: 'Organic Certified', desc: 'Verified organic farming practices' },
    { icon: <CheckCircle className="h-8 w-8" />, title: 'Quality Tested', desc: 'Lab-tested for freshness & purity' },
  ];

  const farmImages = [
    { url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3c42?w=400&h=300&fit=crop', caption: 'Morning harvest at Green Valley' },
    { url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop', caption: 'Fresh vegetables from our farms' },
    { url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&h=300&fit=crop', caption: 'Organic farming practices' },
  ];

  const timeline = [
    { time: '5:00 AM', event: 'Harvest begins at partner farms', icon: <Leaf /> },
    { time: '7:00 AM', event: 'Quality check & packaging', icon: <CheckCircle /> },
    { time: '9:00 AM', event: 'Dispatch to delivery hub', icon: <TruckIcon /> },
    { time: '11:00 AM', event: 'Delivered fresh to your door', icon: <Clock /> },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Freshness Guarantee</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We take pride in delivering the freshest produce. Here's proof of our commitment to quality.
          </p>
        </div>

        {/* Certifications */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {certifications.map((cert, idx) => (
            <div key={idx} className="bg-card rounded-xl p-6 text-center shadow-card hover:shadow-hover transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                {cert.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
              <p className="text-muted-foreground">{cert.desc}</p>
            </div>
          ))}
        </div>

        {/* Farm Photos */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary" /> From Our Partner Farms
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {farmImages.map((img, idx) => (
              <div key={idx} className="group overflow-hidden rounded-xl">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-4 left-4 text-white font-medium">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Tracking Timeline */}
        <div className="bg-card rounded-2xl p-8 shadow-card">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" /> Farm to Table Journey
          </h3>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20" />
            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start relative">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 z-10">
                    {item.icon}
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-primary font-semibold">{item.time}</p>
                    <p className="text-lg font-medium">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreshnessProof;
