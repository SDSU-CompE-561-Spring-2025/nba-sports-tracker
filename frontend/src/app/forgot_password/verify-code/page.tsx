"use-client"

import VerifyCodeForm from '@/components/VerifyCodeForm';

function ForgotPasswordPage() {
  return (
    <div className="
    flex flex-col items-center justify-center 
    bg-background
    container mx-auto px-4 mt-25
    "
    >
      <div className={"items-center w-75"}>
        <VerifyCodeForm />
      </div>

    </div>
  )
}

export default ForgotPasswordPage;