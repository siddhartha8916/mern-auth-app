import { Button } from "@/components/ui/button";

const OAuthLoginForm = () => {
  const handleSignInWithGoogle = async () => {
    console.log('first')
  };

  const handleSignInWithFacebook = async () => {
    console.log('first')
  };

  return (
    <div className="mt-2">
      <div className="flex flex-col gap-2">
        <Button className="bg-red-800 w-full" onClick={handleSignInWithGoogle}>
          SIGN IN WITH GOOGLE
        </Button>
        <Button className="bg-blue-800 w-full" onClick={handleSignInWithFacebook}>SIGN IN WITH FACEBOOK</Button>
      </div>
    </div>
  );
};

export default OAuthLoginForm;
