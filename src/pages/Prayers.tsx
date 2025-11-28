import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const mockPrayers = [
  {
    id: 1,
    title: "Prayer for Strength and Courage",
    category: "Personal Growth",
    description: "A powerful prayer for those facing challenges and needing divine strength.",
  },
  {
    id: 2,
    title: "Prayer for Healing and Restoration",
    category: "Healing",
    description: "Seeking God's healing touch for physical, emotional, and spiritual restoration.",
  },
  {
    id: 3,
    title: "Prayer for Family and Loved Ones",
    category: "Family",
    description: "Interceding for protection, unity, and blessings over your family.",
  },
  {
    id: 4,
    title: "Prayer for Wisdom and Guidance",
    category: "Guidance",
    description: "Asking God for clarity, wisdom, and direction in decision-making.",
  },
  {
    id: 5,
    title: "Prayer for Financial Breakthrough",
    category: "Provision",
    description: "Trusting God for provision, abundance, and financial miracles.",
  },
  {
    id: 6,
    title: "Prayer for Spiritual Growth",
    category: "Spiritual Life",
    description: "Seeking deeper intimacy with God and spiritual maturity.",
  },
];

const Prayers = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-12 text-center animate-fade-in">
          <Heart className="h-16 w-16 mx-auto mb-4 text-secondary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Prayers</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guided prayers for every need. Let these words inspire your personal communion with God.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPrayers.map((prayer, index) => (
            <Card 
              key={prayer.id}
              className="hover:shadow-warm transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full mb-2">
                  {prayer.category}
                </div>
                <CardTitle className="text-xl">{prayer.title}</CardTitle>
                <CardDescription>{prayer.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <NavLink to={`/prayers/${prayer.id}`}>
                    Read Prayer
                  </NavLink>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Prayers;
