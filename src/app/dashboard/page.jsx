'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const dynamic = "force-dynamic";

export default function DashboardRedirect() {
  const router = useRouter();
    const { user, loading } = useAuth();

      useEffect(() => {
          if (!loading) {
                if (!user) {
                        router.push('/login');
                              } else {
                                      // Redirect based on role
                                              switch (user.role) {
                                                        case 'admin':
                                                                    router.push('/dashboard/admin');
                                                                                break;
                                                                                          case 'field-officer':
                                                                                                      router.push('/dashboard/field-officer');
                                                                                                                  break;
                                                                                                                            case 'customer':
                                                                                                                                        if (user.customerCategory) {
                                                                                                                                                      router.push(`/dashboard/customer/${user.customerCategory}`);
                                                                                                                                                                  } else {
                                                                                                                                                                                router.push('/profile/setup');
                                                                                                                                                                                            }
                                                                                                                                                                                                        break;
                                                                                                                                                                                                                  default:
                                                                                                                                                                                                                              router.push('/login');
                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                  }, [user, loading, router]);

                                                                                                                                                                                                                                                    return (
                                                                                                                                                                                                                                                        <div className="min-h-screen flex items-center justify-center">
                                                                                                                                                                                                                                                              <div className="text-center">
                                                                                                                                                                                                                                                                      <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
                                                                                                                                                                                                                                                                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                          } 
