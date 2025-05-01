'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import useTransactions from '@/hooks/useTransactions';
import SkeletonWrapper from '@/components/SkeletonWrapper';

function TransactionHistory() {
	const { data, isLoading, error } = useTransactions();

	if (error) {
		return <div>Error loading transactions</div>;
	}

	return (
		<SkeletonWrapper isLoading={isLoading}>
			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Latest Transactions</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Description</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Type</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell>
										{transaction.description.charAt(0).toUpperCase() +
											transaction.description.slice(1)}
									</TableCell>
									<TableCell>{transaction.category_name}</TableCell>
									<TableCell>$ {transaction.amount.toFixed(2)}</TableCell>
									<TableCell
										className={
											transaction.transaction_type === 'income' ? 'text-green-500' : 'text-red-500'
										}
									>
										{transaction.transaction_type}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</SkeletonWrapper>
	);
}

export default TransactionHistory;
