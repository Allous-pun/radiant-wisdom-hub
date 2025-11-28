import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";

const PrayerDetail = () => {
  const { id } = useParams();

  // Mock data - replace with API call
  const prayer = {
    id,
    title: "Prayer for Strength and Courage",
    category: "Personal Growth",
    content: `
      <p class="text-lg mb-6 italic text-muted-foreground">
        When you feel weak and overwhelmed, remember that God's strength is made perfect in your weakness. 
        This prayer will help you tap into divine power and courage.
      </p>

      <div class="space-y-6">
        <p>
          <strong>Heavenly Father,</strong><br/>
          I come before You today acknowledging my need for Your strength. I confess that in my own power, 
          I am weak, but I know that in You, I am made strong. Your Word says that those who wait upon You 
          shall renew their strength; they shall mount up with wings like eagles.
        </p>

        <p>
          Lord, I ask for courage to face the challenges before me. Remove every spirit of fear and anxiety 
          from my heart. Replace them with boldness and confidence that comes from knowing You are with me. 
          Help me to remember that You have not given me a spirit of fear, but of power, love, and a sound mind.
        </p>

        <p>
          When I am tempted to give up, remind me of Your faithfulness. When I feel like I cannot go on, 
          carry me in Your arms. When doubt tries to creep in, speak Your truth over my life. I declare that 
          I can do all things through Christ who strengthens me.
        </p>

        <p>
          Fill me afresh with Your Holy Spirit. Let Your power flow through me. Help me to walk in the 
          authority You have given me as Your child. I refuse to be moved by what I see or feel, but I 
          choose to stand firm on Your promises.
        </p>

        <p>
          Thank You, Father, for being my refuge and strength, a very present help in times of trouble. 
          Thank You for the victory that is already mine in Christ Jesus. I trust in You completely.
        </p>

        <p>
          <strong>In Jesus' mighty name, Amen.</strong>
        </p>
      </div>

      <div class="mt-8 p-6 bg-muted rounded-lg">
        <h3 class="font-semibold text-lg mb-3">Scriptures to Meditate On:</h3>
        <ul class="space-y-2 text-sm">
          <li><strong>Isaiah 40:31</strong> - "But those who wait on the Lord shall renew their strength..."</li>
          <li><strong>2 Timothy 1:7</strong> - "For God has not given us a spirit of fear..."</li>
          <li><strong>Philippians 4:13</strong> - "I can do all things through Christ who strengthens me."</li>
          <li><strong>Psalm 46:1</strong> - "God is our refuge and strength, a very present help in trouble."</li>
        </ul>
      </div>
    `,
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-4xl mx-auto animate-fade-in">
        <Button variant="ghost" className="mb-6" asChild>
          <NavLink to="/prayers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Prayers
          </NavLink>
        </Button>

        <Card>
          <CardContent className="pt-8">
            <Heart className="h-12 w-12 text-secondary mb-4" />
            <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full mb-3">
              {prayer.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-8">{prayer.title}</h1>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: prayer.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrayerDetail;
