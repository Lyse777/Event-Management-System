import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

  
    useEffect(() => {
      if (status === 'loading') return; 

      if (!session) {
        router.replace('/login');
      }
    }, [session, status, router]);

   
    if (status === 'loading') return <div>Loading...</div>;

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
