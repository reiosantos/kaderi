import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {User} from '../_models/user';
import {Product} from '../_models/product';
import {ProductService} from '../_services/product.service';
import {AlertService} from '../_services/alert.service';
import {isBoolean, isNullOrUndefined} from 'util';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Sale} from '../_models/sale';
import {SaleService} from '../_services/sale.service';
import {CommentService} from '../_services/comment.service';
import {environment} from '../../environments/environment.prod';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
	user: User;
	products: Product[];
	tempProducts: Product[];
	sales: any = [];
	salesKeys: any = [];
	productSubscription: any;
	timerSubscription: any;

	commentReceived = false;
	savingComment = false;
	commentSubmitted = false;
	saleSubmitted = false;
	saleLoading = false;

	commentForm: FormGroup;
	commentStatus: string;
	// sales variable
	productSaleItem: Product = null;
	saleQuantity: number;
	salePrice: number;
	saleForm: FormGroup;
	saleItem: Sale;

	searchTerm: string;
	searchForm: FormGroup;
	today: any;

	constructor(
		private productService: ProductService,
		private saleService: SaleService,
		private commentService: CommentService,
		private alertService: AlertService,
		private formBuilder: FormBuilder,
		private location: Location
	) {
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		this.saleForm = formBuilder.group({
			quantity: ['', Validators.compose([Validators.required, Validators.min(0)])],
			price: ['', Validators.compose([Validators.required, Validators.min(50)])],
			product: ['', Validators.compose([Validators.required])],
		});
		this.searchForm = formBuilder.group({ search: [''] });
		this.commentForm = formBuilder.group({ comment: ['', Validators.compose([Validators.required])]});
	}

	ngOnInit() {
		const d =  new Date();
		this.today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		this.refreshData();
		this.refreshSales();
	}

	ngOnDestroy(): void {
		if (this.productSubscription){
			this.productSubscription.unsubscribe();
		}
		if (this.timerSubscription){
			this.timerSubscription.unsubscribe();
		}
	}

	productClicked(product: Product) {
		this.productSaleItem = product;
	}

	searchProduct() {
		this.searchTerm = this.searchForm.controls.search.value;
		const temp: Product[] = [];
		for (let i = 0; i < this.tempProducts.length; i++) {
			const product = this.tempProducts[i];
			if ((product.item_name.toLowerCase()).search(this.searchTerm.toLowerCase()) >= 0) {
				temp.push(product);
			}
		}
		this.products = temp;
	}

	formSubmit() {
		this.saleSubmitted = true;
		if (this.saleForm.valid) {
			this.salePrice = this.saleForm.controls.price.value;
			this.saleQuantity = this.saleForm.controls.quantity.value;
			this.saleItem = new Sale();
			this.saleItem.product_id = this.productSaleItem.id;
			this.saleItem.sale_price = this.salePrice;
			this.saleItem.sale_quantity = this.saleQuantity;
			this.saleItem.total_price = (this.salePrice * this.saleQuantity);
			this.saleItem.profit = ((this.saleItem.total_price) - (this.productSaleItem.item_price * this.saleQuantity));
			const d = new Date();
			this.saleItem.sale_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' +
				'' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
			this.saleItem.user_id = this.user.id;

			if (this.saleQuantity > this.productSaleItem.available_quantity) {
				this.alertService.error('Sorry... only "' + this.productSaleItem.available_quantity + '"' +
					' products are available at the store. And you need "' + this.saleQuantity + '" products');
				return false;
			}
			this.saleLoading = true;
			this.saleService.createOrUpdate(this.saleItem).subscribe(
				data => {
					if (!data){
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data){
						this.alertService.success('Changes have been saved...', false);
						this.saleItem = null; this.saleQuantity = 0; this.salePrice = 50; this.productSaleItem = null;
						this.refreshSales();
						this.refreshData();
					}else{
						this.alertService.error(data.error);
					}
					this.saleLoading = false;
				},
				error => {
					this.alertService.error(error.error);
					this.saleLoading = false;
				});
		}
	}

	refreshSales() {
		this.saleService.getAll(this.user.store_id).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)){
					this.sales = data.data;
					this.salesKeys = Object.keys(data.data);
				}
			},
		);
	}

	saveComment() {
		this.commentSubmitted = true;
		if (this.commentForm.valid) {
			this.savingComment = true;
			const comm = this.commentForm.controls.comment.value;
			this.commentService.insertComment(comm).subscribe(
				data => {
					if (data && data.data){
						this.commentStatus = 'Comment has been received.';
						this.commentReceived = true;
					}else {
						this.commentReceived = false;
						this.commentStatus = 'sorry! the comment could not be saved. Please try again.';
					}
					this.commentSubmitted = false;
					this.savingComment = false;
				},
				error => {
					this.commentStatus = 'sorry! the comment could not be saved. Please try again. ' + error;
					this.savingComment = false;
					this.commentReceived = false;
				});
		}
	}

	private refreshData(): void {
		this.productSubscription = this.productService.getAll(this.user.store_id).subscribe(
			data => {
				if (data && !isNullOrUndefined(data.data) && !isBoolean(data.data)){
					const temp: Product[] = [];
					for (let i = 0; i < data.data.length; i++) {
						const product = data.data[i];
						if (product.available_quantity > 0) {
							temp.push(product);
						}
					}
					this.products = temp;
					this.tempProducts = temp;
				}
				this.subscribeToData();
			},
		);
	}

	private subscribeToData(): void {
		this.timerSubscription = Observable.timer(300000).first().subscribe(() => this.refreshData());
	}

	/**
	 * editSale(sale: SalesOutput) {
	 * }
	 */

	deleteSale(sale: Sale) {
		if (confirm('Are You sure To Delete This Transaction ?')) {
			this.saleLoading = true;
			this.saleService.delete(sale.id).subscribe(
				data => {
					if (data && !isNullOrUndefined(data.data) && data.data){
						this.alertService.success('Item has been deleted...', false);
						this.refreshSales();
					}else{
						this.alertService.error(data.error);
					}
					this.saleLoading = false;
				},
				error => {
					this.alertService.error(error.error);
					this.saleLoading = false;
				}
			);
		}
	}
}
