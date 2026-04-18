"use client";
import { useState } from "react";

export default function Home() {
  const [product, setProduct] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!product) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      setResult("Error analyzing product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Product Analyzer</h1>
          <p className="text-sm text-gray-500">Enter a product name or URL to get an instant analysis.</p>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="e.g. Ergonomic Keyboard"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
            onChange={(e) => setProduct(e.target.value)}
            disabled={isLoading}
          />
          
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !product}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all 
              ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
          >
            {isLoading ? "Analyzing..." : "Analyze Product"}
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Analysis Result</h2>
            <p className="text-gray-800 leading-relaxed">{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}