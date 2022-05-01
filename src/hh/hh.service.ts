import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { API_URL, SALARY_CLUSTER_ID, SALARY_CLUSTER_NOT_FOUND_ERROR } from './hh.constants';
import { HHResponse } from './hh.models';
import { HhData } from '../top-page/top-page.model';

@Injectable()
export class HhService {
	constructor(private readonly httpSerivce: HttpService) { }

	async getData(text: string) {
		try {
			const { data } = await this.httpSerivce.get<HHResponse>(API_URL.vacancies, {
				params: {
					text,
					clusters: true,
				},
				headers: {
					'User-Agent': 'OwlTop/1.0 (antonarichev@gmail.com)',
				}
			}).toPromise();
			return this.parseData(data);
		} catch (e) {
			Logger.error(e);
		}
	}

	private parseData(data: HHResponse): HhData {
		const salaryCluster = data.clusters.find(c => c.id === SALARY_CLUSTER_ID);
		if (!salaryCluster) {
			throw new Error(SALARY_CLUSTER_NOT_FOUND_ERROR);
		}

		const juniorSalary = this.getSalaryFromString(salaryCluster.items[1].name);
		const middleSalary = this.getSalaryFromString(
			salaryCluster.items[Math.ceil(salaryCluster.items.length / 2)].name
		);
		const seniorSalary = this.getSalaryFromString(
			salaryCluster.items[salaryCluster.items.length - 1].name
		);

		return {
			count: data.found,
			juniorSalary,
			middleSalary,
			seniorSalary,
			updatedAt: new Date(),
		};
	}

	private getSalaryFromString(s: string): number {
		const numberRegExp = /(\d+)/g;
		const res = s.match(numberRegExp);
		if (!res) {
			return 0;
		}
		return Number(res[0]);
	}
}
