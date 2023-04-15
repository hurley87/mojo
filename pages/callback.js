import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { magic } from '../lib/magic';
import { UserContext } from '../lib/UserContext';

const Callback = () => {
  const router = useRouter();
  const [, setUser] = useContext(UserContext);

  useEffect(() => {
    const callback = async () => {
      try {
        const didToken = await magic.oauth.getRedirectResult();
        console.log('didToken', didToken);
        const metadata = await magic.user.getMetadata();
        console.log('metadata', metadata);
        setUser(metadata);
        router.push('/');
      } catch (error) {
        console.log('error', error);
      }
    };
    callback();
    // Send token to server to validate
    // const authenticateWithServer = async (didToken) => {
    //   let res = await fetch('/api/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: 'Bearer ' + didToken,
    //     },
    //   });

    //   if (res.status === 200) {
    //     // Set the UserContext to the now logged in user
    //     let userMetadata = await magic.user.getMetadata();
    //     await setUser(userMetadata);
    //     router.push('/');
    //   }
    // };
  }, [router, setUser]);

  return <div>loading ...</div>;
};

export default Callback;
