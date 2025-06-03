
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, Timer, Zap } from 'lucide-react';
import type { Icon } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownUnitProps {
  value: number;
  label: string;
  IconComponent: Icon;
  isChanging: boolean;
}

const CountdownUnit: React.FC<CountdownUnitProps> = ({ value, label, IconComponent, isChanging }) => {
  return (
    <Card className="flex flex-col items-center justify-center p-4 md:p-6 shadow-lg w-full h-full">
      <CardHeader className="p-0 mb-2 md:mb-4">
        <CardTitle 
          className={`text-4xl md:text-6xl font-bold text-primary ${isChanging ? 'animate-number-change' : ''}`}
          key={value} // Trigger re-animation on value change
        >
          {String(value).padStart(2, '0')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex items-center text-sm md:text-lg text-muted-foreground">
        <IconComponent className="w-4 h-4 md:w-6 md:h-6 mr-2 text-accent" />
        {label}
      </CardContent>
    </Card>
  );
};


interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [prevTimeLeft, setPrevTimeLeft] = useState<TimeLeft>(timeLeft);
  const [isClient, setIsClient] = useState(false);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let newTimeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return newTimeLeft;
  }, [targetDate]);

  useEffect(() => {
    setIsClient(true);
    // Initial calculation
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);
    setPrevTimeLeft(initialTimeLeft);

    const timer = setInterval(() => {
      setPrevTimeLeft(current => {
        setTimeLeft(prev => {
          const newTime = calculateTimeLeft();
          // Only update prevTimeLeft if timeLeft actually changed to avoid unnecessary re-renders of prevTimeLeft state
          if (JSON.stringify(prev) !== JSON.stringify(newTime)) {
            return newTime;
          }
          return prev;
        });
        return timeLeft; // current timeLeft before update
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, timeLeft]); // Added timeLeft to dependencies to ensure prevTimeLeft is updated correctly

  if (!isClient) {
    // Render placeholder or null during SSR to avoid hydration mismatch
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 text-center animate-pulse">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="flex flex-col items-center justify-center p-4 md:p-6 shadow-lg w-full h-32 md:h-40">
            <div className="h-12 w-16 bg-muted rounded-md mb-2"></div>
            <div className="h-6 w-20 bg-muted rounded-md"></div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (+new Date(targetDate) - +new Date() <= 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-3xl md:text-5xl font-bold text-accent animate-pop-in">
          تهانينا للخريجين!
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mt-4">لقد وصل اليوم الكبير!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 text-center">
      <CountdownUnit value={timeLeft.days} label="أيام" IconComponent={CalendarDays} isChanging={timeLeft.days !== prevTimeLeft.days} />
      <CountdownUnit value={timeLeft.hours} label="ساعات" IconComponent={Clock} isChanging={timeLeft.hours !== prevTimeLeft.hours} />
      <CountdownUnit value={timeLeft.minutes} label="دقائق" IconComponent={Timer} isChanging={timeLeft.minutes !== prevTimeLeft.minutes} />
      <CountdownUnit value={timeLeft.seconds} label="ثواني" IconComponent={Zap} isChanging={timeLeft.seconds !== prevTimeLeft.seconds} />
    </div>
  );
};

export default CountdownTimer;
