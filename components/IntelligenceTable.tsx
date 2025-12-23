
import React from 'react';
import { AgencyWin } from '../types';

interface IntelligenceTableProps {
  data: AgencyWin[];
  isLoading: boolean;
}

export const IntelligenceTable: React.FC<IntelligenceTableProps> = ({ data, isLoading }) => {
  
  const handleExportCSV = () => {
    if (data.length === 0) return;
    const BOM = "\uFEFF";
    const headers = ["Agency", "Client", "Country", "Target Audience", "Source", "Date"];
    const csvRows = [headers.join(",")];

    data.forEach(row => {
        const values = [row.agency, row.client, row.country, row.targetAudience, row.source, row.date]
          .map(f => `"${String(f || "").replace(/"/g, '""')}"`);
        csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `rocket_intel_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (data.length === 0) return;
    
    // Dynamic import to reduce Unused JavaScript on initial load
    try {
      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable')
      ]);

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Rocket Insights: Market Intelligence Report", 14, 20);
      
      autoTable(doc, {
          startY: 30,
          head: [['Agency', 'Client', 'Country', 'Target Audience', 'Source']],
          body: data.map(row => [row.agency, row.client, row.country, row.targetAudience || 'General', row.source]),
          theme: 'grid',
          headStyles: { fillColor: [15, 23, 42] },
      });
      
      doc.save(`rocket_intel_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to load PDF engine. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-[2rem] p-20 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-6"></div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Executing Intelligence Pulse...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-slate-50 rounded-[2.5rem] p-20 border border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Registry Standby</h3>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider text-center max-w-xs">Define a target entity above to trigger an age-segmented market scan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50">
      <div className="px-10 py-6 border-b border-slate-100 bg-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Intelligence Registry</h2>
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{data.length} Signals</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV} 
            title="Export CSV"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
          <button 
            onClick={handleExportPDF} 
            title="Export PDF"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Agency</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Client</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Age/Demo</th>
              <th className="px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Market</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-10 py-6 whitespace-nowrap text-sm font-black text-slate-900">{row.agency}</td>
                <td className="px-10 py-6 whitespace-nowrap text-sm font-bold text-slate-600 underline decoration-indigo-200 decoration-2 underline-offset-4">{row.client}</td>
                <td className="px-10 py-6 whitespace-nowrap">
                  <span className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 uppercase tracking-widest border border-indigo-100">
                    {row.targetAudience || 'Gen. Public'}
                  </span>
                </td>
                <td className="px-10 py-6 whitespace-nowrap">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.country}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
