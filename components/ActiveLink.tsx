
import { useRouter } from 'next/router';
import { withRouter, NextRouter } from 'next/router';
 
interface WithRouterProps {
  router: NextRouter;
}
interface MyComponentProps extends WithRouterProps {}
  function ActiveLink({router}:MyComponentProps) {
    const routers = useRouter();
 
  return (
    <button type="button" onClick={() => router.push('/about')}>
      Click me
    </button>
  );
}
export default withRouter(ActiveLink);