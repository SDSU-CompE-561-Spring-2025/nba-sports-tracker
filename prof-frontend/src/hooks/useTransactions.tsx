import { useQuery } from '@tanstack/react-query';
import { API_HOST_BASE_URL } from '@/lib/constants';

interface Transaction {
	id: string;
	amount: number;
	description: string;
	transaction_date: string;
	transaction_type: string;
	category_name: string;
}

function useTransactions() {
	return useQuery<Transaction[]>({
		queryKey: ['transactions'],
		queryFn: async () => {
			const token = localStorage.getItem('accessToken');
			const res = await fetch(`${API_HOST_BASE_URL}/transactions`, {
				headers: {
					Authorization: `Bearer ${token}`,
					mediaType: 'application/json',
				},
			});

			if (res.status !== 200) {
				if (res.status === 401) {
					localStorage.removeItem('accessToken');
					window.location.href = '/sign-in';
				}
				throw new Error('Error fetching transactions');
			} else {
				return await res.json();
			}
		},
	});
}

export default useTransactions;
