
'use client';

import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { PredictiveAlert } from '@/lib/types';
import { Calendar, TrendingUp, ShieldAlert } from 'lucide-react';

export function PredictiveWarnings() {
  const db = useFirestore();

  const predictQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'predictive_alerts'), limit(3));
  }, [db]);

  const { data: predictions } = useCollection<PredictiveAlert>(predictQuery);

  if (!predictions || predictions.length === 0) {
    // Seed sample for visualization
    const mock = [
      { id: '1', eventName: 'Chithirai Festival', predictedTonnageIncrease: 45, alertType: 'festival_surge', recommendedAction: 'Deploy 5 additional compactors to Zone 2' },
      { id: '2', eventName: 'Monsoon Onset', predictedTonnageIncrease: 15, alertType: 'monsoon_risk', recommendedAction: 'Clear drain silt in Wards W001-W010' }
    ];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mock.map(p => (
          <div key={p.id} className="p-4 border rounded-xl bg-orange-50/30 border-orange-200">
            <div className="flex items-center gap-2 mb-2 text-orange-700">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-bold">{p.eventName}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-1 text-2xl font-black text-orange-900">
                <TrendingUp className="h-6 w-6" />
                +{p.predictedTonnageIncrease}%
              </div>
              <span className="text-[10px] font-bold uppercase text-orange-600">Predicted Tonnage Surge</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-orange-100 text-[10px] flex gap-2 items-start">
              <ShieldAlert className="h-3 w-3 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-orange-900">Action Plan:</span>
                <p className="text-muted-foreground">{p.recommendedAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div>Predictions Loaded</div>;
}
