import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Clock,
  Calendar,
  Filter,
  Send,
  Printer,
  Mail
} from 'lucide-react';
import { ResolutionDialogProps, Resolution } from '../types/trading';

const ResolutionDialog = ({ breakItem, onClose, onResolve }: ResolutionDialogProps) => {
  const [resolution, setResolution] = useState<Resolution>({
    action: '',
    notes: '',
    adjustment: ''
  });

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <h4 className="font-medium">Resolve Break #{breakItem.id}</h4>
      
      <div>
        <label className="block text-sm text-gray-400 mb-1">Resolution Action</label>
        <select 
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
          value={resolution.action}
          onChange={(e) => setResolution({ ...resolution, action: e.target.value })}
        >
          <option value="">Select action...</option>
          <option value="adjust_internal">Adjust Internal Record</option>
          <option value="adjust_external">Adjust External Record</option>
          <option value="cancel">Cancel Trade</option>
          <option value="ignore">Mark as Reconciled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Adjustment Value</label>
        <input
          type="number"
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
          value={resolution.adjustment}
          onChange={(e) => setResolution({ ...resolution, adjustment: e.target.value })}
          placeholder="Enter adjustment amount..."
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Resolution Notes</label>
        <textarea
          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
          rows={3}
          value={resolution.notes}
          onChange={(e) => setResolution({ ...resolution, notes: e.target.value })}
          placeholder="Enter resolution details..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-3 py-2 text-gray-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={() => onResolve(resolution)}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Resolve Break
        </button>
      </div>
    </div>
  );
};

export const ReportingTools = () => {
  const [selectedReport, setSelectedReport] = useState<{
    id: string;
    name: string;
    description: string;
    format: string;
    schedule: string;
  } | null>(null);
  const [dateRange, setDateRange] = useState('today');
  const [selectedBreak, setSelectedBreak] = useState<{id: string} | null>(null);
  
  const handleResolveBreak = (resolution: Resolution) => {
    console.log('Resolving break:', resolution);
    setSelectedBreak(null);
  };

  const reports = [
    {
      id: 'daily_summary',
      name: 'Daily Trading Summary',
      description: 'End of day summary with P&L and position changes',
      format: 'PDF',
      schedule: 'Daily'
    },
    {
      id: 'risk_exposure',
      name: 'Risk Exposure Report',
      description: 'Detailed analysis of current risk metrics and exposure',
      format: 'Excel',
      schedule: 'Weekly'
    },
    {
      id: 'recon_breaks',
      name: 'Reconciliation Breaks',
      description: 'List of all unresolved reconciliation breaks',
      format: 'Excel',
      schedule: 'Daily'
    },
    {
      id: 'performance',
      name: 'Performance Attribution',
      description: 'Detailed breakdown of portfolio performance',
      format: 'PDF',
      schedule: 'Monthly'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Report Generation</h3>
          <p className="text-sm text-gray-400">Generate and schedule automated reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="bg-gray-800 text-white px-3 py-2 rounded-lg"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-gray-900/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Recent Breaks</h3>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
              <div>
                <div className="font-medium">Trade #{1001 + i}</div>
                <div className="text-sm text-gray-400">Quantity mismatch</div>
              </div>
              <button 
                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm"
                onClick={() => setSelectedBreak({ id: `${1001 + i}` })}
              >
                Resolve
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {reports.map((report) => (
          <div 
            key={report.id}
            className="bg-gray-900/50 p-4 rounded-lg hover:bg-gray-800/50 cursor-pointer"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{report.name}</h4>
                <p className="text-sm text-gray-400">{report.description}</p>
              </div>
              <span className="px-2 py-1 bg-gray-800 rounded text-xs">
                {report.format}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {report.schedule}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Report Actions</h4>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
              <Printer className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
              <Mail className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Recipients</label>
              <input
                type="text"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg"
                placeholder="Enter email addresses..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Format</label>
              <select className="bg-gray-800 text-white px-3 py-2 rounded-lg">
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Schedule</label>
            <div className="grid grid-cols-4 gap-2">
              <button className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                Daily
              </button>
              <button className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                Weekly
              </button>
              <button className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                Monthly
              </button>
              <button className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                Custom
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedBreak && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-lg">
            <ResolutionDialog
              breakItem={selectedBreak}
              onClose={() => setSelectedBreak(null)}
              onResolve={handleResolveBreak}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ScheduledReport {
  id: number;
  report: string;
  frequency: string;
  time: string;
  recipients: string[];
  format: string;
  lastRun: string;
  nextRun: string;
}

export const ReportScheduler = () => {
  const [schedules, setSchedules] = useState<ScheduledReport[]>([
    {
      id: 1,
      report: 'Daily Trading Summary',
      frequency: 'Daily',
      time: '18:00',
      recipients: ['trading@example.com'],
      format: 'PDF',
      lastRun: '2024-02-15T18:00:00Z',
      nextRun: '2024-02-16T18:00:00Z'
    }
  ]);

  return (
    <div className="bg-gray-900/30 rounded-lg overflow-hidden">
      <div className="grid grid-cols-6 gap-4 p-4 text-sm text-gray-400 border-b border-gray-800">
        <div>Report</div>
        <div>Frequency</div>
        <div>Time</div>
        <div>Recipients</div>
        <div>Last Run</div>
        <div>Next Run</div>
      </div>
      
      <div className="divide-y divide-gray-800">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="grid grid-cols-6 gap-4 p-4 text-sm hover:bg-gray-800/30">
            <div className="font-medium">{schedule.report}</div>
            <div>{schedule.frequency}</div>
            <div>{schedule.time}</div>
            <div className="truncate">{schedule.recipients.join(', ')}</div>
            <div>{new Date(schedule.lastRun).toLocaleString()}</div>
            <div>{new Date(schedule.nextRun).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};