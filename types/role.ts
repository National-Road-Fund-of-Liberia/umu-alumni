/**
 * v1 has exactly one role. This type models a permission set as data so the
 * Roles screen can render a real reference table instead of hard-coded JSX,
 * and so a future multi-role system only needs new Role records — not a
 * new shape.
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}
