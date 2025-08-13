import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const TruckingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Data dari tabel
  const modalData = [
    { jenis: "Batu Split", modal: 385000000, pemasukan: 420000000, keuntungan: 35000000 },
    { jenis: "Pasir", modal: 411250000, pemasukan: 455000000, keuntungan: 43750000 }
  ];

  const overviewData = [
    { kategori: "Modal Kebutuhan", nilai: 796250000 },
    { kategori: "Pemasukan", nilai: 875000000 },
    { kategori: "Keuntungan Bersih", nilai: 78750000 }
  ];

  const profitSharingData = [
    { name: "Investor", value: 39375000, percentage: 50 },
    { name: "Pelaksana", value: 39375000, percentage: 50 }
  ];

  const operasionalData = [
    { jenis: "Batu Split", jumlahTruck: 10, hargaBeli: 220000, hargaJual: 240000, kubikPerTruck: 25 },
    { jenis: "Pasir", jumlahTruck: 10, hargaBeli: 235000, hargaJual: 260000, kubikPerTruck: 25 }
  ];

  const [calculatorInputs, setCalculatorInputs] = useState({
    material: '',
    volume: ''
  });
  const [calculatorResult, setCalculatorResult] = useState<number | null>(null);

  const handleCalculatorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCalculatorInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  const calculatePrice = () => {
    const { material, volume } = calculatorInputs;
    if (!material || !volume) {
      alert('Mohon lengkapi semua input kalkulator.');
      return;
    }

    const selectedMaterial = operasionalData.find(item => item.jenis === material);
    if (!selectedMaterial) {
      alert('Material tidak ditemukan.');
      return;
    }

    const volumeNum = parseFloat(volume);

    const totalPrice = selectedMaterial.hargaJual * volumeNum;
    setCalculatorResult(totalPrice);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: any) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: any) => (
            <p key={index} style={{color: entry.color}}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Bisnis Trucking</h1>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'profitability', label: 'Profitabilitas' },
            { id: 'operations', label: 'Operasional' },
            { id: 'profit-sharing', label: 'Bagi Hasil' },
            { id: 'price-calculator', label: 'Kalkulator Harga' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Key Metrics Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Total Modal</h3>
                <p className="text-3xl font-bold">{formatCurrency(796250000)}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Total Pemasukan</h3>
                <p className="text-3xl font-bold">{formatCurrency(875000000)}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Keuntungan Bersih</h3>
                <p className="text-3xl font-bold">{formatCurrency(78750000)}</p>
                <p className="text-sm mt-1 opacity-90">Margin: 9.0%</p>
              </div>
            </div>

            {/* Overview Bar Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Ringkasan Keuangan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="kategori" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                  <Bar dataKey="nilai" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ROI Calculation */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Return on Investment (ROI)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">ROI Percentage</span>
                  <span className="text-2xl font-bold text-green-600">9.89%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Payback Period</span>
                  <span className="text-lg font-semibold">~10.1 bulan</span>
                </div>
                <div className="text-sm text-gray-600 mt-4">
                  <p>• ROI = (Keuntungan Bersih / Total Modal) × 100%</p>
                  <p>• ROI = (78.750.000 / 796.250.000) × 100% = 9.89%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profitability Tab */}
        {activeTab === 'profitability' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Analisis Keuntungan per Material</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jenis" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                  <Legend />
                  <Bar dataKey="modal" fill="#EF4444" name="Modal" />
                  <Bar dataKey="pemasukan" fill="#10B981" name="Pemasukan" />
                  <Bar dataKey="keuntungan" fill="#8B5CF6" name="Keuntungan" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Margin Keuntungan</h3>
              <div className="space-y-4">
                {modalData.map((item, index) => {
                  const margin = ((item.keuntungan / item.pemasukan) * 100).toFixed(2);
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{item.jenis}</span>
                        <span className="font-bold text-green-600">{margin}%</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Modal: {formatCurrency(item.modal)}</p>
                        <p>Pemasukan: {formatCurrency(item.pemasukan)}</p>
                        <p>Keuntungan: {formatCurrency(item.keuntungan)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Operations Tab */}
        {activeTab === 'operations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Data Operasional</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Material</th>
                      <th className="text-right p-2">Truck</th>
                      <th className="text-right p-2">Kubik/Truck</th>
                      <th className="text-right p-2">Harga Beli</th>
                      <th className="text-right p-2">Harga Jual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operasionalData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{item.jenis}</td>
                        <td className="text-right p-2">{item.jumlahTruck}</td>
                        <td className="text-right p-2">{item.kubikPerTruck}</td>
                        <td className="text-right p-2">{formatCurrency(item.hargaBeli)}</td>
                        <td className="text-right p-2">{formatCurrency(item.hargaJual)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Efisiensi Harga</h3>
              <div className="space-y-4">
                {operasionalData.map((item, index) => {
                  const markup = item.hargaJual - item.hargaBeli;
                  const markupPercent = ((markup / item.hargaBeli) * 100).toFixed(2);
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">{item.jenis}</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Markup per kubik:</p>
                          <p className="font-bold">{formatCurrency(markup)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Markup %:</p>
                          <p className="font-bold text-green-600">{markupPercent}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Profit Sharing Tab */}
        {activeTab === 'profit-sharing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Pembagian Keuntungan</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={profitSharingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {profitSharingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Detail Bagi Hasil</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Keuntungan Bersih Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(78750000)}</p>
                </div>
                
                {profitSharingData.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.percentage}% dari keuntungan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold" style={{color: COLORS[index]}}>
                          {formatCurrency(item.value)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Price Calculator Tab */}
        {activeTab === 'price-calculator' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Kalkulator Harga Material</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="materialType" className="block text-sm font-medium text-gray-700">Jenis Material</label>
                <select
                  id="materialType"
                  name="materialType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={calculatorInputs.material}
                  onChange={handleCalculatorInputChange}
                >
                  <option value="">Pilih Material</option>
                  {operasionalData.map((item) => (
                    <option key={item.jenis} value={item.jenis}>{item.jenis}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="volume" className="block text-sm font-medium text-gray-700">Volume (Kubik)</label>
                <input
                  type="number"
                  id="volume"
                  name="volume"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  placeholder="Masukkan volume"
                  value={calculatorInputs.volume}
                  onChange={handleCalculatorInputChange}
                />
              </div>
            </div>
            <button
              onClick={calculatePrice}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold"
            >
              Hitung Harga
            </button>

            {calculatorResult && (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Estimasi Harga:</h4>
                <p className="text-3xl font-bold text-blue-900">{formatCurrency(calculatorResult)}</p>
                <p className="text-sm text-gray-600 mt-2">
                  *Estimasi ini berdasarkan harga jual per kubik material.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TruckingDashboard;