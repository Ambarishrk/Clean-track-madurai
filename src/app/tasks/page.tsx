
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { Task } from '@/lib/types';
import { TaskKanban } from '@/components/features/tasks/TaskKanban';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus, ListFilter } from 'lucide-react';
import { useState } from 'react';

export default function TasksPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [filter, setFilter] = useState<'all' | 'my'>('all');

  const tasksQuery = useMemoFirebase(() => {
    if (!db) return null;
    let base = collection(db, 'tasks');
    if (filter === 'my' && user) {
      return query(base, where('assignedTo', '==', user.uid), orderBy('createdAt', 'desc'));
    }
    return query(base, orderBy('createdAt', 'desc'));
  }, [db, user, filter]);

  const { data: tasks, isLoading } = useCollection<Task>(tasksQuery);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Corrective Tasks</h1>
          <p className="text-muted-foreground">Manage and track sanitation improvements across wards.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setFilter(filter === 'all' ? 'my' : 'all')}>
            <ListFilter className="h-4 w-4 mr-2" />
            {filter === 'all' ? 'Show My Tasks' : 'Show All'}
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-[600px] rounded-xl" />)}
        </div>
      ) : (
        <TaskKanban tasks={tasks || []} />
      )}
    </div>
  );
}
