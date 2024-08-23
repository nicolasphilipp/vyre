import { formatNumber } from "@/services/NumberFormatService";
import { SetStateAction, useState } from "react";
import { ResponsiveContainer, Pie, PieChart, Cell, Sector } from "recharts";

interface ValueProps {
  data: Data[]
}

interface Data {
  name: string;
  totalCount: number;
  value: number;
  ratio: number;
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
    let sum = 0;
    for(let i = 0; i < data.length; i++) {
      sum += data[i].value;
    }
    return sum;
  }

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value, name, totalCount, ratio
    } = props;
    
    return (
      <g>
        <text 
          x="50%"
          y="50%"
          dy={4}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
        > 
          {formatNumber(value)} €
        </text>
        <text 
          x="50%"
          y="50%"
          dy={24}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize={14}
        > 
          { name + ", " + ratio + ", " + totalCount}
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
        />
      </g>
    );
  };
    return (
        <ResponsiveContainer width={200} height={200}>
            <PieChart>
                <Pie
                  activeIndex={activeIndex === null ? undefined : activeIndex}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={activeIndex === index ? "#8400FF" : "#9353d3"} />
                    ))}
                </Pie>
                {activeIndex === null && (
                    <text
                      x="50%"
                      y="50%"
                      dy={4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                    >
                      {formatNumber(getTotalValue())} €
                    </text>
                )}       
            </PieChart>
        </ResponsiveContainer>
    );
}

export default OverviewPieChart;