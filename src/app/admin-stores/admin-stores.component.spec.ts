import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStoresComponent } from './admin-stores.component';

describe('AdminStoresComponent', () => {
	let component: AdminStoresComponent;
	let fixture: ComponentFixture<AdminStoresComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ AdminStoresComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminStoresComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
