import { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { magic } from '@/lib/magic';
import { UserContext } from '@/lib/UserContext';
import { toast } from 'react-hot-toast';
import Layout from '@/components/Layout';
import BullLottie from '@/components/BullLottie';

const Callback = () => {
  const router = useRouter();
  const [, setUser] = useContext(UserContext);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    const callback = async () => {
      try {
        await magic.oauth.getRedirectResult();
        let userMetadata = await magic.user.getMetadata();
        await setUser(userMetadata);
        router.push('/');
      } catch {
        if (showWarning) {
          toast.success('Redirecting ...');
          setShowWarning(false);
        }
        router.push('/');
      }
    };
    callback();
  }, [router, setUser, showWarning]);

  return (
    <Layout>
      <div className="max-w-lg mx-auto mt-10">
        <BullLottie />
      </div>
    </Layout>
  );
};

export default Callback;
