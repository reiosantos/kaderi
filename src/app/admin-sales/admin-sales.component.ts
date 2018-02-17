import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {isBoolean, isNullOrUndefined} from 'util';
import {SaleService} from '../_services/sale.service';
import {AlertService} from '../_services/alert.service';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import {Sale} from '../_models/sale';

@Component({
	selector: 'app-admin-sales',
	templateUrl: './admin-sales.component.html',
	styleUrls: ['./admin-sales.component.css']
})
export class AdminSalesComponent implements OnInit, OnChanges {

	@Input() store_id: any;
	loading = false;
	sales: any = [];
	salesKeys: any = [];

	today: any;

	profits_today = '0 Ugx';
	losses_today = '0 Ugx';
	profits_ever = '0 Ugx';
	losses_ever = '0 Ugx';

	constructor(
		private saleService: SaleService,
		private alertService: AlertService,
	) { }

	ngOnInit() {
		const d =  new Date();
		this.today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		this.refreshSales();
	}

	ngOnChanges() {
		console.log(this.store_id);
		this.refreshSales();
	}

	refreshSales(): void {
		this.saleService.getAll(this.store_id).subscribe(
			data => {
				this.sales = [];
				this.salesKeys = [];
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)){
					this.sales = data.data;
					this.salesKeys = Object.keys(data.data);
				}
				this.calculate_sales();
				// this.subscribeToData();
			},
		);
	}

	private calculate_sales() {
		let pr_today = 0, ls_today = 0, pr_ever = 0, ls_ever = 0;

		for ( let i = 0; i < this.salesKeys.length; i++) {
			const key = this.salesKeys[i];
			for ( let j = 0; j < this.sales[key].length; j ++) {
				const sale = this.sales[key][j];
				sale.profit = parseFloat(sale.profit);
				if (key === this.today){
					if (sale.profit >= 0){
						pr_today += sale.profit;
					}else{
						ls_today += sale.profit;
					}
				}
				if (sale.profit >= 0){
					pr_ever += sale.profit;
				}else{
					ls_ever += sale.profit;
				}
			}
		}
		this.profits_today = pr_today + ' Ugx';
		this.profits_ever = pr_ever + ' Ugx';
		this.losses_today = (ls_today * -1) + ' Ugx';
		this.losses_ever = (ls_ever * -1) + ' Ugx';
	}

	deleteSale(sale: Sale) {
		if (confirm('Are You sure To Delete This Transaction ?')) {
			this.loading = true;
			this.saleService.delete(sale.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data){
						this.alertService.success('Transaction has been deleted...', false);
						this.refreshSales();
					}else{
						this.alertService.error(data.error);
					}
					this.loading = false;
				},
				error => {
					this.alertService.error(error.error);
					this.loading = false;
				}
			);
		}
	}

}
