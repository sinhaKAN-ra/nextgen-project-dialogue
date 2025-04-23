import React, { useState, useEffect } from "react";

const ROICalculator = () => {
  // State for calculator inputs
  const [department, setDepartment] = useState("HR");
  const [teamSize, setTeamSize] = useState(5);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [avgHourlyRate, setAvgHourlyRate] = useState(65);
  const [implementationCost, setImplementationCost] = useState(10000);
  const [monthlySubscription, setMonthlySubscription] = useState(750);
  
  // State for calculated values
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);
  const [annualCost, setAnnualCost] = useState(0);
  const [roi, setRoi] = useState(0);
  const [paybackPeriod, setPaybackPeriod] = useState(0);
  
  // Department-specific efficiency factors (% of time saved)
  const efficiencyFactors = {
    "HR": 0.75,
    "Legal": 0.68,
    "Finance": 0.72,
    "Compliance": 0.80,
    "Project Management": 0.65
  };
  
  // Calculate ROI when inputs change
  useEffect(() => {
    // Calculate time saved per month (in hours)
    const weeklySavedHours = hoursPerWeek * efficiencyFactors[department];
    const monthlySavedHours = weeklySavedHours * 4.33; // Average weeks per month
    
    // Calculate monthly and annual financial savings
    const monthlySavings = monthlySavedHours * avgHourlyRate * teamSize;
    const annualSavings = monthlySavings * 12;
    
    // Calculate annual cost of Nomore.Report
    const annualCost = implementationCost + (monthlySubscription * 12);
    
    // Calculate ROI percentage: (Net Benefit / Cost) * 100
    const netBenefit = annualSavings - annualCost;
    const calculatedRoi = (netBenefit / annualCost) * 100;
    
    // Calculate payback period in months: Total Cost / Monthly Savings
    const totalCost = implementationCost + monthlySubscription;
    const calculatedPaybackPeriod = totalCost / monthlySavings;
    
    // Update state with calculated values
    setMonthlySavings(monthlySavings);
    setAnnualSavings(annualSavings);
    setAnnualCost(annualCost);
    setRoi(calculatedRoi);
    setPaybackPeriod(calculatedPaybackPeriod);
    
  }, [department, teamSize, hoursPerWeek, avgHourlyRate, implementationCost, monthlySubscription]);

  return (
    <div className="bg-gray-600 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">Calculate Your Department's ROI</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Side */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white">Department:</span>
              <select 
                className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="HR">HR</option>
                <option value="Legal">Legal</option>
                <option value="Finance">Finance</option>
                <option value="Compliance">Compliance</option>
                <option value="Project Management">Project Management</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white">Team Size:</span>
              <div className="flex space-x-2">
                <button 
                  className={`w-8 h-8 rounded ${teamSize === 5 ? 'bg-white/30' : 'bg-white/10'} text-white flex items-center justify-center`}
                  onClick={() => setTeamSize(5)}
                >5</button>
                <button 
                  className={`w-8 h-8 rounded ${teamSize === 10 ? 'bg-white/30' : 'bg-white/10'} text-white flex items-center justify-center`}
                  onClick={() => setTeamSize(10)}
                >10</button>
                <button 
                  className={`w-8 h-8 rounded ${teamSize === 25 ? 'bg-white/30' : 'bg-white/10'} text-white flex items-center justify-center`}
                  onClick={() => setTeamSize(25)}
                >25</button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white">Weekly Reporting Hours:</span>
              <input 
                type="range" 
                min="5" 
                max="30" 
                step="1"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-white ml-2 w-10 text-right">{hoursPerWeek}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white">Avg. Hourly Rate ($):</span>
              <input 
                type="number" 
                min="15" 
                max="250"
                value={avgHourlyRate}
                onChange={(e) => setAvgHourlyRate(parseInt(e.target.value))}
                className="w-24 bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
              />
            </div>
            
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <p className="text-white/80 text-sm">
                <strong>ROI Formula:</strong> ((Annual Savings - Annual Cost) / Annual Cost) × 100
              </p>
              <p className="text-white/80 text-sm mt-1">
                <strong>Where:</strong> Annual Savings = Weekly Hours × Efficiency Factor × Hourly Rate × Team Size × 52 weeks
              </p>
            </div>
          </div>
        </div>
        
        {/* Results Side */}
        <div className="bg-white/10 rounded-xl p-6 flex flex-col justify-center">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/80">Monthly Hours Saved:</span>
              <span className="text-white font-bold">{(hoursPerWeek * efficiencyFactors[department] * 4.33).toFixed(0)} hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Monthly Cost Savings:</span>
              <span className="text-white font-bold">${monthlySavings.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Annual Cost Savings:</span>
              <span className="text-white font-bold">${annualSavings.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Annual Platform Cost:</span>
              <span className="text-white font-bold">${annualCost.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
            </div>
            <div className="h-px bg-white/20 my-3"></div>
            <div className="flex justify-between">
              <span className="text-white font-medium">Annual ROI:</span>
              <span className="text-white font-bold text-xl">{roi.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white font-medium">Payback Period:</span>
              <span className="text-white font-bold">{paybackPeriod.toFixed(1)} months</span>
            </div>
          </div>
          
          <button disabled className="mt-6 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
            Get Your Custom ROI Report
          </button>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <h4 className="text-white font-medium mb-2">Department-Specific Efficiency Factors:</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.entries(efficiencyFactors).map(([dept, factor]) => (
            <div key={dept} className="bg-white/5 p-2 rounded text-center">
              <div className="text-white/70 text-xs">{dept}</div>
              <div className="text-white font-medium">{(factor * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;