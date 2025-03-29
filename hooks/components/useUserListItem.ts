import { User } from "@/types/User";

interface UseUserListItemProps {
  user: User;
  onSelect?: (user: User) => void;
}

export function useUserListItem({ user, onSelect }: UseUserListItemProps) {
  const handlePress = () => {
    if (onSelect) {
      onSelect(user);
    }
  };

  return { handlePress };
}