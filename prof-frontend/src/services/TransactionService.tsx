import { API_HOST_BASE_URL } from '@/lib/constants';
import { TransactionFormData } from '@/hooks/useAddNewTransaction';

const createTransaction = async (transactionData: TransactionFormData) => {
	// Get Access Token from Local Storage
	const accessToken = localStorage.getItem('accessToken');

	// Throw error if access token is not available
	if (!accessToken) {
		window.location.href = '/login';
		throw new Error('Unauthorized');
	}

	console.log('transactionData', transactionData);
	const response = await fetch(`${API_HOST_BASE_URL}/transactions/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(transactionData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Failed to create transaction');
	}

	return response.json();
};

export default createTransaction;
