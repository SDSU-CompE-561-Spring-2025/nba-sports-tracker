import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

function UserButton() {
	return (
		<div>
			<Button
				variant={'ghost'}
				size={'icon'}
			>
				<User />
			</Button>
		</div>
	);
}

export default UserButton;
