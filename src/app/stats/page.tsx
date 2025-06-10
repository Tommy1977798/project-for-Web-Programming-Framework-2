'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function StatsPage() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  // ===== 生成圖表數據 =====
  const monthlyData = books
    .filter(b => b.endDate)
    .reduce((acc: Record<string, number>, book) => {
      const month = new Date(book.endDate).toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
  const monthlyChart = Object.entries(monthlyData).map(([month, count]) => ({ month, count }));

  const statusData = books.reduce((acc: Record<string, number>, book) => {
    acc[book.status] = (acc[book.status] || 0) + 1;
    return acc;
  }, {});
  const statusChart = Object.entries(statusData).map(([status, value]) => ({ status, value }));

  const ratingData = books
    .filter(b => b.rating)
    .reduce((acc: Record<number, number>, book) => {
      const r = Math.floor(book.rating);
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {});
  const ratingChart = Object.entries(ratingData).map(([rating, count]) => ({ rating, count }));

  // —— 新增：标签频次
  const tagCounts = books.reduce((acc: Record<string, number>, b) => {
    (b.tags || []).forEach((t: string) => { acc[t] = (acc[t]||0) + 1 });
    return acc;
  }, {});
  const tagChart = Object.entries(tagCounts).map(([tag, count]) => ({ tag, count }));

  // —— 新增：类别分布
  const catCounts = books.reduce((acc: Record<string, number>, b) => {
    (b.categories || []).forEach((c: string) => { acc[c] = (acc[c]||0) + 1 });
    return acc;
  }, {});
  const catChart = Object.entries(catCounts).map(([category, value]) => ({ category, value }));

  const colors = ['#8884d8','#82ca9d','#ffc658','#ff7f50','#00c49f','#d0ed57','#a4de6c'];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12">
      <h1 className="text-2xl font-bold mb-4">📊 Reading Stats</h1>

      <section>
        <h2 className="text-lg font-semibold mb-2">Books Finished Per Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyChart}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Reading Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusChart}
              dataKey="value"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {statusChart.map((_, i) => (
                <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Rating Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratingChart}>
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#00c49f" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">📑 Tag Frequency</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tagChart}>
            <XAxis dataKey="tag" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ff7f50" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">📚 Category Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={catChart}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {catChart.map((_, i) => (
                <Cell key={`cell-cat-${i}`} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
