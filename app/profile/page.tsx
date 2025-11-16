"use client";

import { motion } from "framer-motion";
import { User, Mail, Calendar, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/ui/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user } = useAuth();
  const { watchlist } = useWatchlist();
  const { history } = useWatchHistory();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <Navigation />
        
        <div className="pt-24 px-4 md:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Profile Header - Enhanced */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-gray-900 via-gray-900/95 to-red-900/20 border-gray-800 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-3xl font-bold text-white">My Profile</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-red-600/20 shadow-2xl">
                        <AvatarImage src={user?.photoURL || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-white text-4xl font-bold">
                          {user?.displayName?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {user?.displayName || "User"}
                        </h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{user?.email}</span>
                        </div>
                      </div>

                      {user?.metadata?.creationTime && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700">
                          <Calendar className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-gray-300">
                            Member since {new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="border-red-600/30 bg-red-600/10 hover:bg-red-600/20 text-white hover:border-red-600/50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats - Improved Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl" />
                  <CardContent className="pt-6 pb-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Items in List</p>
                        <p className="text-4xl font-bold text-white">{watchlist.length}</p>
                      </div>
                      <div className="w-14 h-14 bg-red-600/10 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl" />
                  <CardContent className="pt-6 pb-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Watched</p>
                        <p className="text-4xl font-bold text-white">{history.length}</p>
                      </div>
                      <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/5 rounded-full blur-3xl" />
                  <CardContent className="pt-6 pb-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Avg. Completion</p>
                        <p className="text-4xl font-bold text-white">
                          {Math.round(history.reduce((acc, item) => acc + item.progress, 0) / Math.max(history.length, 1))}%
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-green-600/10 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Account Actions */}
            <Card className="bg-gray-900/80 border-gray-800">
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-400">
                  Need to update your account details or have questions?
                </p>
                <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}

