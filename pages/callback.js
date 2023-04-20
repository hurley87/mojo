import { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { magic } from '@/lib/magic';
import { UserContext } from '@/lib/UserContext';
import { toast } from 'react-hot-toast';

const Callback = () => {
  const router = useRouter();
  const [, setUser] = useContext(UserContext);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    const callback = async () => {
      try {
        const result = await magic.oauth.getRedirectResult();
        console.log('result', result);
        let userMetadata = await magic.user.getMetadata();
        console.log('userMetadata', userMetadata);
        await setUser(userMetadata);
        router.push('/');
      } catch (error) {
        console.log('error', error);
        if (showWarning) toast.error('There was an error. Please try again.');
        setShowWarning(false);
        router.push('/');
      }
    };
    callback();
  }, [router, setUser, showWarning]);

  return <div>loading ...</div>;
};

export default Callback;
