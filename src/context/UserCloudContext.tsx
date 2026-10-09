import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type UserCloudContextType = {
  user: User | null;
  profile: any | null;
  bookings: any[];
  roomVisits: any[];
  liquidationDeals: any[];
  activityLogs: any[];
  tokenBalance: number;
  isLoading: boolean;
};

const UserCloudContext = createContext<UserCloudContextType>({
  user: null,
  profile: null,
  bookings: [],
  roomVisits: [],
  liquidationDeals: [],
  activityLogs: [],
  tokenBalance: 0,
  isLoading: true,
});

export const useUserCloud = () => useContext(UserCloudContext);

export const UserCloudProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [roomVisits, setRoomVisits] = useState<any[]>([]);
  const [liquidationDeals, setLiquidationDeals] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setIsLoading(false);
      }
    });

    // 2. Auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadUserData = async () => {
      if (!user) {
        if (isMounted) {
          setProfile(null);
          setBookings([]);
          setRoomVisits([]);
          setLiquidationDeals([]);
          setActivityLogs([]);
          setTokenBalance(0);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      
      try {
        const [
          { data: profileData },
          { data: bookingsData },
          { data: visitsData },
          { data: dealsData },
          { data: logsData },
          { data: walletData },
        ] = await Promise.all([
          supabase.from('user_profiles').select('*').eq('id', user.id).single(),
          supabase.from('stash_bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('room_inquiries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('liquidation_claims').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('user_activity_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('meal_wallets').select('token_balance').eq('user_id', user.id).maybeSingle(),
        ]);
        
        if (isMounted) {
          if (profileData) setProfile(profileData);
          if (bookingsData) setBookings(bookingsData);
          if (visitsData) setRoomVisits(visitsData);
          if (dealsData) setLiquidationDeals(dealsData);
          if (logsData) setActivityLogs(logsData);
          if (walletData) setTokenBalance(walletData.token_balance || 0);
        }
      } catch (err) {
        console.error('Error loading cloud context:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadUserData();
    return () => { isMounted = false; };
  }, [user]);

  return (
    <UserCloudContext.Provider value={{ user, profile, bookings, roomVisits, liquidationDeals, activityLogs, tokenBalance, isLoading }}>
      {children}
    </UserCloudContext.Provider>
  );
};

