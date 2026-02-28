'use client';

import { useCollection, useMemoFirebase, useFirestore, useUser, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, MoreVertical, Plus, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const db = useFirestore();
  const router = useRouter();
  const { user } = useUser();

  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: currentUserProfile } = useDoc<UserProfile>(profileRef);

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), orderBy('name'));
  }, [db]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  if (currentUserProfile && currentUserProfile.role !== 'MUNICIPAL_COMMISSIONER') {
    return (
      <div className="container mx-auto p-12 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-black uppercase italic text-slate-800">Access Restricted</h1>
        <p className="text-muted-foreground font-medium max-w-md mt-2">Only the Municipal Commissioner has authority to manage staff and officer assignments.</p>
        <Button className="mt-8 rounded-xl font-bold" onClick={() => router.push('/')}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary">Municipal Staff</h1>
          <p className="text-muted-foreground font-medium">Manage corporate access and officer assignments.</p>
        </div>
        <Button 
          className="font-black uppercase tracking-tighter italic rounded-xl px-8 gap-2"
          onClick={() => router.push('/signup')}
        >
          <Plus className="h-4 w-4" />
          Onboard Officer
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Staff Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-black uppercase text-[10px]">Officer</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Role</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Jurisdiction</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Email</TableHead>
                  <TableHead className="text-right font-black uppercase text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10">Syncing directory...</TableCell></TableRow>
                ) : users?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={u.photoURL || ''} />
                          <AvatarFallback className="text-[10px] bg-primary/5 text-primary font-bold">
                            {u.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
                        {u.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                        <MapPin className="h-3 w-3" />
                        {u.wardId ? `Ward ${u.wardId}` : u.zoneId ? `Zone ${u.zoneId}` : 'City Wide'}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-medium">
                      {u.email}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
