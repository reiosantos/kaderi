import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Product} from '../_models/product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services/alert.service';
import {User} from '../_models/user';
import {isBoolean, isNullOrUndefined} from 'util';
import {ProductService} from '../_services/product.service';
import {environment} from '../../environments/environment.prod';

@Component({
	selector: 'app-admin-products',
	templateUrl: './admin-products.component.html',
	styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnChanges {

	@Input() store_id: any;
	user: User;
	modalProduct: Product;
	originalModalProduct: Product;
	productOutput: Product[];
	addProductForm: FormGroup;
	today: Date;

	loading = false;
	productSubmitted = false;
	constructor(
		private alertService: AlertService,
		private productService: ProductService,
		private fb: FormBuilder
	) {
		this.user = JSON.parse(localStorage.getItem(environment.userStorageKey));
		this.addProductForm = fb.group({
			item_name: ['', Validators.compose([Validators.required])],
			item_price: ['', Validators.compose([Validators.required, Validators.min(50)])],
			quantity: ['', Validators.compose([Validators.required, Validators.min(1)])],
		});
		this.modalProduct = new Product();
		this.today = new Date();
	}

	ngOnInit() {
		this.refreshProducts();
	}

	ngOnChanges() {
		this.refreshProducts();
	}

	productSubmit() {
		this.productSubmitted = true;
		if (this.addProductForm.valid) {
			this.loading = true;
			const pr = new Product();
			pr.item_name = this.addProductForm.controls.item_name.value;
			pr.item_price = this.addProductForm.controls.item_price.value;
			pr.last_purchase_quantity = this.addProductForm.controls.quantity.value;
			pr.store_id = this.store_id;

			if (this.modalProduct) {
				pr.id = this.modalProduct.id;
				pr.last_purchase_date = this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate() + ' ' +
					'' + this.today.getHours() + ':' + this.today.getMinutes() + ':' + this.today.getSeconds();
			}
			this.productService.createOrUpdate(pr).subscribe(
				data => {
					if (!data){
						this.alertService.error('Internal Server Error. Consult the administrator.');
					}else if (!isNullOrUndefined(data.data) && data.data){
						if (this.modalProduct) {
							this.alertService.success('Product has been modified...', false);
						}else{
							this.alertService.success('new product has been added...', false);
						}
						this.addProductForm.reset('');
						this.productSubmitted = false;
						this.modalProduct = new Product();
						this.originalModalProduct = new Product();
						this.refreshProducts();
					}else{
						this.alertService.error('Unable to add product....Try again');
					}
					this.loading = false;
				}, error => {this.alertService.error('Unable to save product...' + error.error);
					this.loading = false;
				});
		}
	}

	editProduct(product: Product) {
		this.modalProduct = product;
		this.modalProduct.last_purchase_quantity = 1;
		this.originalModalProduct = product;
	}

	deleteProduct(product: Product) {
		if (confirm('Are You sure To Delete This Product ?')) {
			this.loading = true;
			this.productService.delete(product.id).subscribe(data => {
					if (data && !isNullOrUndefined(data.data) && data.data){
						this.refreshProducts();
						this.alertService.success('Product has been deleted...', false);
					}else{
						this.alertService.error('Sorry... An Error occurred, Unable to delete Product');
					}
					this.loading = false;
				}, error => {
					this.alertService.error('Sorry... Error occurred, Unable to delete Product');
					this.loading = false;
				}
			);
		}
	}

	refreshProducts() {
		this.productService.getAll(this.store_id).subscribe(
			data => {
				this.productOutput = [];
				if (data && !isNullOrUndefined(data.data) && data.data && !isBoolean(data.data)){
					this.productOutput = data.data;
				}
			},
		);
	}
}
