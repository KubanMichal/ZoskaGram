"use client";

import * as React from "react";
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Box, 
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LoginIcon from "@mui/icons-material/Login";
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PersonIcon from '@mui/icons-material/Person';
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const [value, setValue] = React.useState<string>("/");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { mode, toggleTheme } = useTheme();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileOption = (option: string) => {
    handleProfileMenuClose();
    if (option === 'profile') {
      router.push('/profile');
    } else if (option === 'logout') {
      signOut({ callbackUrl: '/' });
    }
  };

  const handleNavigation = (event: React.SyntheticEvent, newValue: string) => {
    console.log("Navigating to:", newValue);
    if (newValue === '/profile') {
      return; // Don't navigate directly, let the menu handle it
    }
    setValue(newValue);
    if (!session && newValue !== "/auth/registracia" && newValue !== "/auth/prihlasenie" && newValue !== "/" && newValue !== "/o-mne" && newValue !== "/gdpr") {
      router.push("/auth/registracia");
    } else {
      router.push(newValue);
    }
  };

  const nonAuthPaths = [
    { label: "Domov", value: "/", icon: <HomeIcon /> },
    { label: "O mne", value: "/o-mne", icon: <AccessibilityIcon /> }, 
    { label: "Registrácia", value: "/auth/registracia", icon: <AppRegistrationIcon /> },
    { label: "Prihlásenie", value: "/auth/prihlasenie", icon: <LoginIcon /> },
  ];

  const authPaths = [
    { label: "Domov", value: "/", icon: <HomeIcon /> },
    { label: "Hľadať", value: "/hladat", icon: <SearchIcon /> },
    { label: "Pridať", value: "/pridat", icon: <AddCircleIcon /> },
    {
      label: "Profil",
      value: "/profile",
      icon: session?.user?.image ? (
        <Avatar 
          alt={session?.user?.name || "User"} 
          src={session?.user?.image || undefined}
          onClick={handleProfileMenuOpen}
          sx={{ cursor: 'pointer' }}
        />
      ) : (
        <Avatar 
          onClick={handleProfileMenuOpen}
          sx={{ cursor: 'pointer' }}
        >
          {session?.user?.name?.charAt(0) || "U"}
        </Avatar>
      ),
    },
  ];

  const navigationPaths = status === "authenticated" ? authPaths : nonAuthPaths;

  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: 0 }}>
      <IconButton 
        sx={{ position: 'absolute', right: 16, top: -48 }}
        onClick={toggleTheme}
        color="inherit"
      >
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      <BottomNavigation showLabels value={value} onChange={handleNavigation}>
        {navigationPaths.map((path) => (
          <BottomNavigationAction
            key={path.value}
            label={path.label}
            value={path.value}
            icon={path.icon}
          />
        ))}
      </BottomNavigation>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleProfileOption('profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Môj profil</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleProfileOption('logout')}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Odhlásiť sa</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}