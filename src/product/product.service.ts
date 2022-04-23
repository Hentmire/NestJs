import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProduceDto } from './dto/create-produce.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from '../review/review.model';

@Injectable()
export class ProductService {
	constructor(@InjectModel(ProductModel) private readonly produceModel: ModelType<ProductModel>) { }

	async create(dto: CreateProduceDto) {
		return this.produceModel.create(dto);
	}

	async findById(id: string) {
		return this.produceModel.findById(id).exec();
	}

	async deleteById(id: string) {
		return this.produceModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateProduceDto) {
		return this.produceModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findWithReviews(dto: FindProductDto) {
		return this.produceModel.aggregate([
			{
				$match: {
					categories: dto.category,
				}
			},
			{
				$sort: {
					_id: 1,
				}
			},
			{
				$limit: dto.limit,
			},
			{
				$lookup: {
					from: 'Review',
					localField: '_id',
					foreignField: 'productId',
					as: 'reviews'
				}
			},
			{
				$addFields: {
					reviewCount: { $size: '$reviews' },
					reviewAvg: { $avg: '$reviews.rating' }
				}
			}
		]).exec() as unknown as (ProductModel & { review: ReviewModel[], reviewCount: number, reviewAvg: number })[];
	}
}
