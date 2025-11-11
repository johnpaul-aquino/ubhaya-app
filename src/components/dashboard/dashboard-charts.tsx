'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data for shipment trends
const shipmentTrendData = [
  { month: 'Jan', shipments: 65, onTime: 58 },
  { month: 'Feb', shipments: 72, onTime: 68 },
  { month: 'Mar', shipments: 78, onTime: 71 },
  { month: 'Apr', shipments: 85, onTime: 80 },
  { month: 'May', shipments: 92, onTime: 87 },
  { month: 'Jun', shipments: 88, onTime: 84 },
];

// Sample data for facility utilization
const facilityUtilizationData = [
  { name: 'Mumbai', utilization: 85, capacity: 100 },
  { name: 'Delhi', utilization: 72, capacity: 100 },
  { name: 'Bangalore', utilization: 68, capacity: 100 },
  { name: 'Chennai', utilization: 79, capacity: 100 },
  { name: 'Kolkata', utilization: 65, capacity: 100 },
];

// Sample data for shipment status distribution
const statusDistributionData = [
  { name: 'On Time', value: 68, color: '#10b981' },
  { name: 'Delayed', value: 18, color: '#f59e0b' },
  { name: 'In Transit', value: 10, color: '#3b82f6' },
  { name: 'Pending', value: 4, color: '#6b7280' },
];

// Sample data for daily activity
const dailyActivityData = [
  { day: 'Mon', contacts: 12, shipments: 8, tasks: 15 },
  { day: 'Tue', contacts: 18, shipments: 12, tasks: 10 },
  { day: 'Wed', contacts: 15, shipments: 10, tasks: 18 },
  { day: 'Thu', contacts: 22, shipments: 15, tasks: 12 },
  { day: 'Fri', contacts: 20, shipments: 18, tasks: 8 },
  { day: 'Sat', contacts: 8, shipments: 5, tasks: 5 },
  { day: 'Sun', contacts: 5, shipments: 3, tasks: 3 },
];

/**
 * Custom tooltip for charts
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-2 border border-border rounded-lg shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Shipment Trends Chart
 */
export function ShipmentTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={shipmentTrendData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              stroke="currentColor"
            />
            <YAxis
              className="text-xs"
              stroke="currentColor"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend className="text-xs" />
            <Line
              type="monotone"
              dataKey="shipments"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              name="Total Shipments"
            />
            <Line
              type="monotone"
              dataKey="onTime"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
              name="On-Time Delivery"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Facility Utilization Chart
 */
export function FacilityUtilizationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Utilization</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={facilityUtilizationData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              stroke="currentColor"
            />
            <YAxis
              className="text-xs"
              stroke="currentColor"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend className="text-xs" />
            <Bar
              dataKey="utilization"
              fill="hsl(var(--primary))"
              name="Current Utilization %"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Status Distribution Pie Chart
 */
export function StatusDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipment Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusDistributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Daily Activity Area Chart
 */
export function DailyActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyActivityData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
              className="text-xs"
              stroke="currentColor"
            />
            <YAxis
              className="text-xs"
              stroke="currentColor"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend className="text-xs" />
            <Area
              type="monotone"
              dataKey="contacts"
              stackId="1"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
              name="Contacts"
            />
            <Area
              type="monotone"
              dataKey="shipments"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Shipments"
            />
            <Area
              type="monotone"
              dataKey="tasks"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.6}
              name="Tasks"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}