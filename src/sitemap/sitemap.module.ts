import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SitemapController } from './sitemap.controller';
import { TopPageModule } from '../top-page/top-page.module';

@Module({
  controllers: [SitemapController],
  imports: [TopPageModule, ConfigModule]
})
export class SitemapModule {}
