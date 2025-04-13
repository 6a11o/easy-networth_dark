
import { AddAccountForm } from "@/components/AddAccountForm";
import { AccountsList } from "@/components/AccountsList";

const AccountsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage Accounts</h1>
      </div>
      
      <AddAccountForm />
      <AccountsList />
    </div>
  );
};

export default AccountsPage;
