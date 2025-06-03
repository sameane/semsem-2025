import CountdownTimer from '@/components/countdown-timer';
import InspirationalQuote from '@/components/inspirational-quote';
import GraduatingFriends from '@/components/graduating-friends';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';

export default function GraduationCountdownPage() {
  const targetDate = "2025-06-04T11:00:00"; // أو أي تاريخ موجود حالياً

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-background pattern-bg">
        <div className="absolute inset-0 z-0 opacity-10">
            <Image 
              src="https://picsum.photos/seed/graduationPattern/1920/1080" 
              alt="Abstract background pattern"
              layout="fill"
              objectFit="cover"
              quality={50}
              data-ai-hint="abstract pattern"
            />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl">
          <div className="mb-8 md:mb-12 animate-pop-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight">
            🥨العد التنازلي للتخرج يا
            </h1>
            <p className="mt-3 text-lg sm:text-xl md:text-2xl text-muted-foreground">
              اللمسة الأخيرة نحو حدث لا ينسى!
            </p>
          </div>
          
          <div className="w-full mb-8 md:mb-12">
            <CountdownTimer targetDate={targetDate} />
          </div>

          <div className="w-full mb-8 md:mb-12">
            <InspirationalQuote />
          </div>
          
          <div className="w-full">
            <GraduatingFriends />
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
}
