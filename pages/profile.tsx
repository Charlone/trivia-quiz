import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

export default function Profile() {
  const { user, error, isLoading } = useUser();
  const {push} = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (!user) {
    push('/home');
  }

  return (
    user && (
      <div className={'container'}>
        <div className={"row"}>
          <div style={{ height: '100vh' }} className={"col-12 d-flex justify-content-center align-items-center flex-column align-content-center"}>
            <img src={user.picture ? user.picture : ''} alt={user.name ? user.name : ''} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
      </div>
    )
  );
}