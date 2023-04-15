import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { magic } from '@/lib/magic';
import { UserContext } from '@/lib/UserContext';

const Callback = () => {
  const router = useRouter();
  const [, setUser] = useContext(UserContext);

  useEffect(() => {
    const callback = async () => {
      try {
        await magic.oauth.getRedirectResult();
        let userMetadata = await magic.user.getMetadata();
        await setUser(userMetadata);
        router.push('/');
      } catch (error) {
        console.log('error', error);
      }
    };
    callback();
  }, [router, setUser]);

  return <div>loading ...</div>;
};

export default Callback;
