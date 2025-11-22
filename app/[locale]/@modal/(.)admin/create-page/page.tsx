import { BaseModal } from "@/components/modals/base-modal";
import { CreatePageModal } from "@/components/modals/create-page-modal";

export default function CreatePageModalRoute() {
  return (
    <BaseModal>
      <CreatePageModal />
    </BaseModal>
  );
}
