// src/hooks/useAuth.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      const sess = data.session ?? null;
      if (!mounted) return;
      setSession(sess);
      if (sess?.user) {
        await fetchProfile(sess.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session?.session ?? null);
      if (session?.session?.user) fetchProfile(session.session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  async function fetchProfile(userId) {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error) setProfile(data);
    setLoading(false);
  }

  return { session, profile, loading, refreshProfile: () => session && fetchProfile(session.user.id) };
}
