
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';

const GraduatingFriends: React.FC = () => {
  // Placeholder for AI-generated or user-inputted friend list
  const friends = [
    // Example: { name: "Alex Doe", avatar: "https://picsum.photos/seed/alex/40/40" },
    //          { name: "Jamie Lee", avatar: "https://picsum.photos/seed/jamie/40/40" }
  ];

  return (
    <Card className="mt-8 p-6 shadow-lg w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold text-primary flex items-center">
          <Users className="w-6 h-6 mr-3 text-accent" />
          نحتفل معك
        </CardTitle>
      </CardHeader>
      <CardContent>
        {friends.length > 0 ? (
          <ul className="space-y-3">
            {friends.map((friend, index) => (
              <li key={index} className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={(friend as any).avatar} 
                  alt={`${(friend as any).name}'s avatar`} 
                  className="w-10 h-10 rounded-full mr-3 object-cover" 
                  data-ai-hint="person face"
                />
                <span className="text-foreground">{(friend as any).name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">
            شارك هذا العد التنازلي مع الأصدقاء الذين يتخرجون معك! التحديثات المستقبلية قد تسمح بإدراج الأسماء هنا.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GraduatingFriends;
