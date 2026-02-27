
'use client';

import { Task } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface TaskKanbanProps {
  tasks: Task[];
}

export function TaskKanban({ tasks }: TaskKanbanProps) {
  const db = useFirestore();

  const columns = [
    { id: 'open', title: 'Open', color: 'bg-slate-100' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50' },
  ];

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, 'tasks', taskId), {
      status: newStatus,
      updatedAt: Date.now(),
    });
  };

  const getPriorityColor = (p: Task['priority']) => {
    switch (p) {
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(col => (
        <div key={col.id} className={`rounded-xl p-4 min-h-[500px] border-t-4 ${col.color}`}>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-600">{col.title}</h3>
            <Badge variant="secondary" className="font-mono">
              {tasks.filter(t => t.status === col.id).length}
            </Badge>
          </div>
          
          <div className="space-y-4">
            {tasks.filter(t => t.status === col.id).map(task => (
              <Card key={task.id} className="group hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                      {task.title}
                    </h4>
                    <Badge variant="outline" className={`text-[8px] uppercase ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                  
                  <div className="pt-2 border-t flex flex-wrap gap-3 items-center text-[10px] text-muted-foreground font-medium">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {task.wardId}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(task.dueDate, 'MMM d')}
                    </div>
                    {task.status !== col.id && (
                      <button 
                        onClick={() => handleStatusChange(task.id!, col.id as Task['status'])}
                        className="ml-auto text-primary hover:underline"
                      >
                        Move Here
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
