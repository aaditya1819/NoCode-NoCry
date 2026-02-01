import React from 'react'
import { appPlans } from '../assets/assets';
import Footer from '../components/Footer';
import api from '@/configs/axios';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
interface Plan {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
}

const Pricing = () => {
  const [plans] = React.useState<Plan[]>(appPlans)
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async (planId: string) => {
    try {
      if (!session?.user) {
        toast.error("Please login to purchase credits");
        return navigate('/auth/signin');
      }

      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const { data } = await api.post('/api/user/razorpay-payment', { planId });

      if (data.success) {
        const { order } = data;
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "AI Website Builder",
          description: `${planId} Plan Purchase`,
          order_id: order.id,
          handler: async (response: any) => {
            try {
              const { data: verifyData } = await api.post('/api/user/razorpay-verify', response);
              if (verifyData.success) {
                toast.success(verifyData.message);
                // Refresh credits by reloading or navigating
                window.location.reload();
              } else {
                toast.error(verifyData.message);
              }
            } catch (err: any) {
              toast.error(err.response?.data?.message || err.message);
            }
          },
          prefill: {
            name: session.user.name,
            email: session.user.email,
          },
          theme: {
            color: "#6366f1",
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  }
  return (
    <>
      <div className='w-full max-w-5xl mx-auto z-20 max-md:px-4 min-h-[80vh]'>
        <div className='text-center mt-10'>
          <h2 className='text-gray-100 text-3xl font-medium '>Choose Your Plan</h2>
          <p className='text-gray-100 text-sm max-w-md mx-auto mt-2'>Start for free and scale up as you grow. Find the perfect plan for your content creation needs.</p>

        </div>
        <div className='pt-14 py-4 px-4 '>
          <div className='grid grid-cols-1 md:grid-cols-3 flex-wrap gap-4'>
            {plans.map((plan, idx) => (
              <div key={idx} className="p-6 bg-black/20 ring ring-indigo-950 mx-auto w-full max-w-sm rounded-lg text-white shadow-lg hover:ring-indigo-500 transition-all duration-400">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="my-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-300"> / {plan.credits} credits</span>
                </div>

                <p className="text-gray-300 mb-6">{plan.description}</p>

                <ul className="space-y-1.5 mb-6 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="h-5 w-5 text-indigo-300 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handlePurchase(plan.id)} className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-sm rounded-md transition-all">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
        <p className='mx-auto text-center text-sm max-w-md mt-10 text-white/60 font-light'>
          <span className='text-white font-medium'>Creation / Revision</span> of projects consumes{' '}
          <span className='text-white font-medium'>5 credits</span> each. Purchase more credits to create additional projects.
        </p>

      </div>
      <Footer />


    </>
  )
}

export default Pricing

