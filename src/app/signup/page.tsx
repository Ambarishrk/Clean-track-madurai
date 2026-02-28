'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, ShieldCheck, Mail, Lock, User, MapPin } from 'lucide-react';
import { WARD_IDS, ZONES } from '@/lib/constants';
import { UserRole } from '@/lib/types';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'WARD_SUPERVISOR' as UserRole,
    zoneId: '',
    wardId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    setIsLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Create Firestore profile
      const profileData = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        zoneId: formData.zoneId || null,
        wardId: formData.wardId || null,
        photoURL: null,
        phone: '',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };

      await setDoc(doc(db, 'users', user.uid), profileData);
      
      toast({ title: "Account Created", description: "Staff onboarded successfully." });
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({ 
        title: "Registration Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent scale-150" />
      </div>

      <Card className="w-full max-w-xl border-none shadow-2xl overflow-hidden rounded-2xl z-10">
        <div className="bg-primary p-8 text-center text-primary-foreground relative">
          <div className="absolute top-0 right-0 p-4 opacity-20"><ShieldCheck className="h-20 w-20" /></div>
          <h1 className="text-3xl font-black tracking-tighter mb-1 uppercase italic">Staff Onboarding</h1>
          <p className="text-primary-foreground/70 text-xs font-bold tracking-widest uppercase">Madurai Municipal Governance</p>
        </div>
        
        <CardHeader className="pt-6 text-center">
          <CardTitle className="text-xl font-bold">New Officer Entry</CardTitle>
          <CardDescription>Enter details to provision a new staff account</CardDescription>
        </CardHeader>

        <CardContent className="pb-8 space-y-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Officer Name"
                    className="pl-10 h-10 rounded-xl"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="governance@cleantrack.in"
                    className="pl-10 h-10 rounded-xl"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Initial Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-10 rounded-xl"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Officer Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(val: UserRole) => setFormData({...formData, role: val})}
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MUNICIPAL_COMMISSIONER">Municipal Commissioner</SelectItem>
                    <SelectItem value="ZONAL_OFFICER">Zonal Officer</SelectItem>
                    <SelectItem value="WARD_SUPERVISOR">Ward Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.role === 'ZONAL_OFFICER' || formData.role === 'WARD_SUPERVISOR') && (
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Zone Assignment</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <Select 
                      value={formData.zoneId} 
                      onValueChange={(val) => setFormData({...formData, zoneId: val})}
                    >
                      <SelectTrigger className="h-10 pl-10 rounded-xl">
                        <SelectValue placeholder="Select Zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {ZONES.map(z => <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {formData.role === 'WARD_SUPERVISOR' && (
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Ward Assignment</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <Select 
                      value={formData.wardId} 
                      onValueChange={(val) => setFormData({...formData, wardId: val})}
                    >
                      <SelectTrigger className="h-10 pl-10 rounded-xl">
                        <SelectValue placeholder="Select Ward" />
                      </SelectTrigger>
                      <SelectContent>
                        {WARD_IDS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 mt-6 rounded-xl font-black uppercase italic tracking-tighter" 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Complete Onboarding
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account? <Button variant="link" className="p-0 h-auto font-bold text-primary" onClick={() => router.push('/login')}>Login here</Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
