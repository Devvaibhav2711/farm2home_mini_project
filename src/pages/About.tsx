import { Leaf, Users, TrendingUp, Heart } from 'lucide-react';
import aboutFarmerImage from '@/assets/about-farmer.jpg';

const About = () => {
  const values = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: 'Sustainability',
      description: 'We promote organic farming and sustainable agricultural practices'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community First',
      description: 'Supporting local farmers and building stronger communities'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Fair Trade',
      description: 'Ensuring fair prices for farmers and quality products for customers'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Quality Assured',
      description: 'Every product is inspected and quality-checked before delivery'
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About FreshFarm</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connecting local farmers with families, one fresh delivery at a time
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <img
              src={aboutFarmerImage}
              alt="Happy farmer"
              className="rounded-2xl shadow-hover w-full"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground text-lg mb-4">
              At FreshFarm, we believe in creating a direct connection between local farmers and urban families. 
              We're more than just a delivery service – we're building a sustainable ecosystem that benefits everyone.
            </p>
            <p className="text-muted-foreground text-lg mb-4">
              By eliminating middlemen and working directly with farmers, we ensure they receive fair compensation 
              while providing you with the freshest possible produce at competitive prices.
            </p>
            <p className="text-muted-foreground text-lg">
              Every order you place supports local agriculture, reduces food waste, and brings 
              farm-fresh nutrition directly to your table.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">How We Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Direct Sourcing</h3>
              <p className="text-muted-foreground">
                We partner with local farmers and buy fresh produce directly from their farms daily
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Check & Pack</h3>
              <p className="text-muted-foreground">
                Each product is carefully inspected, cleaned, and packed in our facility
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-muted-foreground">
                We deliver fresh produce to your doorstep within hours of harvest
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="gradient-hero rounded-2xl p-12 text-primary-foreground text-center">
          <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80">Partner Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-foreground/80">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-primary-foreground/80">Deliveries Made</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-foreground/80">Fresh Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
