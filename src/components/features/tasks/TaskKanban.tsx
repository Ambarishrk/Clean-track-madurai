
'use client';

import { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, ShieldAlert } from 'lucide-react';
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
    { id: 'open', title: 'Pending Action', color: 'border-status-red' },
    { id: 'in_progress', title: 'In Resolution', color: 'border-status-amber' },
    { id: 'completed', title: 'Verified Closed', color: 'border-status-green' },
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
      case 'high': return 'bg-red-50 text-red-700 border-red-100';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {columns.map(col => (
        <div key={col.id} className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="font-black text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full border-2 ${col.color.replace('border-', 'bg-')}`} />
              {col.title}
            </h3>
            <Badge variant="secondary" className="font-mono text-[10px] bg-slate-100 text-slate-600 rounded-md">
              {tasks.filter(t => t.status === col.id).length}
            </Badge>
          </div>
          
          <div className="space-y-4 min-h-[600px] p-2 rounded-[2rem] bg-slate-50/50 border border-slate-100">
            {tasks.filter(t => t.status === col.id).map(task => (
              <Card key={task.id} className="border-none shadow-sm hover:shadow-xl transition-all rounded-2xl bg-white group">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="font-bold text-sm leading-tight text-slate-800">
                      {task.title}
                    </h4>
                    <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-tighter ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                  
                  <div className="pt-4 border-t flex flex-wrap gap-3 items-center text-[9px] font-black uppercase tracking-tight text-muted-foreground">
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                      <User className="h-2.5 w-2.5" />
                      {task.wardId}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Calendar className="h-2.5 w-2.5" />
                      {format(task.dueDate, 'MMM d')}
                    </div>
                  </div>

                  {col.id !== 'completed' && (
                    <button 
                      onClick={() => handleStatusChange(task.id!, (col.id === 'open' ? 'in_progress' : 'completed') as Task['status'])}
                      className="w-full mt-2 py-2 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group"
                    >
                      Advance Status
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {tasks.filter(t => t.status === col.id).length === 0 && (
              <div className="h-40 flex flex-col items-center justify-center opacity-20 italic text-[10px] font-bold">
                <ShieldAlert className="h-8 w-8 mb-2" />
                Queue Clear
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
