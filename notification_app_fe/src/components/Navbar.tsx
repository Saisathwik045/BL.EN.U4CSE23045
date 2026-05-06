import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Campus Notifications
        </Typography>
        <Box>
          <Link href="/" passHref legacyBehavior>
            <Button color="inherit">All Notifications</Button>
          </Link>
          <Link href="/priority" passHref legacyBehavior>
            <Button color="inherit">Priority Inbox</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
