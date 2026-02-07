import { useAuth } from '@/contexts/AuthContext';

export function useAuthUser() {
  const { user, loading, signUp, signIn, signOut, refreshSession } = useAuth();

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };
}

export { useAuth };