import AddNewAddressForm from '@/components/main/account/AddNewAddressForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { auth } from '@/lib/auth';
import { fetchAddressesByUser } from '@/lib/services/address';
import { HiOutlinePlusSmall } from 'react-icons/hi2';

async function AddressPage() {
  const session = await auth();
  const user = session?.user;
  const addresses = await fetchAddressesByUser(user?.id as string);

  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold">Addresses</h3>
      <div className="flex gap-3">
        {addresses.map((a) => (
          <div
            key={a.id}
            className="w-72 overflow-hidden rounded-md border hover:shadow-sm"
          >
            <div className="bg-gray-50">
              <p className="p-3">{a.title}</p>
            </div>
            <div className="p-3 text-xs">
              <p className="font-semibold">{user?.name}</p>
              <p>{a.addressLine1}</p>
              <p>{a.addressLine2}</p>
              <p>
                {a.city} / {a.country}
              </p>
              <p>{a.phoneNumber}</p>
            </div>
          </div>
        ))}
        <div className="group flex w-72 items-center justify-center overflow-hidden rounded-md border hover:shadow-sm">
          <Dialog>
            <DialogTrigger className="flex h-full min-h-[107px] w-full items-center justify-center">
              <HiOutlinePlusSmall className="h-8 w-8 text-gray-200 transition-colors group-hover:text-gray-300" />
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-[700px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add new address</DialogTitle>
                <DialogDescription className="w-full">
                  <AddNewAddressForm />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default AddressPage;
