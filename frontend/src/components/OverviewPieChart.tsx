import { formatNumber } from "@/services/TextFormatService";
import { SetStateAction, useState } from "react";
import { ResponsiveContainer, Pie, PieChart, Cell, Sector, Tooltip, TooltipProps } from "recharts";

interface ValueProps {
  data: Data[]
}

interface Data {
  name: string;
  quantity: number;
  value: number;
}

const OverviewPieChart: React.FC<ValueProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_: any, index: SetStateAction<any>) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  function getTotalValue(): number {
    return data.reduce((acc, entry) => acc + entry.value, 0);
  }

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({active, payload}) => {
    if (active && payload && payload.length > 0 && payload[0].value) {
      const percentage = ((payload[0].value / getTotalValue()) * 100).toFixed(2);
      return (
        <div className="tooltip-container p-1 text-white">
          <span>{percentage}%</span>
        </div>
      );
    }
    return null;
  };

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value, name, quantity
    } = props;
    
    return (
      <g>
        <text 
          x="50%"
          y="50%"
          dy={0}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
        > 
          {formatNumber(value, 2)} €
        </text>
        <text 
          x="50%"
          y="50%"
          dy={16}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#B4B4B4"
          fontSize={14}
        > 
          { name }
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#ffffff" 
          strokeWidth={2}
        />
      </g>
    );
  };
    return (
        <div style={{ width: "200px", height: "200px" }}>
          <ResponsiveContainer>
            <PieChart>
                <Pie
                  activeIndex={activeIndex === null ? undefined : activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#9353D3"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  stroke="#ffffff" 
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={activeIndex === index ? "#69318F" : "#9353d3"} />
                  ))}
                </Pie>
                <Tooltip offset={8} content={<CustomTooltip />} />
                {activeIndex === null && (
                    <text
                      x="50%"
                      y="50%"
                      dy={4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                    >
                      {formatNumber(getTotalValue(), 2)} €
                    </text>
                )}      
            </PieChart>
          </ResponsiveContainer>
        </div>
    );
}

export default OverviewPieChart;