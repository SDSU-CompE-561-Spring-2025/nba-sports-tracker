'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import createTransaction from '@/services/TransactionService';

// Validation Schema
const transactionSchema = z.object({
	transaction_type: z.enum(['expense', 'income']),
	description: z.string().min(1, { message: 'Description is required' }),
	amount: z.coerce.number().positive({ message: 'Amount must be positive' }),
	category_id: z.number().positive({ message: 'Category id must be positive' }),
});

// Type inference from schema
export type TransactionFormData = z.infer<typeof transactionSchema>;

export const useAddNewTransaction = () => {
	const queryClient = useQueryClient();

	const mutate = useMutation<void, Error, TransactionFormData>({
		mutationFn: (data) => createTransaction(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['transactions'] }).then((r) => r);
			toast({
				title: 'Success',
				description: 'Transaction added successfully',
				variant: 'success',
			});
		},
		onError: (error: any) => {
			toast({
				title: 'Error',
				description: error.message || 'Failed to add transaction',
				variant: 'destructive',
			});
		},
	});

	const form = useForm<TransactionFormData>({
		resolver: zodResolver(transactionSchema),
		defaultValues: {
			transaction_type: 'expense',
			description: '',
			amount: 0,
			category_id: 1,
		},
	});

	const handleSubmit = (data: TransactionFormData) => {
		mutate.mutate(data);
		console.log(data + 'submitted');
		form.reset();
	};

	return {
		form,
		handleSubmit,
	};
};
