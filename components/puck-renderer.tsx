import { Render, Data } from "@measured/puck";
import { config } from "@/configs/puck.config";

interface PuckRendererProps {
  data: Data;
}

export function PuckRenderer({ data }: PuckRendererProps) {
  return <Render config={config} data={data} />;
}
