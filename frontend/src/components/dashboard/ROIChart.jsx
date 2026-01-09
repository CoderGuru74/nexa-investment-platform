import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export default function ROIChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground border border-dashed border-border rounded-lg">
        No ROI growth data available for this period
      </div>
    );
  }

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {/* Standard SVG defs work inside Recharts without an import */}
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(str) => {
            try {
              const date = new Date(str);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } catch (e) {
              return str;
            }
          }}
        />
        
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCurrency}
        />
        
        <Tooltip
          formatter={(value) => [formatCurrency(value), "Earned"]}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
        />
        
        <Area
          type="monotone"
          dataKey="amount"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorAmount)"
          dot={{ fill: 'hsl(var(--primary))', r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          name="ROI Earned"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}