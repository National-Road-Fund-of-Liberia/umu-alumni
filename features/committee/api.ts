import { createResourceClient } from "@/lib/resource-client";
import type { CommitteeMemberFormValues } from "@/schemas/committee";
import type { CommitteeMember } from "@/types/committee";

export const committeeApi = createResourceClient<CommitteeMember, CommitteeMemberFormValues>("/api/admin/committee");
