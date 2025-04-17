import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from '@supabase/supabase-js';

// Install the required package by running the command: npm install @supabase/supabase-js or yarn add @supabase/supabase-js

const supabaseUrl = 'https://fzvibdpwsudvvissxxhn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dmliZHB3c3VkdnZpc3N4eGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NTM2MTcsImV4cCI6MjA1ODQyOTYxN30.hY1RukTPyWlvWq_OG68tLkD7E2j4bNgCPljEBDLbmaU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function addToNewsletter(data: any) {
  console.log(data);
  
  const { error } = await supabase
    .from('nomore_newsletter')
    .insert([
      {
        email: data.email,
        position: data.position,
        total_count: data.total_count,
      }
    ]);

  if (error) {
    console.error('Error adding to wishlist:', error);
  } else {
    console.log('Wishlist item added successfully');
  }
}

// lib/utils.ts - Add this function if you don't already have it

import { toast } from "@/components/ui/use-toast";

// Helper function to simplify sending toast notifications
export const sendToast = (
  message: string, 
  type: 'default' | 'success' | 'error' | 'warning' = 'default', 
  duration: number = 3000
) => {
  toast({
    title: type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Notification',
    description: message,
    variant: type === 'error' ? 'destructive' : type === 'warning' ? 'destructive' : 'default',
    duration: duration,
  });
};