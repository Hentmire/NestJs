import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => ({
	uri: getMongoString(configService),
	...getMongoOptions(),
});

const getMongoString = (configService: ConfigService) =>
	'mongodb://' +
	// configService.get('MONGO_LOGIN') + //Somewhy it doesn't work with these params
	// ':' +
	// configService.get('MONGO_PASSWORD') +
	// '@' +
	configService.get('MONGO_HOST') +
	':' +
	configService.get('MONGO_PORT') +
	'/' +
	configService.get('MONGO_AUTHDB');


const getMongoOptions = () => ({
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
