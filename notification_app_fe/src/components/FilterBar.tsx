import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { NotificationType } from "@/lib/types";

interface Props {
  value: NotificationType;
  onChange: (val: NotificationType) => void;
}

const TYPES: NotificationType[] = ["All", "Placement", "Result", "Event"];

export default function FilterBar({ value, onChange }: Props) {
  return (
    <Box mb={2}>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_e, val) => val && onChange(val)}
        size="small"
      >
        {TYPES.map((t) => (
          <ToggleButton key={t} value={t}>
            {t}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
