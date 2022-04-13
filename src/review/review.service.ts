import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { ReviewModel } from './review.model';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
	constructor(@InjectModel(ReviewModel) private readonly ReviewModel: ModelType<ReviewModel>) { }

	async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return this.ReviewModel.create(dto);
	}

	async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
		return this.ReviewModel.findByIdAndDelete(id).exec();
	}

	async findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
		return this.ReviewModel.find({ productId: new Types.ObjectId(productId) }).exec();
	}

	async deleteByProductId(productId: string) {
		return this.ReviewModel.deleteMany({ productId: new Types.ObjectId(productId) }).exec();
	}
}
