import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function GET({ url }) {
	try {
		const pageQueryParam = url.searchParams.get('page');
		const limitQueryParam = url.searchParams.get('limit');
		const orderBy = url.searchParams.get('orderBy') === 'asc' ? 'asc' : 'desc';

		const page = pageQueryParam ? parseInt(pageQueryParam, 10) : 1;
		const limit = limitQueryParam ? parseInt(limitQueryParam, 10) : 10;
		const skip = (page - 1) * limit;

		const [totalUsers, users] = await Promise.all([
			prisma.user.count(),
			prisma.user.findMany({
				skip,
				take: limit,
				orderBy: {
					createdAt: orderBy
				}
			})
		]);

		const totalPages = Math.ceil(totalUsers / limit);
		const hasNextPage = page < totalPages;
		const hasPreviousPage = page > 1;

		const json_response = {
			status: 'success',
			pagination: {
				totalPages,
				currentPage: page,
				totalResults: totalUsers,
				hasNextPage,
				hasPreviousPage
			},
			users
		};
		return json(json_response);
	} catch (error: any) {
		const error_response = {
			status: 'error',
			message: error.message
		};
		return json(error_response, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const requestData = await request.json();

		const user = await prisma.user.create({
			data: requestData
		});

		const json_response = {
			status: 'success',
			data: {
				user
			}
		};
		return json(json_response, { status: 201 });
	} catch (error: any) {
		if (error.code === 'P2002') {
			const error_response = {
				status: 'fail',
				message: 'Email already in use. Please use another email.'
			};
			return json(error_response, { status: 409 });
		}

		const error_response = {
			status: 'error',
			message: error.message
		};
		return json(error_response, { status: 500 });
	}
}

