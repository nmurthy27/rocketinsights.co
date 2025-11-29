import React from 'react';
import { AgencyWin } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface IntelligenceTableProps {
  data: AgencyWin[];
  isLoading: boolean;
}

export const IntelligenceTable: React.FC<IntelligenceTableProps> = ({ data, isLoading }) => {
  
  const handleExportCSV = () => {
    if (data.length === 0) return;
    
    // BOM for Excel UTF-8 compatibility
    const BOM = "\uFEFF";
    const headers = ["Agency", "Client", "Country", "Source", "Date"];
    const csvRows = [headers.join(",")];

    data.forEach(row => {
        const values = [
            row.agency,
            row.client,
            row.country,
            row.source,
            row.date
        ].map(field => {
            const stringField = String(field || "");
            // Escape quotes and wrap in quotes to handle commas within data
            return `"${stringField.replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `apac_market_intel_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (data.length === 0) return;

    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("APAC Market Intelligence Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Total Records: ${data.length}`, 14, 28);

    // Table
    autoTable(doc, {
        startY: 35,
        head: [['Agency', 'Client', 'Country', 'Source']],
        body: data.map(row => [row.agency, row.client, row.country, row.source]),
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] }, // Blue-600
        styles: { fontSize: 9 },
    });

    doc.save(`apac_market_intel_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 animate-pulse font-medium">Scanning Market Intelligence...</p>
        <p className="text-xs text-slate-400 mt-2">Searching top 16 APAC trade journals and data sources.</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-1">Ready to Scan</h3>
        <p className="text-slate-500 text-center max-w-md mt-2">
          <span className="font-semibold text-slate-700">Option 1:</span> Click "Run Weekly Scan" for the latest news from the past 7 days.
        </p>
        <p className="text-slate-500 text-center max-w-md mt-1">
          <span className="font-semibold text-slate-700">Option 2:</span> Enter an Agency, Client, or <span className="font-medium text-blue-600">Country</span> above to search Year-to-Date.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slate-800">Intelligence Results</h2>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
            {data.length} Found
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="mr-1.5 h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="mr-1.5 h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Agency</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Client</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Country (APAC)</th>
              {/* Keeping Source as a secondary column for verification */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Source</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{row.agency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{row.client}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {row.country}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(row.source + ' ' + row.agency + ' ' + row.client)}`} target="_blank" rel="noreferrer" className="hover:text-blue-500 hover:underline">
                    {row.source}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-400 flex justify-between">
         <span>Generated via Gemini Search Grounding</span>
         <span>Sources: Campaign Asia, Marketing-Interactive, The Drum, and 13 others</span>
      </div>
    </div>
  );
};