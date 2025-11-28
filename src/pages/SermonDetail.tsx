import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";

const SermonDetail = () => {
  const { id } = useParams();

  // Mock data - replace with API call
  const sermon = {
    id,
    title: "Walking in Faith: A Journey of Trust",
    scripture: "Hebrews 11:1-6",
    date: "March 15, 2024",
    duration: "45 min",
    content: `
      <h2>Introduction</h2>
      <p>Faith is not just a concept we believe in; it is the very foundation upon which we build our lives as believers. 
      The Bible tells us that "faith is the substance of things hoped for, the evidence of things not seen" (Hebrews 11:1). 
      Today, we will explore what it means to walk in faith and trust God completely.</p>

      <h2>1. Understanding Biblical Faith</h2>
      <p>Faith goes beyond intellectual agreement. It is a confident trust in God's character, His promises, and His Word. 
      When we exercise faith, we are saying "yes" to God even when circumstances seem impossible.</p>

      <h2>2. Examples of Faith in Scripture</h2>
      <p>Throughout the Bible, we see powerful examples of men and women who walked by faith:</p>
      <ul>
        <li>Abraham believed God and left his homeland without knowing where he was going</li>
        <li>Moses chose to suffer with God's people rather than enjoy the pleasures of sin</li>
        <li>Rahab protected the spies because she believed in the God of Israel</li>
      </ul>

      <h2>3. Growing Your Faith</h2>
      <p>Faith grows through consistent spiritual practices:</p>
      <ul>
        <li>Regular study of God's Word</li>
        <li>Prayer and communion with God</li>
        <li>Fellowship with other believers</li>
        <li>Acting on what you believe</li>
      </ul>

      <h2>4. Walking by Faith Daily</h2>
      <p>Living by faith means making daily decisions to trust God rather than relying solely on what we see or feel. 
      It means choosing His way even when it doesn't make sense to our natural mind.</p>

      <h2>Conclusion</h2>
      <p>As we conclude, remember that without faith it is impossible to please God. But when we choose to walk in faith, 
      trusting Him completely, we position ourselves for His miraculous intervention in our lives. Let us be a people who 
      walk by faith and not by sight, trusting that He who began a good work in us will complete it.</p>

      <h2>Prayer</h2>
      <p>Father, increase our faith. Help us to trust You in every situation and to walk confidently in Your promises. 
      Give us the courage to step out in faith even when we cannot see the full picture. In Jesus' name, Amen.</p>
    `,
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-4xl mx-auto animate-fade-in">
        <Button variant="ghost" className="mb-6" asChild>
          <NavLink to="/sermons">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sermons
          </NavLink>
        </Button>

        <Card>
          <CardContent className="pt-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{sermon.title}</h1>
            <p className="text-xl text-secondary mb-4">{sermon.scripture}</p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{sermon.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{sermon.duration}</span>
              </div>
            </div>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: sermon.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SermonDetail;
