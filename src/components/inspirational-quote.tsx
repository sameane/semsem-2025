
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fetchInspirationalQuote } from '@/app/actions';
import type { GenerateInspirationalQuoteOutput } from '@/ai/flows/generate-inspirational-quote';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InspirationalQuote: React.FC = () => {
  const [quoteData, setQuoteData] = useState<GenerateInspirationalQuoteOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const getQuote = useCallback(async () => {
    setLoading(true);
    setIsAnimating(false); // Reset animation state
    try {
      const data = await fetchInspirationalQuote({ topic: "graduation and future success" });
      setQuoteData(data);
      setIsAnimating(true); // Trigger animation for new quote
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      // Use a default quote in case of error
      setQuoteData({
        quote: "إذا كنت تعتقد أنك تستطيع، فقد قطعت نصف الطريق.",
        author: "Theodore Roosevelt"
      });
      setIsAnimating(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getQuote(); // Initial quote
    const interval = setInterval(() => {
      getQuote();
    }, 60000); // Fetch a new quote every 60 seconds

    return () => clearInterval(interval);
  }, [getQuote]);

  if (!quoteData && loading) {
    return (
      <Card className="mt-8 p-6 shadow-lg w-full max-w-2xl text-center animate-pulse">
        <CardContent>
          <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  if (!quoteData) {
    return null; // Or some error message
  }

  return (
    <Card className={`mt-8 p-6 shadow-lg w-full max-w-2xl text-center ${isAnimating ? 'animate-quote-fade-in' : ''}`}>
      <CardContent className="mb-0 pb-2">
        <blockquote className="text-lg md:text-xl italic text-foreground">
          &ldquo;{quoteData.quote}&rdquo;
        </blockquote>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-center pt-2 text-sm text-muted-foreground">
        <p className="sm:mr-4">- {quoteData.author}</p>
        <Button variant="ghost" size="sm" onClick={getQuote} disabled={loading} aria-label="Refresh quote" className="mt-2 sm:mt-0">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
           <span className="ml-2 sm:hidden">اقتباس جديد</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InspirationalQuote;
